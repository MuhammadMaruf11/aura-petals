import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { prisma } from "@/lib/db/prisma";
import { sessionCookieConfig, verifySessionToken } from "@/lib/auth/session";
import type { UserRole } from "@prisma/client";

/**
 * Reads and verifies the session cookie for the current request, AND
 * confirms the user it names still exists and is active.
 *
 * A cryptographically valid JWT only proves the token wasn't tampered
 * with — it does NOT prove the user it names still exists in the
 * database. A stale cookie (left over from a dev database reset/reseed,
 * or from an account an admin later deleted/deactivated) would otherwise
 * carry a `sub` that has no matching User row. Several call sites
 * (cart, wishlist, order, checkout) feed `session.sub` straight into
 * FK-constrained writes like `Cart.userId` — without this check, a stale
 * session crashes those with a Prisma P2003 foreign-key violation instead
 * of behaving like a logged-out visitor.
 *
 * This check lives here, once, rather than being repeated (or missed) at
 * every call site — every consumer of `getSession()` gets the guarantee
 * that a non-null result names a real, active user.
 *
 * Cached per-request so multiple server components/actions calling this
 * don't each re-verify the JWT or re-query the user.
 */
export const getSession = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieConfig.name)?.value;
  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, isActive: true },
  });
  if (!user || !user.isActive) return null;

  return payload;
});

/**
 * Returns the full, fresh user record from the database for the current
 * session, or null if not authenticated / the user was deactivated.
 */
export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user || !user.isActive) return null;

  return user;
});

/** Throws if there is no authenticated user. Use in server actions/route handlers. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }
  return user;
}

/** Throws if there is no authenticated user with the given role. */
export async function requireRole(role: UserRole) {
  const user = await requireUser();
  if (user.role !== role) {
    throw new Error("FORBIDDEN");
  }
  return user;
}

export async function requireAdmin() {
  return requireRole("ADMIN");
}
