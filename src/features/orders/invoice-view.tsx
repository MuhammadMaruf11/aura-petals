"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate, formatPrice } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import type { OrderDetailData } from "@/server/services/order.service";

type StoreInfo = {
  storeName: string;
  storeEmail?: string | null;
  storePhone?: string | null;
  storeAddress?: string | null;
};

export function InvoiceView({ order, store }: { order: OrderDetailData; store: StoreInfo }) {
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
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex justify-end print:hidden">
        <Button type="button" onClick={() => window.print()}>
          <Printer className="size-4" />
          Print / Save as PDF
        </Button>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-8 print:rounded-none print:border-0 print:p-0">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/70 pb-6">
          <div>
            <p className="font-heading text-xl">{store.storeName || siteConfig.name}</p>
            {store.storeAddress && (
              <p className="text-sm text-muted-foreground">{store.storeAddress}</p>
            )}
            {store.storeEmail && <p className="text-sm text-muted-foreground">{store.storeEmail}</p>}
            {store.storePhone && <p className="text-sm text-muted-foreground">{store.storePhone}</p>}
          </div>
          <div className="text-right">
            <h1 className="font-heading text-2xl">Invoice</h1>
            <p className="text-sm text-muted-foreground">Order {order.orderNumber}</p>
            <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
          </div>
        </div>

        <div className="grid gap-6 border-b border-border/70 py-6 sm:grid-cols-2">
          <div>
            <h2 className="mb-2 text-sm font-medium">Billed to</h2>
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
          <div className="sm:text-right">
            <h2 className="mb-2 text-sm font-medium">Payment</h2>
            <p className="text-sm text-muted-foreground">
              {order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod}
              <br />
              Status: {order.paymentStatus.replaceAll("_", " ")}
              <br />
              Order status: {order.status.replaceAll("_", " ")}
            </p>
          </div>
        </div>

        <table className="w-full py-6 text-sm">
          <thead>
            <tr className="border-b border-border/70 text-left text-muted-foreground">
              <th className="py-3">Item</th>
              <th className="py-3 text-right">Qty</th>
              <th className="py-3 text-right">Unit price</th>
              <th className="py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-border/50">
                <td className="py-3">
                  {item.productName}
                  {item.variantName && (
                    <span className="block text-xs text-muted-foreground">{item.variantName}</span>
                  )}
                </td>
                <td className="py-3 text-right">{item.quantity}</td>
                <td className="py-3 text-right">{formatPrice(Number(item.unitPrice))}</td>
                <td className="py-3 text-right">{formatPrice(Number(item.lineTotal))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ml-auto max-w-xs space-y-1 pt-4 text-sm">
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

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Thank you for shopping with {store.storeName || siteConfig.name}.
        </p>
      </div>
    </div>
  );
}
