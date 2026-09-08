import type { Metadata } from "next";
import Link from "next/link";
import { adminListOrders } from "@/server/services/order.service";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/shared/pagination";
import { formatDate, formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@prisma/client";

export const metadata: Metadata = { title: "Orders · Admin" };

const STATUSES: OrderStatus[] = [
  "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED",
  "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "FAILED_DELIVERY",
  "RETURN_REQUESTED", "RETURNED", "REFUND_REQUESTED", "REFUNDED",
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const { items, total, page, pageCount } = await adminListOrders({
    status: sp.status as OrderStatus | undefined,
    search: sp.q,
    page: sp.page ? Number(sp.page) : 1,
  });

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl">Orders ({total})</h1>

      <div className="flex flex-wrap items-center gap-3">
        <form className="max-w-sm">
          <Input name="q" defaultValue={sp.q} placeholder="Search order # or email…" />
        </form>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/orders"
            className={`rounded-full border px-3 py-1 text-xs ${!sp.status ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
          >
            All
          </Link>
          {STATUSES.map((status) => (
            <Link
              key={status}
              href={`/admin/orders?status=${status}`}
              className={`rounded-full border px-3 py-1 text-xs ${sp.status === status ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
            >
              {status.replaceAll("_", " ")}
            </Link>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/70 bg-card">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-b border-border/70 text-left text-muted-foreground">
            <tr>
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Date</th>
              <th className="p-3">Total</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((order) => (
              <tr key={order.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/40">
                <td className="p-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-medium hover:text-primary">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="p-3 text-muted-foreground">{order.user?.name ?? order.email}</td>
                <td className="p-3 text-muted-foreground">{formatDate(order.createdAt)}</td>
                <td className="p-3">{formatPrice(Number(order.total))}</td>
                <td className="p-3"><Badge variant="outline">{order.paymentStatus}</Badge></td>
                <td className="p-3"><Badge variant="secondary">{order.status.replaceAll("_", " ")}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} pageCount={pageCount} basePath="/admin/orders" searchParams={sp} />
    </div>
  );
}
