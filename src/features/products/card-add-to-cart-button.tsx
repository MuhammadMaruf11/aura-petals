"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/features/cart/use-cart";
import { useCartUiStore } from "@/features/cart/cart-ui-store";
import { trackAddToCart } from "@/lib/analytics/events";

export function CardAddToCartButton({
  productId,
  name,
  price,
  currency,
}: {
  productId: string;
  name: string;
  price: number;
  currency: string;
}) {
  const addToCart = useAddToCart();
  const openCart = useCartUiStore((state) => state.open);

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className="w-full gap-1.5 shadow-sm"
      disabled={addToCart.isPending}
      onClick={(e) => {
        e.preventDefault();
        addToCart.mutate(
          { productId, variantId: null, quantity: 1, customization: null },
          {
            onSuccess: (result) => {
              if (result.success) {
                openCart();
                trackAddToCart({ id: productId, name, price, currency }, 1);
              }
            },
          },
        );
      }}
    >
      <ShoppingBag className="size-3.5" />
      {addToCart.isPending ? "Adding…" : "Add to Bag"}
    </Button>
  );
}
