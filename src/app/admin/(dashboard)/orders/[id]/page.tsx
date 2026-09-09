import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { adminGetOrderById } from "@/server/services/order.service";
import { OrderDetailView } from "@/features/orders/order-detail-view";
import { AdminOrderControls } from "@/features/admin/admin-order-controls";
import { serializeDecimals } from "@/lib/serialize";

export const metadata: Metadata = { title: "Order Details · Admin Dashboard" };

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await adminGetOrderById(id);
  if (!order) notFound();

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      <div className="grid gap-8 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <OrderDetailView
            order={order}
            invoiceHref={`/admin/orders/${order.id}/invoice`}
          />
        </div>
        <div>
          <AdminOrderControls order={serializeDecimals(order)} />
        </div>
      </div>
    </div>
  );
}
