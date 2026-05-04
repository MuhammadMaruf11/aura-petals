import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistItem {
    id: string;
    title: string;
    price: number;
    image_url: string;
    tier?: "elite" | "average";
}

interface WishlistState {
    wishlist: WishlistItem[];
    toggleWishlist: (product: WishlistItem) => void;
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            wishlist: [],

            toggleWishlist: (product) => {
                const currentWishlist = get().wishlist;
                const exists = currentWishlist.some((item) => item.id === product.id);

                if (exists) {
                    set({
                        wishlist: currentWishlist.filter((item) => item.id !== product.id),
                    });
                } else {
                    set({ wishlist: [...currentWishlist, product] });
                }
            },

            isInWishlist: (productId) => {
                return get().wishlist.some((item) => item.id === productId);
            },

            clearWishlist: () => set({ wishlist: [] }),
        }),
        { name: "aura-wishlist-storage" }
    )
);