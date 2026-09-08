import "server-only";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/current-user";

export async function getWishlistProductIds(): Promise<string[]> {
  const session = await getSession();
  if (!session) return [];

  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: session.sub },
    include: { items: { select: { productId: true } } },
  });
  return wishlist?.items.map((item) => item.productId) ?? [];
}

export async function getWishlistWithProducts() {
  const session = await getSession();
  if (!session) return [];

  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: session.sub },
    include: {
      items: {
        include: {
          product: { include: { images: { where: { isMain: true }, take: 1 }, category: true, variants: true } },
        },
        orderBy: { addedAt: "desc" },
      },
    },
  });
  return wishlist?.items ?? [];
}

export async function toggleWishlistItem(productId: string): Promise<{ inWishlist: boolean }> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHENTICATED");

  const wishlist = await prisma.wishlist.upsert({
    where: { userId: session.sub },
    update: {},
    create: { userId: session.sub },
  });

  const existing = await prisma.wishlistItem.findUnique({
    where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    return { inWishlist: false };
  }

  await prisma.wishlistItem.create({ data: { wishlistId: wishlist.id, productId } });
  return { inWishlist: true };
}

export async function removeWishlistItem(productId: string) {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHENTICATED");
  const wishlist = await prisma.wishlist.findUnique({ where: { userId: session.sub } });
  if (!wishlist) return;
  await prisma.wishlistItem.deleteMany({ where: { wishlistId: wishlist.id, productId } });
}
