import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { adminGetCustomerById } from "@/server/services/admin-customer.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleCustomerActiveButton } from "@/features/admin/toggle-customer-active-button";
import { formatDate, formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Customer Details · Admin" };

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await adminGetCustomerById(id);
  if (!result) notFound();
  const { user, totalSpent } = result;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-heading text-2xl">{user.name}</h1>
          <p className="truncate text-sm text-muted-foreground">{user.email} · {user.phone ?? "No phone"}</p>
        </div>
        <ToggleCustomerActiveButton userId={user.id} isActive={user.isActive} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-xs font-normal text-muted-foreground">Orders</CardTitle></CardHeader>
          <CardContent className="text-xl font-heading">{user.orders.length}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-xs font-normal text-muted-foreground">Total spent</CardTitle></CardHeader>
          <CardContent className="text-xl font-heading">{formatPrice(totalSpent)}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-xs font-normal text-muted-foreground">Member since</CardTitle></CardHeader>
          <CardContent className="text-sm">{formatDate(user.createdAt)}</CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 font-heading text-lg">Order history</h2>
        <div className="space-y-2">
          {user.orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="flex items-center justify-between rounded-lg border border-border/70 p-3 text-sm hover:bg-secondary/40"
            >
              <span>{order.orderNumber} · {formatDate(order.createdAt)}</span>
              <div className="flex items-center gap-2">
                <span>{formatPrice(Number(order.total))}</span>
                <Badge variant="secondary">{order.status.replaceAll("_", " ")}</Badge>
              </div>
            </Link>
          ))}
          {user.orders.length === 0 && <p className="text-sm text-muted-foreground">No orders yet.</p>}
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-heading text-lg">Saved addresses</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {user.addresses.map((address) => (
            <div key={address.id} className="rounded-lg border border-border/70 p-3 text-sm text-muted-foreground">
              {address.fullName}<br />
              {address.line1}, {address.city} {address.postalCode}<br />
              {address.country}
            </div>
          ))}
          {user.addresses.length === 0 && <p className="text-sm text-muted-foreground">No saved addresses.</p>}
        </div>
      </div>
    </div>
  );
}
