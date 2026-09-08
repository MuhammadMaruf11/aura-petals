import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { getOrderByNumberForCurrentUser } from "@/server/services/order.service";
import { OrderDetailView } from "@/features/orders/order-detail-view";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Order Confirmed" };

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await getOrderByNumberForCurrentUser(orderNumber);
  if (!order) notFound();

  return (
    <div className="container-boutique py-12">
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <CheckCircle2 className="size-12 text-success" />
        <h1 className="font-heading text-3xl">Thank you for your order!</h1>
        <p className="text-muted-foreground">
          We&apos;ve sent a confirmation to {order.email}. You can also track this order anytime
          from your account.
        </p>
        <Button asChild variant="outline" className="mt-2">
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>

      <OrderDetailView order={order} invoiceHref={`/account/orders/${order.orderNumber}/invoice`} />
    </div>
  );
}
