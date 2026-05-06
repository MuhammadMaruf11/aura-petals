/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { HeartOff, ShoppingCart, Trash2 } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatPrice } from "@/lib/platform";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";

export const WishlistModal = ({ isOpen, onClose }: any) => {
  const { wishlist, toggleWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  const handleMoveToCart = (item: any) => {
    addToCart({ ...item, quantity: 1 });
    toggleWishlist(item);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-[28px] border border-border bg-background">
        <DialogHeader>
          <DialogTitle className="border-b border-border pb-2 font-heading text-2xl text-primary">
            My Wishlist ({wishlist.length})
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 max-h-[60vh] space-y-4 overflow-y-auto">
          {wishlist.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <HeartOff className="text-muted-foreground" size={40} />
              <p className="text-muted-foreground">Your wishlist is empty.</p>
            </div>
          ) : (
            wishlist.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={item.image_url || "/placeholder.jpg"}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="grow">
                  <h4 className="text-sm font-bold">{item.title}</h4>
                  <p className="text-xs font-bold text-primary">{formatPrice(item.price)}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="rounded-full p-2 text-primary transition-colors hover:bg-primary/10"
                    title="Add to cart"
                  >
                    <ShoppingCart size={16} />
                  </button>
                  <button
                    onClick={() => toggleWishlist(item)}
                    className="rounded-full p-2 text-red-500 transition-colors hover:bg-red-50"
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
