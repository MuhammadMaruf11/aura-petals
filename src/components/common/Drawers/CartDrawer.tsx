/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CustomButton } from "@/components/ui/custom-button";
import { formatPrice } from "@/lib/platform";
import { useCartStore } from "@/store/useCartStore";

export const CartDrawer = ({ isOpen, onClose }: any) => {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCartStore();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex w-full flex-col bg-background p-0 sm:max-w-md">
        <SheetHeader className="border-b p-6">
          <SheetTitle className="flex items-center gap-2 font-heading text-2xl text-primary">
            <ShoppingBag size={24} />
            Shopping Cart ({cart.length})
          </SheetTitle>
        </SheetHeader>

        <div className="grow overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <ShoppingBag className="text-muted-foreground" size={40} />
              </div>
              <p className="font-medium text-muted-foreground">Your cart is empty</p>
              <CustomButton variant="primary" onClick={onClose}>
                Start Shopping
              </CustomButton>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-24 w-20 overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={item.image_url || "/placeholder.jpg"}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  <div className="flex grow flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold leading-tight">{item.title}</h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-muted-foreground transition-colors hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      {item.tier ? (
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-secondary">
                          Tier: {item.tier}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-2 flex items-end justify-between">
                      <div className="flex items-center gap-4 rounded-full border px-2 py-1 text-xs font-bold">
                        <button
                          className="px-1 transition-colors hover:text-primary"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="w-4 text-center">{item.quantity}</span>
                        <button
                          className="px-1 transition-colors hover:text-primary"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <p className="font-bold text-primary">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 ? (
          <SheetFooter className="flex-col gap-3 border-t p-6 sm:flex-col">
            <div className="mb-2 flex w-full items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-tighter text-muted-foreground">
                Subtotal
              </span>
              <span className="font-heading text-2xl text-primary">{formatPrice(getTotalPrice())}</span>
            </div>
            <div className="grid w-full grid-cols-2 gap-3">
              <CustomButton
                variant="secondary"
                className="w-full"
                onClick={() => {
                  router.push("/cart");
                  onClose();
                }}
              >
                View Cart
              </CustomButton>
              <CustomButton
                variant="primary"
                className="w-full shadow-lg shadow-primary/20"
                onClick={() => {
                  router.push("/checkout");
                  onClose();
                }}
              >
                Checkout
              </CustomButton>
            </div>
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
};
