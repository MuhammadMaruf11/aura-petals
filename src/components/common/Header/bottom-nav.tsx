"use client";

import Link from "next/link";
import { Heart, Home, ShoppingCart, User } from "lucide-react";
import { useRouter } from "next/navigation";

import { useCartStore } from "@/store/useCartStore";
import { usePlatformStore } from "@/store/usePlatformStore";
import { useWishlistStore } from "@/store/useWishlistStore";

interface BottomNavProps {
  onWishlistOpen: () => void;
  onCartOpen: () => void;
}

export const BottomNav = ({ onWishlistOpen, onCartOpen }: BottomNavProps) => {
  const router = useRouter();
  const auth = usePlatformStore((state) => state.auth);
  const cart = useCartStore((state) => state.cart);
  const wishlist = useWishlistStore((state) => state.wishlist);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-border bg-card shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:hidden">
      <div className="grid h-full grid-cols-4">
        <Link
          href="/"
          className="flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary"
        >
          <Home size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
        </Link>

        <button
          onClick={onWishlistOpen}
          className="flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-secondary"
        >
          <div className="relative">
            <Heart size={20} />
            {wishlist.length ? (
              <span className="absolute -right-1 -top-1 flex size-3.5 items-center justify-center rounded-full bg-secondary text-[8px] text-white">
                {wishlist.length}
              </span>
            ) : null}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Wishlist</span>
        </button>

        <button
          onClick={onCartOpen}
          className="flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary"
        >
          <div className="relative">
            <ShoppingCart size={20} />
            {cartCount ? (
              <span className="absolute -right-1 -top-1 flex size-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-white">
                {cartCount}
              </span>
            ) : null}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Cart</span>
        </button>

        <button
          onClick={() => router.push(auth.isAuthenticated ? "/profile" : "/login")}
          className="flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary"
        >
          <User size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Account</span>
        </button>
      </div>
    </div>
  );
};
