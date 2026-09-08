import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { adminGetOrderById } from "@/server/services/order.service";
import { OrderDetailView } from "@/features/orders/order-detail-view";
import { AdminOrderControls } from "@/features/admin/admin-order-controls";
import { serializeDecimals } from "@/lib/serialize";

export const metadata: Metadata = { title: "Order Details · Admin" };

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await adminGetOrderById(id);
  if (!order) notFound();

  return (
    // Stack fully up through `lg` — OrderDetailView has its own internal
    // lg:grid-cols-3 split for items/tracking, so splitting *this* grid at
    // the same breakpoint would cram three narrow columns into a typical
    // 1024–1279px laptop width. Only split here from `xl` up, once there's
    // room for both layouts at once.
    <div className="grid gap-8 xl:grid-cols-3">
      <div className="xl:col-span-2">
        <OrderDetailView order={order} invoiceHref={`/admin/orders/${order.id}/invoice`} />
      </div>
      <div>
        <AdminOrderControls order={serializeDecimals(order)} />
      </div>
    </div>
  );
}
