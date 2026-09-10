import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function adminListCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  // Order as a tree (parent immediately followed by its children) rather
  // than flat sortOrder, and annotate each with its depth for indentation.
  const byParent = new Map<string | null, typeof categories>();
  for (const category of categories) {
    const key = category.parentId;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(category);
  }

  const ordered: ((typeof categories)[number] & { depth: number })[] = [];
  function walk(parentId: string | null, depth: number) {
    for (const category of byParent.get(parentId) ?? []) {
      ordered.push({ ...category, depth });
      walk(category.id, depth + 1);
    }
  }
  walk(null, 0);
  return ordered;
}

export type CategoryInput = {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  imageCloudinaryPublicId?: string | null;
  parentId?: string | null;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
};

/** Builds a flat, indented list of categories representing the tree — used for admin select dropdowns. */
export async function adminListCategoriesForSelect() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  const byParent = new Map<string | null, typeof categories>();
  for (const category of categories) {
    const key = category.parentId;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(category);
  }

  const result: { id: string; name: string; depth: number }[] = [];
  function walk(parentId: string | null, depth: number) {
    for (const category of byParent.get(parentId) ?? []) {
      result.push({ id: category.id, name: category.name, depth });
      walk(category.id, depth + 1);
    }
  }
  walk(null, 0);
  return result;
}

export async function adminGetCategoryById(id: string) {
  return prisma.category.findUnique({ where: { id } });
}

export async function adminCreateCategory(input: CategoryInput) {
  return prisma.category.create({ data: input });
}

export async function adminUpdateCategory(id: string, input: CategoryInput) {
  return prisma.category.update({ where: { id }, data: input });
}

export async function adminDeleteCategory(id: string) {
  return prisma.category.delete({ where: { id } });
}
