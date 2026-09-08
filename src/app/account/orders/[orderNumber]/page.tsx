import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrderByNumberForCurrentUser } from "@/server/services/order.service";
import { OrderDetailView } from "@/features/orders/order-detail-view";

export const metadata: Metadata = { title: "Order Details" };

export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await getOrderByNumberForCurrentUser(orderNumber);
  if (!order) notFound();

  return <OrderDetailView order={order} invoiceHref={`/account/orders/${order.orderNumber}/invoice`} />;
}
