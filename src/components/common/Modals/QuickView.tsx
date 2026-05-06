/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Heart, ShoppingCart } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/platform";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";

export const QuickView = ({ product, isOpen, onClose }: any) => {
  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  if (!product) {
    return null;
  }

  const isFavorite = isInWishlist(product.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl overflow-hidden rounded-[32px] border border-border bg-background p-0">
        <DialogTitle className="sr-only">{product.title}</DialogTitle>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative h-[320px] bg-muted md:h-[460px]">
            <Image
              src={product.image_url || "/placeholder.jpg"}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center p-8">
            {product.tier ? (
              <span className="w-fit rounded-full bg-secondary/12 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-secondary">
                {product.tier}
              </span>
            ) : null}

            <h2 className="mt-3 font-heading text-3xl text-primary">{product.title}</h2>
            <p className="mt-4 text-2xl font-bold text-foreground">{formatPrice(product.price)}</p>

            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-green-600" />
                <span>In stock and available for storefront checkout flows</span>
              </div>
            </div>

            <div className="mt-8 grid gap-3">
              <Button
                className="h-11 rounded-full"
                onClick={() => {
                  addToCart({ ...product, quantity: 1 });
                  onClose();
                }}
              >
                <ShoppingCart className="size-4" />
                Add to cart
              </Button>

              <Button
                variant="secondary"
                className="h-11 rounded-full"
                onClick={() => toggleWishlist(product)}
              >
                <Heart className={`size-4 ${isFavorite ? "fill-current" : ""}`} />
                {isFavorite ? "Remove from wishlist" : "Add to wishlist"}
              </Button>

              {product.slug ? (
                <Button asChild variant="ghost" className="h-11 rounded-full">
                  <Link href={`/products/${product.slug}`} onClick={onClose}>
                    View full details
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
