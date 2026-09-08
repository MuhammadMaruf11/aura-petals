"use server";

import crypto from "node:crypto";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from "@/lib/validations/auth";
import type { AuthActionState } from "@/server/actions/auth.actions";

const RESET_TOKEN_TTL_MS = 1000 * 60 * 30; // 30 minutes

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Issues a password reset token. Always returns success (even if the email
 * doesn't exist) to avoid leaking which emails are registered.
 * The raw token is returned only so the calling code can email/log it —
 * in production this should be sent via a transactional email provider
 * instead of ever being shown to the client.
 */
export async function requestPasswordReset(
  input: ForgotPasswordInput,
): Promise<AuthActionState & { devToken?: string }> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) {
    return { success: true };
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(rawToken),
      expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    },
  });

  // TODO: wire up a transactional email provider. For now, in development,
  // the raw token is returned so the reset flow can be exercised end-to-end.
  return {
    success: true,
    devToken: process.env.NODE_ENV !== "production" ? rawToken : undefined,
  };
}

export async function resetPassword(
  input: ResetPasswordInput,
): Promise<AuthActionState> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const tokenHash = hashToken(parsed.data.token);
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (
    !record ||
    record.usedAt ||
    record.expiresAt.getTime() < Date.now()
  ) {
    return { success: false, message: "This reset link is invalid or has expired." };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return { success: true };
}
