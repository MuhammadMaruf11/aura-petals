"use client";

import { Search, Heart, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

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
            <button
                onClick={(e) => {
                    e.preventDefault();
                    onQuickView();
                }}
                title="Quick View"
                className="p-2.5 bg-white text-foreground rounded-full shadow-md hover:text-primary hover:scale-110 transition-all duration-300 border border-muted"
            >
                <Search size={18} />
            </button>

            {/* Wishlist Trigger */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    onWishlist();
                }}
                title="Add to Wishlist"
                className="p-2.5 bg-white text-foreground rounded-full shadow-md hover:text-secondary hover:scale-110 transition-all duration-300 border border-muted"
            >
                <Heart size={18} />
            </button>

            {/* Add To Cart Trigger */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    onAddToCart();
                }}
                title="Add to Cart"
                className="p-2.5 bg-white text-foreground rounded-full shadow-md hover:text-primary hover:scale-110 transition-all duration-300 border border-muted"
            >
                <ShoppingCart size={18} />
            </button>
        </div>
    );
};