"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleWishlistItem } from "@/server/actions/wishlist.actions";
import { useAddToCart } from "@/features/cart/use-cart";
import { formatPrice } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { WISHLIST_QUERY_KEY } from "@/features/wishlist/use-wishlist";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export type WishlistProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  images: { url: string }[];
  variants: { id: string; stock: number }[];
  category?: Record<string, unknown> | null;
};

export function WishlistItemCard({ product }: { product: WishlistProduct }) {
  const addToCart = useAddToCart();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleRemove() {
    startTransition(async () => {
      await toggleWishlistItem(product.id);
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border/70 p-4">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-secondary">
        {product.images[0] && (
          <Image
            src={product.images[0].url}
            alt={product.name}
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="flex-1">
        <Link
          href={`/products/${product.slug}`}
          className="font-medium hover:text-primary"
        >
          {product.name}
        </Link>
        <p className="text-sm text-muted-foreground">
          {formatPrice(product.price)}
        </p>
      </div>
      <Button
        size="sm"
        onClick={() => addToCart.mutate({ productId: product.id, quantity: 1 })}
        disabled={addToCart.isPending}
      >
        Move to bag
      </Button>
      <button
        type="button"
        onClick={handleRemove}
        disabled={isPending}
        aria-label="Remove from wishlist"
        className="text-muted-foreground hover:text-destructive"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
