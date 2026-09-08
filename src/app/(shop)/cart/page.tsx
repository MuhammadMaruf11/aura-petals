"use client";

import Link from "next/link";
import { useCart } from "@/features/cart/use-cart";
import { CartLineItem } from "@/features/cart/cart-line-item";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export default function CartPage() {
  const { data: cart, isLoading } = useCart();
  const items = cart?.items ?? [];
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <div className="container-boutique py-12">
      <h1 className="mb-8 font-heading text-3xl">Your bag</h1>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <EmptyState
          title="Your bag is empty"
          description="Browse the shop to find something handmade and thoughtful."
          action={
            <Button asChild>
              <Link href="/shop">Shop all products</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <CartLineItem key={item.id} item={item} />
            ))}
          </div>

          <div className="h-fit space-y-4 rounded-2xl border border-border/70 bg-card p-6">
            <h2 className="font-heading text-lg">Order summary</h2>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between border-t border-border/70 pt-3 text-base font-medium">
              <span>Estimated total</span>
              <span>{formatPrice(subtotal, { currencySymbol: siteConfig.currencySymbol })}</span>
            </div>
            <Button asChild size="lg" className="w-full">
              <Link href="/checkout">Proceed to checkout</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
