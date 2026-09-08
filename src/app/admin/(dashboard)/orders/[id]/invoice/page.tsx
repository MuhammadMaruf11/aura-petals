import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { adminGetOrderById } from "@/server/services/order.service";
import { getStoreSettings } from "@/server/services/admin-settings.service";
import { InvoiceView } from "@/features/orders/invoice-view";
import { serializeDecimals } from "@/lib/serialize";

export const metadata: Metadata = { title: "Invoice · Admin" };

export default async function AdminInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [order, settings] = await Promise.all([adminGetOrderById(id), getStoreSettings()]);
  if (!order) notFound();

  return <InvoiceView order={serializeDecimals(order)} store={serializeDecimals(settings)} />;
}
