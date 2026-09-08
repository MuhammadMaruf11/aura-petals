import "server-only";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/current-user";
import { getOrCreateGuestToken } from "@/lib/cart/guest-token";
import {  maxOrderableQuantity } from "@/lib/stock";
import type { CartDTO, CartItemDTO } from "@/features/cart/cart.types";
import type { Prisma } from "@prisma/client";

const cartInclude = {
  items: {
    include: {
      product: {
        include: { images: { where: { isMain: true }, take: 1 } },
      },
      variant: true,
    },
    orderBy: { createdAt: "asc" as const },
  },
} satisfies Prisma.CartInclude;

type CartWithItems = Prisma.CartGetPayload<{ include: typeof cartInclude }>;

function toCartDTO(cart: CartWithItems): CartDTO {
  const items: CartItemDTO[] = cart.items.map((item) => {
    const price = item.variant ? item.variant.price : item.product.price;
    const stock = item.variant ? item.variant.stock : item.product.stock;
    const allowBackorder = item.variant
      ? item.variant.allowBackorder
      : item.product.allowBackorder;
    const image = item.variant?.image ?? item.product.images[0]?.url ?? null;

    return {
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      productSlug: item.product.slug,
      image,
      variantId: item.variantId,
      variantName: item.variant?.name ?? null,
      unitPrice: Number(price),
      quantity: item.quantity,
      stock,
      allowBackorder,
      trackInventory: item.product.trackInventory,
      customization:
        (item.customization as Record<string, unknown> | null) ?? null,
    };
  });

  return { id: cart.id, items };
}

/** Resolves (and lazily creates) the cart for the current visitor — logged in or guest. */
export async function getOrCreateCartForCurrentVisitor() {
  const session = await getSession();

  if (session) {
    const cart = await prisma.cart.upsert({
      where: { userId: session.sub },
      update: {},
      create: { userId: session.sub },
      include: cartInclude,
    });
    return cart;
  }

  const guestToken = await getOrCreateGuestToken();
  const cart = await prisma.cart.upsert({
    where: { guestToken },
    update: {},
    create: { guestToken },
    include: cartInclude,
  });
  return cart;
}

export async function getCurrentCartDTO(): Promise<CartDTO> {
  const cart = await getOrCreateCartForCurrentVisitor();
  return toCartDTO(cart);
}

type AddToCartInput = {
  productId: string;
  variantId?: string | null;
  quantity: number;
  customization?: Prisma.InputJsonValue | null;
};

export async function addItemToCart(input: AddToCartInput): Promise<CartDTO> {
  const cart = await getOrCreateCartForCurrentVisitor();

  const product = await prisma.product.findUnique({
    where: { id: input.productId },
    include: { variants: true },
  });
  if (!product || product.status !== "ACTIVE") {
    throw new Error("This product is not currently available.");
  }

  const variant = input.variantId
    ? product.variants.find((v) => v.id === input.variantId)
    : null;
  if (input.variantId && !variant) {
    throw new Error("Selected variant not found.");
  }

  const availableStock = variant ? variant.stock : product.stock;
  const allowBackorder = variant
    ? variant.allowBackorder
    : product.allowBackorder;
  const maxQuantity = maxOrderableQuantity({
    stock: availableStock,
    allowBackorder,
    trackInventory: product.trackInventory,
  });

  // Personalized products are never merged into an existing line, since each
  // customization is unique — every add creates a new line item.
  const isPersonalized = product.type === "PERSONALIZED" && input.customization;

  const existingItem = isPersonalized
    ? null
    : await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: input.productId,
          variantId: input.variantId ?? null,
        },
      });

  const requestedQuantity = (existingItem?.quantity ?? 0) + input.quantity;

  if (requestedQuantity > maxQuantity) {
    throw new Error(`Only ${availableStock} left in stock.`);
  }

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: requestedQuantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: input.productId,
        variantId: input.variantId ?? null,
        quantity: input.quantity,
        customization: input.customization ?? undefined,
      },
    });
  }

  return getCurrentCartDTO();
}

export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number,
): Promise<CartDTO> {
  const cart = await getOrCreateCartForCurrentVisitor();
  const item = await prisma.cartItem.findFirst({
    where: { id: cartItemId, cartId: cart.id },
    include: { product: true, variant: true },
  });
  if (!item) throw new Error("Cart item not found.");

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: cartItemId } });
    return getCurrentCartDTO();
  }

  const availableStock = item.variant ? item.variant.stock : item.product.stock;
  const allowBackorder = item.variant
    ? item.variant.allowBackorder
    : item.product.allowBackorder;
  const maxQuantity = maxOrderableQuantity({
    stock: availableStock,
    allowBackorder,
    trackInventory: item.product.trackInventory,
  });

  if (quantity > maxQuantity) {
    throw new Error(`Only ${availableStock} left in stock.`);
  }

  await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });

  return getCurrentCartDTO();
}

export async function removeCartItem(cartItemId: string): Promise<CartDTO> {
  const cart = await getOrCreateCartForCurrentVisitor();
  await prisma.cartItem.deleteMany({
    where: { id: cartItemId, cartId: cart.id },
  });
  return getCurrentCartDTO();
}

/** Merges a guest cart into a user's cart right after login/registration. */
export async function mergeGuestCartIntoUserCart(
  userId: string,
  guestToken: string,
) {
  const guestCart = await prisma.cart.findUnique({
    where: { guestToken },
    include: { items: true },
  });
  if (!guestCart || guestCart.items.length === 0) return;

  const userCart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  for (const item of guestCart.items) {
    const existing = await prisma.cartItem.findFirst({
      where: {
        cartId: userCart.id,
        productId: item.productId,
        variantId: item.variantId,
      },
    });
    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + item.quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          customization: item.customization ?? undefined,
        },
      });
    }
  }

  await prisma.cart.delete({ where: { id: guestCart.id } });
}
