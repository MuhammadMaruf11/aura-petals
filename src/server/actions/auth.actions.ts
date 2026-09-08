"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSessionToken, sessionCookieConfig, adminSessionCookieConfig } from "@/lib/auth/session";
import { mergeGuestCartIntoUserCart } from "@/server/services/cart.service";
import { peekGuestToken, clearGuestToken } from "@/lib/cart/guest-token";
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "@/lib/validations/auth";

export type AuthActionState = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

async function establishCustomerSession(user: {
  id: string;
  role: "ADMIN" | "CUSTOMER";
  email: string;
  name: string;
}) {
  const token = await createSessionToken({
    sub: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
  });
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieConfig.name, token, sessionCookieConfig.options);
}

async function establishAdminSession(user: {
  id: string;
  role: "ADMIN" | "CUSTOMER";
  email: string;
  name: string;
}) {
  const token = await createSessionToken({
    sub: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
  });
  const cookieStore = await cookies();
  cookieStore.set(adminSessionCookieConfig.name, token, adminSessionCookieConfig.options);
}

/**
 * Folds any items from the visitor's pre-login guest cart into their
 * now-authenticated cart, then drops the now-empty guest cookie.
 * `mergeGuestCartIntoUserCart` was previously written but never called
 * from anywhere — guest cart items were silently lost on every
 * login/registration. Called after establishCustomerSession() so this always
 * runs for both new registrations and existing logins.
 */
async function mergeGuestCartIfPresent(userId: string) {
  const guestToken = await peekGuestToken();
  if (!guestToken) return;
  await mergeGuestCartIntoUserCart(userId, guestToken);
  await clearGuestToken();
}

export async function registerUser(
  input: RegisterInput,
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const { name, email, phone, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return {
      success: false,
      fieldErrors: { email: ["An account with this email already exists"] },
    };
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone: phone || null,
      passwordHash,
      role: "CUSTOMER",
    },
  });

  // Every customer gets an empty cart + wishlist ready to use.
  await prisma.$transaction([
    prisma.cart.create({ data: { userId: user.id } }),
    prisma.wishlist.create({ data: { userId: user.id } }),
  ]);

  await establishCustomerSession(user);
  await mergeGuestCartIfPresent(user.id);

  return { success: true };
}

export async function loginUser(input: LoginInput): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  // Generic "Invalid email or password" for every failure case, including
  // "this account exists but isn't a customer account" — the customer
  // login form must never become a way to authenticate an admin account,
  // and must not reveal account existence/role either.
  if (!user || !user.isActive || user.role !== "CUSTOMER") {
    return { success: false, message: "Invalid email or password" };
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return { success: false, message: "Invalid email or password" };
  }

  await establishCustomerSession(user);
  await mergeGuestCartIfPresent(user.id);

  return { success: true };
}

export async function loginAdmin(input: LoginInput): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  // Same generic message for every failure case, including "this account
  // exists but isn't an admin account" — the admin login form must never
  // become a way to authenticate a customer account into the admin
  // session, and must not reveal account existence/role either.
  if (!user || !user.isActive || user.role !== "ADMIN") {
    return { success: false, message: "Invalid email or password" };
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return { success: false, message: "Invalid email or password" };
  }

  await establishAdminSession(user);
  // Deliberately no mergeGuestCartIfPresent() here — admins don't have
  // shopping carts, and an admin login must not touch the customer-side
  // guest cart cookie at all.

  return { success: true };
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieConfig.name);
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete({ name: adminSessionCookieConfig.name, path: "/admin" });
}
