"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/current-user";
import { categoryFormSchema } from "@/lib/validations/admin";
import {
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminListCategoriesForSelect,
} from "@/server/services/admin-category.service";
import type { AdminActionResult } from "@/server/actions/admin-product.actions";

export async function getCategoriesForSelectAction() {
  await requireAdmin();
  return adminListCategoriesForSelect();
}

export async function saveCategoryAction(
  categoryId: string | null,
  raw: Record<string, unknown>,
): Promise<AdminActionResult> {
  await requireAdmin();
  const parsed = categoryFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const data = {
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description || undefined,
    image: parsed.data.image || undefined,
    parentId: parsed.data.parentId || null,
    isFeatured: parsed.data.isFeatured,
    isActive: parsed.data.isActive,
    sortOrder: parsed.data.sortOrder,
  };

  try {
    const category = categoryId
      ? await adminUpdateCategory(categoryId, data)
      : await adminCreateCategory(data);
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    return { success: true, id: category.id };
  } catch {
    return { success: false, message: "Could not save category — the slug may already be in use." };
  }
}

export async function deleteCategoryAction(categoryId: string): Promise<AdminActionResult> {
  await requireAdmin();
  try {
    await adminDeleteCategory(categoryId);
    revalidatePath("/admin/categories");
    return { success: true };
  } catch {
    return { success: false, message: "Could not delete category — it may still have products." };
  }
}
