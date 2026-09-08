"use client";

import Link from "next/link";
import { useCartUiStore } from "@/features/cart/cart-ui-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/use-cart";
import { CartLineItem } from "@/features/cart/cart-line-item";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const isOpen = useCartUiStore((state) => state.isOpen);
  const close = useCartUiStore((state) => state.close);
  const { data: cart, isLoading } = useCart();

  const items = cart?.items ?? [];
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (open ? undefined : close())}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your bag {items.length > 0 && `(${items.length})`}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-1">
          {isLoading && (
            <p className="text-sm text-muted-foreground">Loading your bag…</p>
          )}
          {!isLoading && items.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
              <p className="text-muted-foreground">Your bag is empty.</p>
              <Button asChild onClick={close}>
                <Link href="/shop">Browse the shop</Link>
              </Button>
            </div>
          )}
          {items.map((item) => (
            <CartLineItem key={item.id} item={item} />
          ))}
        </div>

        {items.length > 0 && (
          <SheetFooter className="gap-3 border-t border-border/70 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <Button asChild size="lg" onClick={close}>
              <Link href="/cart">View bag &amp; checkout</Link>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
