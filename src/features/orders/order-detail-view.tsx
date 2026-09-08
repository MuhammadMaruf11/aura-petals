import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { OrderTrackingTimeline } from "@/features/orders/order-tracking-timeline";
import { formatDate, formatPrice } from "@/lib/utils";
import { orderStatusBadgeVariant } from "@/lib/order-status";
import type { OrderDetailData } from "@/server/services/order.service";

export function OrderDetailView({
  order,
  invoiceHref,
}: {
  order: OrderDetailData;
  invoiceHref: string;
}) {
  const shipping = order.shippingSnapshot as {
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
    phone: string;
  };

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Order</p>
            <h1 className="font-heading text-2xl">{order.orderNumber}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={orderStatusBadgeVariant[order.status] ?? "default"}>
              {order.status.replaceAll("_", " ")}
            </Badge>
            <Link
              href={invoiceHref}
              className="text-sm text-primary hover:underline"
            >
              View invoice
            </Link>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-border/70 p-5">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-secondary">
                {(() => {
                  // Prefer the snapshot taken at purchase time — it stays
                  // accurate even if the product's images are later changed
                  // or removed. Fall back to the live product image only
                  // for older orders placed before snapshots were captured.
                  const imageUrl = item.imageUrl ?? item.product.images[0]?.url;
                  return (
                    imageUrl && (
                      <Image src={imageUrl} alt={item.productName} fill className="object-cover" />
                    )
                  );
                })()}
              </div>
              <div className="flex-1 text-sm">
                <Link href={`/products/${item.product.slug}`} className="font-medium hover:text-primary">
                  {item.productName}
                </Link>
                {item.variantName && <p className="text-muted-foreground">{item.variantName}</p>}
                <p className="text-muted-foreground">Qty {item.quantity}</p>
              </div>
              <p className="text-sm font-medium">{formatPrice(Number(item.lineTotal))}</p>
            </div>
          ))}

          <div className="space-y-1 border-t border-border/70 pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(Number(order.subtotal))}</span>
            </div>
            {Number(order.discountTotal) > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount{order.coupon ? ` (${order.coupon.code})` : ""}</span>
                <span>-{formatPrice(Number(order.discountTotal))}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{formatPrice(Number(order.shippingTotal))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatPrice(Number(order.taxTotal))}</span>
            </div>
            <div className="flex justify-between border-t border-border/70 pt-2 text-base font-medium">
              <span>Total</span>
              <span>{formatPrice(Number(order.total))}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-medium">Shipping address</h3>
            <p className="text-sm text-muted-foreground">
              {shipping.fullName}
              <br />
              {shipping.line1}
              {shipping.line2 && <>, {shipping.line2}</>}
              <br />
              {shipping.city}
              {shipping.state ? `, ${shipping.state}` : ""} {shipping.postalCode}
              <br />
              {shipping.country}
              <br />
              {shipping.phone}
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium">Payment</h3>
            <p className="text-sm text-muted-foreground">
              {order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod}
              <br />
              Status: {order.paymentStatus.replaceAll("_", " ")}
              <br />
              Placed {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-border/70 bg-card p-6">
        <h2 className="font-heading text-lg">Tracking</h2>
        {(order.courierName || order.trackingNumber) && (
          <div className="space-y-1 text-sm text-muted-foreground">
            {order.courierName && <p>Courier: {order.courierName}</p>}
            {order.trackingNumber && <p>Tracking #: {order.trackingNumber}</p>}
            {order.trackingUrl && (
              <Link href={order.trackingUrl} className="text-primary hover:underline">
                Track shipment
              </Link>
            )}
          </div>
        )}
        <OrderTrackingTimeline currentStatus={order.status} events={order.trackingEvents} />
      </div>
    </div>
  );
}
