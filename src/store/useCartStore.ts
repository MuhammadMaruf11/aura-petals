import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
    id: string;
    title: string;
    price: number;
    image_url: string;
    quantity: number;
    tier?: "elite" | "average";
}

interface CartState {
    cart: CartItem[];
    addToCart: (product: CartItem) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: [],

            addToCart: (product) => {
                const currentCart = get().cart;
                const existingItem = currentCart.find((item) => item.id === product.id);

                if (existingItem) {
                    set({
                        cart: currentCart.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    set({ cart: [...currentCart, { ...product, quantity: 1 }] });
                }
            },

            removeFromCart: (productId) =>
                set({ cart: get().cart.filter((item) => item.id !== productId) }),

            updateQuantity: (productId, quantity) =>
                set({
                    cart: get().cart.map((item) =>
                        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
                    ),
                }),

            clearCart: () => set({ cart: [] }),

            getTotalPrice: () => {
                return get().cart.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );
            },
        }),
        { name: "aura-cart-storage" }
    )
);