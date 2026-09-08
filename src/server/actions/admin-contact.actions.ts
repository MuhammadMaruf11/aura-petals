"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/current-user";
import {
  adminMarkContactMessageRead,
  adminDeleteContactMessage,
} from "@/server/services/admin-contact.service";
import type { AdminActionResult } from "@/server/actions/admin-product.actions";

export async function markContactReadAction(
  id: string,
  isRead: boolean,
): Promise<AdminActionResult> {
  await requireAdmin();
  await adminMarkContactMessageRead(id, isRead);
  revalidatePath("/admin/contacts");
  revalidatePath(`/admin/contacts/${id}`);
  return { success: true };
}

export async function deleteContactMessageAction(id: string): Promise<AdminActionResult> {
  await requireAdmin();
  await adminDeleteContactMessage(id);
  revalidatePath("/admin/contacts");
  return { success: true };
}
