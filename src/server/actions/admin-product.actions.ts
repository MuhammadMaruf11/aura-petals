"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/current-user";
import {
  productFormSchema,
  variantFormSchema,
  customizationFieldFormSchema,
} from "@/lib/validations/admin";
import {
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminAddProductImage,
  adminGetProductImage,
  adminDeleteProductImage,
  adminSetMainProductImage,
  adminReorderProductImages,
  adminCreateVariant,
  adminUpdateVariant,
  adminDeleteVariant,
  adminAddCustomizationField,
  adminUpdateCustomizationField,
  adminDeleteCustomizationField,
  adminAddBundleItem,
  adminDeleteBundleItem,
  adminSearchProductsForBundle,
  isImageUrlReferencedByOrders,
  adminGetProductById,
} from "@/server/services/admin-product.service";
import { deleteImageFromCloudinary } from "@/lib/cloudinary/cloudinary";

export type AdminActionResult =
  | { success: true; id?: string }
  | { success: false; message: string };

function toNullableNumber(value: number | "" | undefined): number | null {
  return value === "" || value === undefined ? null : value;
}

export async function saveProductAction(
  productId: string | null,
  raw: Record<string, unknown>,
): Promise<AdminActionResult> {
  await requireAdmin();
  const parsed = productFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const data = {
    name: parsed.data.name,
    slug: parsed.data.slug,
    shortDescription: parsed.data.shortDescription || undefined,
    description: parsed.data.description,
    sku: parsed.data.sku || undefined,
    brand: parsed.data.brand || undefined,
    type: parsed.data.type,
    status: parsed.data.status,
    badges: parsed.data.badges,
    categoryId: parsed.data.categoryId || null,
    price: parsed.data.price,
    compareAtPrice: toNullableNumber(parsed.data.compareAtPrice),
    costPrice: toNullableNumber(parsed.data.costPrice),
    stock: parsed.data.stock,
    lowStockThreshold: parsed.data.lowStockThreshold,
    allowBackorder: parsed.data.allowBackorder,
    trackInventory: parsed.data.trackInventory,
    isFeatured: parsed.data.isFeatured,
    videoUrl: parsed.data.videoUrl || undefined,
    weightGrams: toNullableNumber(parsed.data.weightGrams),
    metaTitle: parsed.data.metaTitle || undefined,
    metaDescription: parsed.data.metaDescription || undefined,
  };

  try {
    const product = productId
      ? await adminUpdateProduct(productId, data)
      : await adminCreateProduct(data);
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${product.id}`);
    return { success: true, id: product.id };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error && error.message.includes("Unique constraint")
          ? "A product with this slug or SKU already exists."
          : "Could not save product.",
    };
  }
}

export async function deleteProductAction(productId: string): Promise<AdminActionResult> {
  await requireAdmin();
  try {
    // Clean up any Cloudinary assets that aren't referenced by past orders
    // before removing the product — otherwise those assets are orphaned in
    // Cloudinary forever (the ProductImage rows cascade-delete with the
    // product). Images still referenced by order history are deliberately
    // left in Cloudinary so past invoices/orders keep working.
    const product = await adminGetProductById(productId);
    if (product) {
      for (const image of product.images) {
        if (!image.cloudinaryPublicId) continue;
        const stillReferenced = await isImageUrlReferencedByOrders(image.url);
        if (!stillReferenced) {
          await deleteImageFromCloudinary(image.cloudinaryPublicId);
        }
      }
    }

    await adminDeleteProduct(productId);
    revalidatePath("/admin/products");
    return { success: true };
  } catch {
    return { success: false, message: "Could not delete product. It may be referenced by existing orders." };
  }
}

export async function addProductImageAction(
  productId: string,
  url: string,
  isMain: boolean,
  cloudinaryPublicId?: string | null,
): Promise<AdminActionResult & { imageId?: string }> {
  await requireAdmin();
  if (!url.trim()) return { success: false, message: "Image URL is required." };
  const image = await adminAddProductImage(productId, url.trim(), isMain, cloudinaryPublicId);
  revalidatePath(`/admin/products/${productId}`);
  return { success: true, imageId: image.id };
}

export async function deleteProductImageAction(
  imageId: string,
  productId: string,
): Promise<AdminActionResult> {
  await requireAdmin();
  const image = await adminGetProductImage(imageId);
  await adminDeleteProductImage(imageId);
  if (image?.cloudinaryPublicId) {
    // Never delete an asset that's still referenced by a past order's
    // snapshot — that would break the image on an existing invoice/order
    // page even though the product itself is unaffected.
    const stillReferenced = await isImageUrlReferencedByOrders(image.url);
    if (!stillReferenced) {
      await deleteImageFromCloudinary(image.cloudinaryPublicId);
    }
  }
  revalidatePath(`/admin/products/${productId}`);
  return { success: true };
}

export async function setMainProductImageAction(
  productId: string,
  imageId: string,
): Promise<AdminActionResult> {
  await requireAdmin();
  await adminSetMainProductImage(productId, imageId);
  revalidatePath(`/admin/products/${productId}`);
  return { success: true };
}

export async function reorderProductImagesAction(
  productId: string,
  orderedImageIds: string[],
): Promise<AdminActionResult> {
  await requireAdmin();
  await adminReorderProductImages(productId, orderedImageIds);
  revalidatePath(`/admin/products/${productId}`);
  return { success: true };
}

export async function saveVariantAction(
  productId: string,
  variantId: string | null,
  raw: Record<string, unknown>,
): Promise<AdminActionResult> {
  await requireAdmin();
  const parsed = variantFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  let options: Record<string, string>;
  try {
    options = JSON.parse(parsed.data.optionsJson);
  } catch {
    return { success: false, message: "Options must be valid JSON, e.g. {\"Color\":\"Terracotta\"}" };
  }

  const input = {
    name: parsed.data.name,
    sku: parsed.data.sku,
    price: parsed.data.price,
    options,
    stock: parsed.data.stock,
    image: parsed.data.image || undefined,
    allowBackorder: parsed.data.allowBackorder,
    isDefault: parsed.data.isDefault,
  };

  try {
    if (variantId) {
      await adminUpdateVariant(variantId, input);
    } else {
      await adminCreateVariant(productId, input);
    }
    revalidatePath(`/admin/products/${productId}`);
    return { success: true };
  } catch {
    return { success: false, message: "Could not save variant — check the SKU is unique." };
  }
}

export async function deleteVariantAction(
  variantId: string,
  productId: string,
): Promise<AdminActionResult> {
  await requireAdmin();
  await adminDeleteVariant(variantId);
  revalidatePath(`/admin/products/${productId}`);
  return { success: true };
}

export async function saveCustomizationFieldAction(
  productId: string,
  fieldId: string | null,
  raw: Record<string, unknown>,
): Promise<AdminActionResult> {
  await requireAdmin();
  const parsed = customizationFieldFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const input = {
    label: parsed.data.label,
    fieldKey: parsed.data.fieldKey,
    type: parsed.data.type,
    isRequired: parsed.data.isRequired,
    options: parsed.data.optionsCsv
      ? parsed.data.optionsCsv.split(",").map((s) => s.trim()).filter(Boolean)
      : [],
    maxLength: parsed.data.maxLength || null,
    sortOrder: parsed.data.sortOrder,
  };

  try {
    if (fieldId) {
      await adminUpdateCustomizationField(fieldId, input);
    } else {
      await adminAddCustomizationField(productId, input);
    }
    revalidatePath(`/admin/products/${productId}`);
    return { success: true };
  } catch {
    return { success: false, message: "Could not save field — the field key may already be used on this product." };
  }
}

export async function deleteCustomizationFieldAction(
  fieldId: string,
  productId: string,
): Promise<AdminActionResult> {
  await requireAdmin();
  await adminDeleteCustomizationField(fieldId);
  revalidatePath(`/admin/products/${productId}`);
  return { success: true };
}

export async function addBundleItemAction(
  bundleId: string,
  componentId: string,
  quantity: number,
): Promise<AdminActionResult> {
  await requireAdmin();
  await adminAddBundleItem(bundleId, componentId, quantity);
  revalidatePath(`/admin/products/${bundleId}`);
  return { success: true };
}

export async function deleteBundleItemAction(
  bundleItemId: string,
  bundleId: string,
): Promise<AdminActionResult> {
  await requireAdmin();
  await adminDeleteBundleItem(bundleItemId);
  revalidatePath(`/admin/products/${bundleId}`);
  return { success: true };
}

export async function searchProductsForBundleAction(search: string, excludeId: string) {
  await requireAdmin();
  if (!search.trim()) return [];
  return adminSearchProductsForBundle(search, excludeId);
}
