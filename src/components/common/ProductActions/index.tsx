"use client";

import { Search, Heart, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProductActionsProps {
  onQuickView: () => void;
  onWishlist: () => void;
  onAddToCart: () => void;
  className?: string;
}

export const ProductActions = ({
  onQuickView,
  onWishlist,
  onAddToCart,
  className,
}: ProductActionsProps) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* QuickView Trigger */}
      <Button
        onClick={(e) => {
          e.preventDefault();
          onQuickView();
        }}
        title="Quick View"
        className="w-10 h-10 bg-white text-foreground rounded-full shadow-md hover:text-primary hover:scale-110 transition-all duration-300 border border-muted"
      >
        <Search size={18} />
      </Button>

      {/* Wishlist Trigger */}
      <Button
        onClick={(e) => {
          e.preventDefault();
          onWishlist();
        }}
        title="Add to Wishlist"
        className="w-10 h-10 bg-white text-foreground rounded-full shadow-md hover:text-secondary hover:scale-110 transition-all duration-300 border border-muted"
      >
        <Heart size={18} />
      </Button>

      {/* Add To Cart Trigger */}
      <Button
        onClick={(e) => {
          e.preventDefault();
          onAddToCart();
        }}
        title="Add to Cart"
        className="w-10 h-10 bg-white text-foreground rounded-full shadow-md hover:text-primary hover:scale-110 transition-all duration-300 border border-muted"
      >
        <ShoppingCart size={18} />
      </Button>
    </div>
  );
};
