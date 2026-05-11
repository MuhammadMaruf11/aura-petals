"use client";

import React from "react";
import Link from "next/link";
import { Home, Heart, ShoppingCart, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface BottomNavProps {
    onWishlistOpen: () => void;
    onCartOpen: () => void;
}

export const BottomNav = ({ onWishlistOpen, onCartOpen }: BottomNavProps) => {
    const router = useRouter();
    const isLoggedIn = false; // Your Auth logic goes here

    const handleAccountClick = () => {
        if (isLoggedIn) {
            router.push("/account");
        } else {
            router.push("/login");
        }
    };

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-100 h-16 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
            <div className="grid grid-cols-4 h-full">
                {/* Home */}
                <Link
                    href="/"
                    className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                >
                    <Home size={20} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
                </Link>

                {/* Wishlist - Opens Modal */}
                <button
                    onClick={onWishlistOpen}
                    className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-secondary transition-colors"
                >
                    <div className="relative">
                        <Heart size={20} />
                        <span className="absolute -top-1 -right-1 bg-secondary text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">0</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Wishlist</span>
                </button>

                {/* Cart - Opens Drawer */}
                <button
                    onClick={onCartOpen}
                    className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                >
                    <div className="relative">
                        <ShoppingCart size={20} />
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">0</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Cart</span>
                </button>

                {/* Account */}
                <button
                    onClick={handleAccountClick}
                    className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                >
                    <User size={20} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Account</span>
                </button>
            </div>
        </div>
    );
};