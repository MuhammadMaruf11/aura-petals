/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { CustomButton } from "@/components/ui/custom-button";
import { Trash2, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";

export const CartDrawer = ({ isOpen, onClose }: any) => {
    const router = useRouter();

    // Fetching data and functions from Zustand Store
    const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCartStore();

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-md flex flex-col bg-background p-0">
                <SheetHeader className="p-6 border-b">
                    <SheetTitle className="font-heading text-2xl text-primary flex items-center gap-2">
                        <ShoppingBag size={24} />
                        Shopping Cart ({cart.length})
                    </SheetTitle>
                </SheetHeader>

                <div className="grow overflow-y-auto px-6 py-4">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                                <ShoppingBag className="text-muted-foreground" size={40} />
                            </div>
                            <p className="text-muted-foreground font-medium">Your cart is empty</p>
                            <CustomButton variant="primary" onClick={onClose}>Start Shopping</CustomButton>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-4 group">
                                    {/* Product Image */}
                                    <div className="w-20 h-24 relative bg-muted overflow-hidden rounded-sm">
                                        <Image
                                            src={item.image_url || "/placeholder.jpg"}
                                            alt={item.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="grow flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start gap-2">
                                                <h4 className="font-bold text-sm leading-tight">{item.title}</h4>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            {item.tier && (
                                                <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mt-1">
                                                    Tier: {item.tier}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-end mt-2">
                                            {/* Quantity Controller */}
                                            <div className="flex items-center border rounded-full px-2 py-1 gap-4 text-xs font-bold">
                                                <button
                                                    className="hover:text-primary transition-colors px-1"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                >
                                                    −
                                                </button>
                                                <span className="w-4 text-center">{item.quantity}</span>
                                                <button
                                                    className="hover:text-primary transition-colors px-1"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <p className="font-bold text-primary">
                                                ৳{(item.price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <SheetFooter className="border-t p-6 flex-col gap-3 sm:flex-col">
                        <div className="flex justify-between items-center w-full mb-2">
                            <span className="font-bold text-muted-foreground uppercase tracking-tighter text-xs">Subtotal</span>
                            <span className="font-heading text-2xl text-primary">
                                ৳{getTotalPrice().toLocaleString()}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 w-full">
                            <CustomButton
                                variant="secondary"
                                className="w-full"
                                onClick={() => { router.push("/cart"); onClose(); }}
                            >
                                View Cart
                            </CustomButton>
                            <CustomButton
                                variant="primary"
                                className="w-full shadow-lg shadow-primary/20"
                                onClick={() => { router.push("/checkout"); onClose(); }}
                            >
                                Checkout
                            </CustomButton>
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
};