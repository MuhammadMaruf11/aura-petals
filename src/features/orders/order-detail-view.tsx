import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { OrderTrackingTimeline } from "@/features/orders/order-tracking-timeline";
import { formatDate, formatPrice } from "@/lib/utils";
import { orderStatusBadgeVariant } from "@/lib/order-status";
import type { OrderDetailData } from "@/server/services/order.service";
import {
  Package,
  Truck,
  CreditCard,
  MapPin,
  ArrowUpRight,
  ReceiptText,
} from "lucide-react";

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
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white border border-border/60 p-6 sm:p-8 rounded-3xl shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Order Details
          </p>
          <h1 className="font-heading text-2xl font-bold text-foreground mt-1 flex items-center gap-3">
            {order.orderNumber}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant={orderStatusBadgeVariant[order.status] ?? "default"}
            className="rounded-full px-3.5 py-1 text-xs uppercase font-semibold tracking-wider"
          >
            {order.status.replaceAll("_", " ")}
          </Badge>
          <ButtonAsLink href={invoiceHref} />
        </div>
      </div>

      {/* Main Grid for Products & Summary */}
      <div className="bg-white border border-border/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
          <Package className="size-5 text-primary" /> Ordered Items (
          {order.items.length})
        </h2>

        <div className="divide-y divide-border/40">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl bg-neutral-100 border border-border/50">
                  {(() => {
                    const imageUrl =
                      item.imageUrl ?? item.product?.images?.[0]?.url;
                    return imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                        IMG
                      </div>
                    );
                  })()}
                </div>
                <div className="min-w-0 space-y-0.5">
                  <Link
                    href={item.product ? `/products/${item.product.slug}` : "#"}
                    className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1 block"
                  >
                    {item.productName}
                  </Link>
                  {item.variantName && (
                    <p className="text-xs text-muted-foreground">
                      {item.variantName}
                    </p>
                  )}
                  <p className="text-xs text-neutral-500 font-medium">
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>
              <p className="font-bold text-foreground shrink-0">
                {formatPrice(Number(item.lineTotal))}
              </p>
            </div>
          ))}
        </div>

        {/* Pricing Subtotals */}
        <div className="space-y-2 border-t border-border/60 pt-6 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-medium text-foreground">
              {formatPrice(Number(order.subtotal))}
            </span>
          </div>
          {Number(order.discountTotal) > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>
                Discount{order.coupon ? ` (${order.coupon.code})` : ""}
              </span>
              <span>-{formatPrice(Number(order.discountTotal))}</span>
            </div>
          )}
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span className="font-medium text-foreground">
              {formatPrice(Number(order.shippingTotal))}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Tax</span>
            <span className="font-medium text-foreground">
              {formatPrice(Number(order.taxTotal))}
            </span>
          </div>
          <div className="flex justify-between border-t border-border/60 pt-4 text-base font-bold text-foreground">
            <span>Total Amount</span>
            <span className="text-primary text-lg">
              {formatPrice(Number(order.total))}
            </span>
          </div>
        </div>
      </div>

      {/* Address and Payment Info Section */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="bg-white border border-border/60 rounded-3xl p-6 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <MapPin className="size-4 text-primary" /> Shipping Address
          </h3>
          <div className="text-sm text-muted-foreground space-y-0.5 bg-neutral-50/50 p-4 rounded-2xl border border-border/40">
            <p className="font-semibold text-foreground">{shipping.fullName}</p>
            <p>
              {shipping.line1}
              {shipping.line2 ? `, ${shipping.line2}` : ""}
            </p>
            <p>
              {shipping.city}
              {shipping.state ? `, ${shipping.state}` : ""}{" "}
              {shipping.postalCode}
            </p>
            <p className="font-medium text-foreground">{shipping.country}</p>
            <p className="pt-2 text-xs text-neutral-500">
              Phone: {shipping.phone}
            </p>
          </div>
        </div>

        <div className="bg-white border border-border/60 rounded-3xl p-6 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="size-4 text-primary" /> Payment Info
          </h3>
          <div className="text-sm text-muted-foreground space-y-1.5 bg-neutral-50/50 p-4 rounded-2xl border border-border/40">
            <p className="flex justify-between">
              <span className="text-neutral-500">Method:</span>{" "}
              <span className="font-semibold text-foreground">
                {order.paymentMethod === "COD"
                  ? "Cash on Delivery"
                  : order.paymentMethod}
              </span>
            </p>
            <p className="flex justify-between">
              <span className="text-neutral-500">Status:</span>{" "}
              <span className="font-semibold text-foreground uppercase text-xs px-2 py-0.5 rounded-full bg-secondary">
                {order.paymentStatus.replaceAll("_", " ")}
              </span>
            </p>
            <p className="flex justify-between pt-1">
              <span className="text-neutral-500">Placed on:</span>{" "}
              <span className="text-foreground">
                {formatDate(order.createdAt)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Tracking Info Card */}
      <div className="bg-white border border-border/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
          <Truck className="size-5 text-primary" /> Tracking & Timeline
        </h2>
        {(order.courierName || order.trackingNumber) && (
          <div className="flex flex-wrap items-center gap-6 text-sm bg-neutral-50/60 p-4 rounded-2xl border border-border/50">
            {order.courierName && (
              <p>
                <span className="text-muted-foreground">Courier:</span>{" "}
                <span className="font-semibold text-foreground">
                  {order.courierName}
                </span>
              </p>
            )}
            {order.trackingNumber && (
              <p>
                <span className="text-muted-foreground">Tracking #:</span>{" "}
                <span className="font-semibold text-foreground">
                  {order.trackingNumber}
                </span>
              </p>
            )}
            {order.trackingUrl && (
              <Link
                href={order.trackingUrl}
                target="_blank"
                className="text-primary hover:underline font-medium inline-flex items-center gap-1"
              >
                Track shipment <ArrowUpRight className="size-3.5" />
              </Link>
            )}
          </div>
        )}
        <div className="pt-2">
          <OrderTrackingTimeline
            currentStatus={order.status}
            events={order.trackingEvents}
          />
        </div>
      </div>
    </div>
  );
}

function ButtonAsLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary/80 text-secondary-foreground hover:bg-secondary font-medium text-xs transition-colors"
    >
      <ReceiptText className="size-3.5" /> View invoice
    </Link>
  );
}
