/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { CustomButton } from "@/components/ui/custom-button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Heart, ShoppingCart, CheckCircle2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";

export const QuickView = ({ product, isOpen, onClose }: any) => {
    const { addToCart } = useCartStore();
    const { toggleWishlist, isInWishlist } = useWishlistStore();

    if (!product) return null;

    const isFavorite = isInWishlist(product.id);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl p-0 overflow-hidden bg-background">
                <DialogTitle className="sr-only">{product.title}</DialogTitle>
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Image Section */}
                    <div className="relative h-[300px] md:h-[450px] bg-muted">
                        <Image
                            src={product.image_url || "/placeholder.jpg"}
                            alt={product.title}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Content Section */}
                    <div className="p-8 flex flex-col justify-center">
                        {product.tier && (
                            <span className="text-secondary font-bold text-xs uppercase tracking-widest px-2 py-1 bg-secondary/10 w-fit rounded">
                                {product.tier}
                            </span>
                        )}

                        <h2 className="font-heading text-3xl text-primary mt-3">{product.title}</h2>
                        <p className="text-2xl font-bold mt-4 text-foreground">
                            ৳{product.price.toLocaleString()}
                        </p>

                        <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={14} className="text-green-500" />
                                <span>In Stock & Ready to Ship</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 mt-8">
                            <CustomButton
                                variant="primary"
                                className="w-full flex gap-2"
                                onClick={() => {
                                    addToCart({ ...product, quantity: 1 });
                                    onClose(); // Close modal after adding
                                }}
                            >
                                <ShoppingCart className="w-4 h-4" /> Add To Cart
                            </CustomButton>

                            <CustomButton
                                variant="outline"
                                className={`w-full flex gap-2 ${isFavorite ? 'text-secondary border-secondary bg-secondary/5' : ''}`}
                                onClick={() => toggleWishlist(product)}
                            >
                                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                                {isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
                            </CustomButton>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};