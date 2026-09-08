import "server-only";
import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@prisma/client";

const productCardInclude = {
  images: { orderBy: { sortOrder: "asc" as const }, take: 2 },
  category: true,
  variants: { orderBy: { price: "asc" as const }, take: 1 },
} satisfies Prisma.ProductInclude;

export type ProductCardData = Prisma.ProductGetPayload<{
  include: typeof productCardInclude;
}>;

export async function getFeaturedProducts(limit = 8) {
  return prisma.product.findMany({
    where: { status: "ACTIVE", isFeatured: true },
    include: productCardInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getNewArrivals(limit = 8) {
  return prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: productCardInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getBestSellers(limit = 8) {
  return prisma.product.findMany({
    where: { status: "ACTIVE", badges: { has: "BEST_SELLER" } },
    include: productCardInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getLimitedEditionProducts(limit = 8) {
  return prisma.product.findMany({
    where: { status: "ACTIVE", badges: { has: "LIMITED_EDITION" } },
    include: productCardInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getGiftBundles(limit = 6) {
  return prisma.product.findMany({
    where: { status: "ACTIVE", type: "BUNDLE" },
    include: productCardInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getFeaturedCategories(limit = 6) {
  return prisma.category.findMany({
    where: { isFeatured: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
  });
}

export async function getProductsByIds(ids: string[]) {
  if (ids.length === 0) return [];
  const products = await prisma.product.findMany({
    where: { id: { in: ids }, status: "ACTIVE" },
    include: productCardInclude,
  });
  // Preserve the caller's ordering (most-recently-viewed first).
  const order = new Map(ids.map((id, index) => [id, index]));
  return products.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
}

export async function getAllCategories() {
  return prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
}

/** Full category tree (active categories only) for shop filter sidebars and nav. */
export async function getCategoryTree() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  type Node = (typeof categories)[number] & { children: Node[] };
  const byId = new Map<string, Node>(categories.map((c) => [c.id, { ...c, children: [] }]));
  const roots: Node[] = [];
  for (const category of categories) {
    const node = byId.get(category.id)!;
    if (category.parentId && byId.has(category.parentId)) {
      byId.get(category.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

/** Ancestor chain from root down to (and including) the given category — for breadcrumbs. */
export async function getCategoryBreadcrumb(categoryId: string) {
  const chain: { id: string; name: string; slug: string }[] = [];
  let current = await prisma.category.findUnique({ where: { id: categoryId } });
  while (current) {
    chain.unshift({ id: current.id, name: current.name, slug: current.slug });
    current = current.parentId
      ? await prisma.category.findUnique({ where: { id: current.parentId } })
      : null;
  }
  return chain;
}

/** All descendant category IDs (including the category itself) — used so filtering by a
 *  parent category also includes products assigned to its subcategories. */
export async function getCategoryAndDescendantIds(categoryId: string) {
  const all = await prisma.category.findMany({ select: { id: true, parentId: true } });
  const childrenOf = new Map<string, string[]>();
  for (const c of all) {
    if (!c.parentId) continue;
    if (!childrenOf.has(c.parentId)) childrenOf.set(c.parentId, []);
    childrenOf.get(c.parentId)!.push(c.id);
  }
  const ids: string[] = [];
  function walk(id: string) {
    ids.push(id);
    for (const childId of childrenOf.get(id) ?? []) walk(childId);
  }
  walk(categoryId);
  return ids;
}

export async function getActiveBanners(placement: "HERO" | "PROMO_STRIP" | "MID_PAGE") {
  const now = new Date();
  return prisma.banner.findMany({
    where: {
      placement,
      isActive: true,
      OR: [{ startsAt: null }, { startsAt: { lte: now } }],
      AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
    },
    orderBy: { sortOrder: "asc" },
  });
}

export type ProductListFilters = {
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  type?: Prisma.ProductWhereInput["type"];
  inStockOnly?: boolean;
  tagSlugs?: string[];
  isFeatured?: boolean;
  badges?: ("NEW" | "BEST_SELLER")[];
  sort?: "newest" | "price-asc" | "price-desc" | "best-selling";
  page?: number;
  pageSize?: number;
};

export async function listProducts(filters: ProductListFilters) {
  const {
    categorySlug,
    search,
    minPrice,
    maxPrice,
    type,
    inStockOnly,
    tagSlugs,
    isFeatured,
    badges,
    sort = "newest",
    page = 1,
    pageSize = 12,
  } = filters;

  let categoryIds: string[] | null = null;
  if (categorySlug) {
    const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    // Filtering by a parent category also includes products in its
    // subcategories/child categories, not just products assigned directly.
    categoryIds = category ? await getCategoryAndDescendantIds(category.id) : [];
  }

  const where: Prisma.ProductWhereInput = {
    status: "ACTIVE",
    ...(categoryIds ? { categoryId: { in: categoryIds } } : {}),
    ...(type ? { type } : {}),
    ...(inStockOnly ? { stock: { gt: 0 } } : {}),
    ...(isFeatured ? { isFeatured: true } : {}),
    ...(badges && badges.length > 0 ? { badges: { hasSome: badges } } : {}),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
          price: {
            ...(minPrice !== undefined ? { gte: minPrice } : {}),
            ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
          },
        }
      : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { shortDescription: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(tagSlugs && tagSlugs.length > 0
      ? { tags: { some: { tag: { slug: { in: tagSlugs } } } } }
      : {}),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
        ? { price: "desc" }
        : sort === "best-selling"
          ? { createdAt: "desc" } // proxy until order-aggregated bestseller stats are computed
          : { createdAt: "desc" };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productCardInclude,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, page, pageSize, pageCount: Math.ceil(total / pageSize) };
}

const productDetailInclude = {
  images: { orderBy: { sortOrder: "asc" as const } },
  category: true,
  variants: true,
  customizationFields: { orderBy: { sortOrder: "asc" as const } },
  bundleItems: {
    include: {
      component: { include: { images: { where: { isMain: true }, take: 1 } } },
    },
  },
  reviews: { where: { isApproved: true }, include: { user: true }, orderBy: { createdAt: "desc" as const } },
} satisfies Prisma.ProductInclude;

export type ProductDetailData = Prisma.ProductGetPayload<{
  include: typeof productDetailInclude;
}>;

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, status: "ACTIVE" },
    include: productDetailInclude,
  });
}

/** Same shape as getProductBySlug, keyed by id — used by the Quick View modal,
 *  which only has a product id available from the product card/grid. */
export async function getProductById(id: string) {
  return prisma.product.findFirst({
    where: { id, status: "ACTIVE" },
    include: productDetailInclude,
  });
}

export async function getRelatedProducts(productId: string, categoryId: string | null, limit = 4) {
  return prisma.product.findMany({
    where: {
      status: "ACTIVE",
      id: { not: productId },
      ...(categoryId ? { categoryId } : {}),
    },
    include: productCardInclude,
    take: limit,
  });
}

/**
 * Products that have historically appeared in the same orders as this one.
 * Falls back to same-category picks when there isn't enough order history yet
 * (e.g. a brand-new store with no orders).
 */
export async function getFrequentlyBoughtTogether(
  productId: string,
  categoryId: string | null,
  limit = 4,
) {
  const coOccurringOrderItems = await prisma.orderItem.findMany({
    where: {
      productId: { not: productId },
      order: { items: { some: { productId } } },
    },
    select: { productId: true },
    distinct: ["productId"],
    take: limit * 3,
  });

  const coOccurringIds = coOccurringOrderItems.map((i) => i.productId);

  if (coOccurringIds.length >= limit) {
    return prisma.product.findMany({
      where: { id: { in: coOccurringIds }, status: "ACTIVE" },
      include: productCardInclude,
      take: limit,
    });
  }

  // Not enough purchase history yet — top up with same-category products.
  const fallback = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      id: { notIn: [productId, ...coOccurringIds] },
      ...(categoryId ? { categoryId } : {}),
    },
    include: productCardInclude,
    take: limit - coOccurringIds.length,
  });

  const primary =
    coOccurringIds.length > 0
      ? await prisma.product.findMany({
          where: { id: { in: coOccurringIds }, status: "ACTIVE" },
          include: productCardInclude,
        })
      : [];

  return [...primary, ...fallback];
}
