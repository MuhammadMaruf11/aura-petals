"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home,  Heart, ShoppingBag, User } from "lucide-react";
import { CartSheetTrigger } from "@/features/cart/cart-sheet-trigger";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  isSignedIn: boolean;
}

export function MobileBottomNav({ isSignedIn }: MobileBottomNavProps) {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isWishlist = pathname?.includes("/wishlist");
  const isAccount =
    pathname?.includes("/account") || pathname?.includes("/login");

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 block border-t border-border/70 bg-white/95 backdrop-blur-md lg:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] print:hidden">
      <nav className="flex h-16 items-center justify-around px-1">
        {/* 1. Home */}
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center justify-center flex-1 h-full gap-1 text-[11px] font-medium transition-colors",
            isHome
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Home className="size-5" />
          <span>Home</span>
        </Link>

        {/* 3. Wishlist */}
        <Link
          href={
            isSignedIn
              ? "/account/wishlist"
              : "/login?redirect=/account/wishlist"
          }
          className={cn(
            "flex flex-col items-center justify-center flex-1 h-full gap-1 text-[11px] font-medium transition-colors",
            isWishlist
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Heart className="size-5" />
          <span>Wishlist</span>
        </Link>

        {/* 4. Cart Trigger */}
        <CartSheetTrigger>
          <div className="flex flex-col items-center justify-center h-full gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground cursor-pointer w-full flex-1">
            <ShoppingBag className="size-5" />
            <span>Cart</span>
          </div>
        </CartSheetTrigger>

        {/* 5. Login / Account */}
        <Link
          href={isSignedIn ? "/account" : "/login"}
          className={cn(
            "flex flex-col items-center justify-center flex-1 h-full gap-1 text-[11px] font-medium transition-colors",
            isAccount
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <User className="size-5" />
          <span>{isSignedIn ? "Account" : "Login"}</span>
        </Link>
      </nav>
    </div>
  );
}
