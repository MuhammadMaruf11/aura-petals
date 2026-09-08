import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function getAdminDashboardStats() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    totalRevenueAgg,
    totalOrders,
    totalCustomers,
    totalProducts,
    pendingOrders,
    trackedProducts,
    recentOrders,
    ordersByDay,
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID" },
    }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    // Prisma can't compare two columns of the same row in `where`, so we
    // fetch tracked products and filter for low stock in application code.
    prisma.product.findMany({
      where: { trackInventory: true, status: "ACTIVE" },
      select: { id: true, name: true, stock: true, lowStockThreshold: true },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { items: true },
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: startOfMonth } },
      select: { createdAt: true, total: true },
    }),
  ]);

  const lowStockProducts = trackedProducts
    .filter((p) => p.stock <= p.lowStockThreshold)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 10);

  // Group revenue by day for the current month, for the dashboard chart.
  const revenueByDay = new Map<string, number>();
  for (const order of ordersByDay) {
    const key = order.createdAt.toISOString().slice(0, 10);
    revenueByDay.set(key, (revenueByDay.get(key) ?? 0) + Number(order.total));
  }

  return {
    totalRevenue: Number(totalRevenueAgg._sum.total ?? 0),
    totalOrders,
    totalCustomers,
    totalProducts,
    pendingOrders,
    lowStockProducts,
    recentOrders,
    revenueByDay: Array.from(revenueByDay.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, total]) => ({ date, total })),
  };
}
