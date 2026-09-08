"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/current-user";
import { adminToggleCustomerActive } from "@/server/services/admin-customer.service";
import type { AdminActionResult } from "@/server/actions/admin-product.actions";

export async function toggleCustomerActiveAction(
  userId: string,
  isActive: boolean,
): Promise<AdminActionResult> {
  await requireAdmin();
  await adminToggleCustomerActive(userId, isActive);
  revalidatePath(`/admin/customers/${userId}`);
  revalidatePath("/admin/customers");
  return { success: true };
}
