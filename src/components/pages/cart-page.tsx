"use client";

import Link from "next/link";
import { ArrowRight, Trash2 } from "lucide-react";

import { Panel, SectionHeading } from "@/components/platform/ui";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/platform";
import { useCartStore } from "@/store/useCartStore";

export default function CartPageClient() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCartStore();

  return (
    <div className="bg-background py-16">
      <div className="container mx-auto space-y-8 px-4">
        <SectionHeading
          eyebrow="Cart"
          title="Review selected items before checkout."
          description="This route completes the existing cart drawer flow so the storefront remains fully navigable."
        />

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Panel title="Cart items" subtitle="Adjust quantities or remove products before proceeding.">
            {cart.length ? (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="rounded-[28px] border border-border/70 bg-muted/35 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{formatPrice(item.price)} each</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="rounded-full p-2 text-muted-foreground transition hover:bg-card hover:text-red-500"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-4 rounded-full border px-3 py-2 text-sm font-medium">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <p className="font-semibold text-primary">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="rounded-full px-5" onClick={clearCart}>
                  Clear cart
                </Button>
              </div>
            ) : (
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>Your cart is empty.</p>
                <Button asChild className="rounded-full px-5">
                  <Link href="/shop">Return to shop</Link>
                </Button>
              </div>
            )}
          </Panel>

          <Panel title="Order summary" subtitle="Proceed to the mock checkout review.">
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Items</span>
                <span>{cart.reduce((total, item) => total + item.quantity, 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery note</span>
                <span>Handled in follow-up</span>
              </div>
              <Button asChild className="mt-4 w-full rounded-full">
                <Link href="/checkout">
                  Continue to checkout
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
