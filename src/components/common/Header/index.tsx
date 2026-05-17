/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Heart, User, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Store & Custom Hooks
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";

// Components
import { CartDrawer } from "../Drawers/CartDrawer";
import { WishlistModal } from "../Modals/WishlistModal";
import { MobileMenu } from "../Drawers/MobileMenu";
import { BottomNav } from "./bottom-nav";
import { useDebounce } from "@/hooks/use-debounce";
import Image from "next/image";

const Header = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Search State with Debounce
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);

    // Zustand States
    const { cart, getTotalPrice } = useCartStore();
    const { wishlist } = useWishlistStore();

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        if (debouncedSearch) {
            console.log("Searching for:", debouncedSearch);
            // You can call your search API here
        }
    }, [debouncedSearch]);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Shop All", href: "/shop" },
        { name: "About Us", href: "/about-us" }, 
        { name: "Contact Us", href: "/contact-us" }, 
    ];

    if (!mounted) return null;

    return (
        <>
            <header className="w-full bg-background sticky top-0 z-50 border-b">
                {/* Row 1: Weekly Offer & Search & Account (Desktop Only) */}
                <div className="border-b bg-muted/30 hidden md:block">
                    <div className="container mx-auto px-4 h-12 flex items-center justify-between gap-6">
                        {/* Weekly Offer Ads */}
                        <div className="flex-1 w-4/12">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary animate-pulse">
                                ✨ Special Offer: 20% OFF on all Elite Crafts this week!
                            </span>
                        </div>

                        {/* Debounce Search Bar */}
                        <div className="relative w-6/12">
                            <Input
                                type="text"
                                placeholder="Search for timeless gifts..."
                                className="h-8 text-[11px] bg-white  pl-8 focus-visible:ring-primary"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                        </div>

                        {/* Login / Register */}
                        <div className="flex items-center gap-4 w-2/12 justify-end">
                            <Link href="/login" className="text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-all flex items-center gap-2">
                                <User size={14} /> Login / Register
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Row 2: Logo & Main Navigation */}
                <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMenuOpen(true)} className="md:hidden p-2 -ml-2 text-primary">
                            <Menu size={24} />
                        </button>
                        <Link href="/" className="shrink-0">
                            <Image src='/images/logo/main-logo.png' alt="Logo" width={250} height={60} />
                        </Link>
                    </div>

                    <nav className="hidden md:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link key={link.name} href={link.href} className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        {/* Mobile Search Icon */}
                        <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground"><Search size={20} /></Button>

                        {/* Wishlist */}
                        <Button variant="ghost" size="icon" className="hidden md:flex relative" onClick={() => setIsWishlistOpen(true)}>
                            <Heart size={20} />
                            {wishlist.length > 0 && (
                                <span className="absolute top-1 right-1 bg-secondary text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                    {wishlist.length}
                                </span>
                            )}
                        </Button>

                        {/* Cart */}
                        <Button className="bg-primary text-white rounded-full flex items-center gap-2 px-5 h-11" onClick={() => setIsCartOpen(true)}>
                            <div className="relative">
                                <ShoppingCart size={18} />
                                {cart.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-secondary border-2 border-primary text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                        {cart.reduce((total, item) => total + item.quantity, 0)}
                                    </span>
                                )}
                            </div>
                            <span className="hidden sm:inline font-bold text-sm">৳{getTotalPrice().toLocaleString()}</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Mobile Bottom Navigation */}
            <BottomNav onWishlistOpen={() => setIsWishlistOpen(true)} onCartOpen={() => setIsCartOpen(true)} />

            {/* Modals & Drawers */}
            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} navLinks={navLinks} onWishlistOpen={() => setIsWishlistOpen(true)} onCartOpen={() => setIsCartOpen(true)} />
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <WishlistModal isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
        </>
    );
};

export default Header;