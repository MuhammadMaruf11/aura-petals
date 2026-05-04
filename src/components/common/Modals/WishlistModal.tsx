/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, ShoppingCart, HeartOff } from "lucide-react";
import Image from "next/image";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";

export const WishlistModal = ({ isOpen, onClose }: any) => {
    const { wishlist, toggleWishlist } = useWishlistStore();
    const { addToCart } = useCartStore();

    const handleMoveToCart = (item: any) => {
        addToCart({ ...item, quantity: 1 });
        toggleWishlist(item); // Remove from wishlist when moving to cart
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-background">
                <DialogHeader>
                    <DialogTitle className="font-heading text-2xl text-primary border-b pb-2">
                        My Wishlist ({wishlist.length})
                    </DialogTitle>
                </DialogHeader>

                <div className="max-h-[60vh] overflow-y-auto mt-4 space-y-4">
                    {wishlist.length === 0 ? (
                        <div className="py-10 text-center flex flex-col items-center gap-2">
                            <HeartOff className="text-muted-foreground" size={40} />
                            <p className="text-muted-foreground">Your wishlist is empty!</p>
                        </div>
                    ) : (
                        wishlist.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 group">
                                <div className="w-16 h-16 relative bg-muted overflow-hidden rounded-sm">
                                    <Image
                                        src={item.image_url || "/placeholder.jpg"}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="grow">
                                    <h4 className="text-sm font-bold">{item.title}</h4>
                                    <p className="text-xs text-primary font-bold">৳{item.price.toLocaleString()}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleMoveToCart(item)}
                                        className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                                        title="Add to Cart"
                                    >
                                        <ShoppingCart size={16} />
                                    </button>
                                    <button
                                        onClick={() => toggleWishlist(item)}
                                        className="p-2 text-red-400 hover:bg-red-50 rounded-full transition-colors"
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