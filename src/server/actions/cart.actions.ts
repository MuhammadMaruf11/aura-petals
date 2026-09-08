"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import {
  addItemToCart,
  getCurrentCartDTO,
  removeCartItem as removeCartItemService,
  updateCartItemQuantity as updateCartItemQuantityService,
} from "@/server/services/cart.service";
import type { CartDTO } from "@/features/cart/cart.types";

export async function getCart(): Promise<CartDTO> {
  return getCurrentCartDTO();
}

export type AddToCartActionInput = {
  productId: string;
  variantId?: string | null;
  quantity: number;
  customization?: Prisma.InputJsonValue | null;
};

export async function addToCart(
  input: AddToCartActionInput,
): Promise<
  { success: true; cart: CartDTO } | { success: false; message: string }
> {
  try {
    const cart = await addItemToCart({
      ...input,
      customization: input.customization as Prisma.InputJsonValue | undefined,
    });
    revalidatePath("/cart");
    return { success: true, cart };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Could not add to cart.",
    };
  }
}

export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number,
): Promise<
  { success: true; cart: CartDTO } | { success: false; message: string }
> {
  try {
    const cart = await updateCartItemQuantityService(cartItemId, quantity);
    revalidatePath("/cart");
    return { success: true, cart };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Could not update cart.",
    };
  }
}

export async function removeCartItem(
  cartItemId: string,
): Promise<
  { success: true; cart: CartDTO } | { success: false; message: string }
> {
  try {
    const cart = await removeCartItemService(cartItemId);
    revalidatePath("/cart");
    return { success: true, cart };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Could not remove item.",
    };
  }
}
