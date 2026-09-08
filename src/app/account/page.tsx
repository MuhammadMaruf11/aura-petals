import type { Metadata } from "next";
import Link from "next/link";
import { getAccountOverview } from "@/server/services/account.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "My Account" };

export default async function AccountDashboardPage() {
  const { user, totalOrders, recentOrders, wishlistCount } = await getAccountOverview();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl">Welcome back, {user.name.split(" ")[0]}</h1>
        <p className="text-sm text-muted-foreground">Here&apos;s a quick look at your account.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Total orders</CardTitle></CardHeader>
          <CardContent className="text-3xl font-heading">{totalOrders}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Wishlist items</CardTitle></CardHeader>
          <CardContent className="text-3xl font-heading">{wishlistCount}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Account email</CardTitle></CardHeader>
          <CardContent className="truncate text-sm text-muted-foreground">{user.email}</CardContent>
        </Card>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-xl">Recent orders</h2>
          <Link href="/account/orders" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground">You haven&apos;t placed any orders yet.</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.orderNumber}`}
                className="flex items-center justify-between rounded-xl border border-border/70 p-4 hover:bg-secondary/50"
              >
                <div>
                  <p className="text-sm font-medium">{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm">{formatPrice(Number(order.total))}</span>
                  <Badge variant="secondary">{order.status.replaceAll("_", " ")}</Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
