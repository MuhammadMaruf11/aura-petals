"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import type { CartItemDTO } from "@/features/cart/cart.types";
import { useRemoveCartItem, useUpdateCartItemQuantity } from "@/features/cart/use-cart";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { isOutOfStock, maxOrderableQuantity } from "@/lib/stock";

export function CartLineItem({ item }: { item: CartItemDTO }) {
  const updateQuantity = useUpdateCartItemQuantity();
  const removeItem = useRemoveCartItem();
  const outOfStock = isOutOfStock(item);
  const maxQuantity = maxOrderableQuantity(item);
  const overStock = !outOfStock && item.quantity > maxQuantity;

  return (
    <div className="flex gap-4 border-b border-border/60 pb-4">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-secondary">
        {item.image && (
          <Image src={item.image} alt={item.productName} fill className="object-cover" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/products/${item.productSlug}`}
            className="text-sm font-medium hover:text-primary"
          >
            {item.productName}
          </Link>
          <button
            type="button"
            onClick={() => removeItem.mutate(item.id)}
            aria-label="Remove item"
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="size-4" />
          </button>
        </div>

        {item.variantName && (
          <p className="text-xs text-muted-foreground">{item.variantName}</p>
        )}
        {item.customization && Object.keys(item.customization).length > 0 && (
          <p className="text-xs text-muted-foreground">Personalized</p>
        )}
        {outOfStock && <p className="text-xs font-medium text-destructive">Out of stock</p>}
        {overStock && (
          <p className="text-xs font-medium text-destructive">
            Only {maxQuantity} left — please lower the quantity
          </p>
        )}

        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full border border-border px-1">
            <button
              type="button"
              className="p-1.5 disabled:opacity-40"
              disabled={item.quantity <= 1 || outOfStock}
              onClick={() =>
                updateQuantity.mutate({ id: item.id, quantity: item.quantity - 1 })
              }
              aria-label="Decrease quantity"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="min-w-4 text-center text-sm">{item.quantity}</span>
            <button
              type="button"
              className="p-1.5 disabled:opacity-40"
              disabled={item.quantity >= maxQuantity || outOfStock}
              onClick={() =>
                updateQuantity.mutate({ id: item.id, quantity: item.quantity + 1 })
              }
              aria-label="Increase quantity"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
          <span className="text-sm font-medium">
            {formatPrice(item.unitPrice * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function CartLineItemStatic({ item }: { item: CartItemDTO }) {
  // Read-only variant, used on order confirmation / order-detail views.
  return (
    <div className="flex gap-4">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-secondary">
        {item.image && (
          <Image src={item.image} alt={item.productName} fill className="object-cover" />
        )}
      </div>
      <div className="flex-1 text-sm">
        <p className="font-medium">{item.productName}</p>
        {item.variantName && <p className="text-muted-foreground">{item.variantName}</p>}
        <p className="text-muted-foreground">Qty {item.quantity}</p>
      </div>
      <Button variant="ghost" size="icon" className="pointer-events-none opacity-0">
        <X />
      </Button>
    </div>
  );
}
