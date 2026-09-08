"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/current-user";
import { prisma } from "@/lib/db/prisma";
import {
  adminUpdateOrderStatus,
  adminUpdateTrackingInfo,
} from "@/server/services/order.service";
import type { OrderStatus, PaymentStatus } from "@prisma/client";
import type { AdminActionResult } from "@/server/actions/admin-product.actions";

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus,
  note?: string,
): Promise<AdminActionResult> {
  await requireAdmin();
  await adminUpdateOrderStatus(orderId, status, note);
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  return { success: true };
}

export async function updateOrderTrackingAction(
  orderId: string,
  data: { courierName?: string; trackingNumber?: string; trackingUrl?: string },
): Promise<AdminActionResult> {
  await requireAdmin();
  await adminUpdateTrackingInfo(orderId, data);
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

export async function updatePaymentStatusAction(
  orderId: string,
  paymentStatus: PaymentStatus,
): Promise<AdminActionResult> {
  await requireAdmin();
  await prisma.order.update({ where: { id: orderId }, data: { paymentStatus } });
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

export async function updateOrderAdminNoteAction(
  orderId: string,
  adminNote: string,
): Promise<AdminActionResult> {
  await requireAdmin();
  await prisma.order.update({ where: { id: orderId }, data: { adminNote } });
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}
