import "server-only";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/current-user";

export async function getAccountOverview() {
  const user = await requireUser();

  const [totalOrders, recentOrders, wishlistCount] = await Promise.all([
    prisma.order.count({ where: { userId: user.id } }),
    prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: true },
    }),
    prisma.wishlistItem.count({ where: { wishlist: { userId: user.id } } }),
  ]);

  return { user, totalOrders, recentOrders, wishlistCount };
}

export async function updateProfile(input: { name: string; phone?: string | null }) {
  const user = await requireUser();
  return prisma.user.update({
    where: { id: user.id },
    data: { name: input.name, phone: input.phone || null },
  });
}
