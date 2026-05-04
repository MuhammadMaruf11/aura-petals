/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/common/ProductCard";
import { QuickView } from "@/components/common/Modals/QuickView";
import { CustomButton } from "@/components/ui/custom-button";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { ArrowRight } from "lucide-react";

interface GridProps {
    title?: string;
    subtitle?: string;
    products: any[];
    limit?: number; // ডিফল্ট বা ইউজার ডিফাইন করা লিমিট (যেমন: ৬)
    categoryFilter?: string;
}

const ProductGrid = ({ title, subtitle, products, limit = 6, categoryFilter }: GridProps) => {
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const { addToCart } = useCartStore();
    const { toggleWishlist } = useWishlistStore();

    // ১. প্রথমে ক্যাটাগরি অনুযায়ী ফিল্টার করা
    const filteredProducts = categoryFilter
        ? products.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase())
        : products;

    // ২. বাটন দেখানোর জন্য অরিজিনাল কাউন্ট রাখা
    const hasMore = filteredProducts.length > limit;

    // ৩. লিমিট অনুযায়ী প্রোডাক্ট স্লাইস করা
    const displayProducts = filteredProducts.slice(0, limit);

    return (
        <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                {(title || subtitle) && (
                    <div className="flex flex-col items-center mb-10 text-center">
                        {subtitle && (
                            <span className="text-secondary font-bold text-[10px] uppercase tracking-[0.3em] mb-2">
                                {subtitle}
                            </span>
                        )}
                        {title && <h2 className="font-heading text-3xl md:text-4xl text-primary">{title}</h2>}
                        <div className="w-12 h-[2px] bg-secondary mt-3" />
                    </div>
                )}

                {/* Product Grid - এখন ৬টি কলামে (lg:grid-cols-6) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {displayProducts.map((item) => (
                        <ProductCard
                            key={item.id}
                            product={item}
                            onQuickView={(p) => setSelectedProduct(p)}
                            onWishlist={(p) => toggleWishlist(p)}
                            onAddToCart={(p) => addToCart({ ...p, quantity: 1 })}
                        />
                    ))}
                </div>

                {/* See All Products Button */}
                {hasMore && (
                    <div className="mt-12 flex justify-center">
                        <Link href="/shop">
                            <CustomButton variant="primary" className="px-10 h-12 group">
                                See All Products
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </CustomButton>
                        </Link>
                    </div>
                )}
            </div>

            {/* Quick View Modal */}
            <QuickView
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </section>
    );
};

export default ProductGrid;