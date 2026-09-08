import "server-only";
import { prisma } from "@/lib/db/prisma";
import type { Prisma, ProductStatus, ProductType, ProductBadge, CustomizationFieldType } from "@prisma/client";

export async function adminListProducts(params: { search?: string; page?: number; pageSize?: number }) {
  const { search, page = 1, pageSize = 20 } = params;
  const where: Prisma.ProductWhereInput = search
    ? { OR: [{ name: { contains: search, mode: "insensitive" } }, { sku: { contains: search, mode: "insensitive" } }] }
    : {};

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, images: { where: { isMain: true }, take: 1 } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, page, pageCount: Math.ceil(total / pageSize) };
}

export async function adminGetProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
      customizationFields: { orderBy: { sortOrder: "asc" } },
      bundleItems: { include: { component: true } },
      category: true,
    },
  });
}

export type ProductFormInput = {
  name: string;
  slug: string;
  shortDescription?: string;
  description: string;
  sku?: string;
  brand?: string;
  type: ProductType;
  status: ProductStatus;
  badges: ProductBadge[];
  categoryId?: string | null;
  price: number;
  compareAtPrice?: number | null;
  costPrice?: number | null;
  stock: number;
  lowStockThreshold: number;
  allowBackorder: boolean;
  trackInventory: boolean;
  isFeatured: boolean;
  videoUrl?: string | null;
  weightGrams?: number | null;
  metaTitle?: string;
  metaDescription?: string;
};

export async function adminCreateProduct(input: ProductFormInput) {
  return prisma.product.create({ data: input });
}

export async function adminUpdateProduct(id: string, input: ProductFormInput) {
  return prisma.product.update({ where: { id }, data: input });
}

export async function adminDeleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}

// ---- Images ----
export async function adminAddProductImage(
  productId: string,
  url: string,
  isMain: boolean,
  cloudinaryPublicId?: string | null,
) {
  if (isMain) {
    await prisma.productImage.updateMany({ where: { productId }, data: { isMain: false } });
  }
  const count = await prisma.productImage.count({ where: { productId } });
  return prisma.productImage.create({
    data: { productId, url, isMain, sortOrder: count, cloudinaryPublicId: cloudinaryPublicId ?? null },
  });
}

export async function adminGetProductImage(imageId: string) {
  return prisma.productImage.findUnique({ where: { id: imageId } });
}

export async function adminDeleteProductImage(imageId: string) {
  return prisma.productImage.delete({ where: { id: imageId } });
}

/**
 * True if this exact image URL was snapshotted onto any order line item.
 * Used to guard Cloudinary deletions — an image still referenced by order
 * history should never be deleted from Cloudinary, even if it's been
 * removed from the live product, so past invoices/order pages don't break.
 */
export async function isImageUrlReferencedByOrders(url: string) {
  const match = await prisma.orderItem.findFirst({ where: { imageUrl: url } });
  return match !== null;
}

export async function adminSetMainProductImage(productId: string, imageId: string) {
  await prisma.productImage.updateMany({ where: { productId }, data: { isMain: false } });
  return prisma.productImage.update({ where: { id: imageId }, data: { isMain: true } });
}

/** Persists a new left-to-right order for a product's gallery images. */
export async function adminReorderProductImages(productId: string, orderedImageIds: string[]) {
  await prisma.$transaction(
    orderedImageIds.map((id, index) =>
      prisma.productImage.update({
        where: { id, productId },
        data: { sortOrder: index },
      }),
    ),
  );
}

// ---- Variants ----
export type VariantInput = {
  name: string;
  sku: string;
  price: number;
  options: Record<string, string>;
  stock: number;
  image?: string;
  allowBackorder: boolean;
  isDefault: boolean;
};

export async function adminCreateVariant(productId: string, input: VariantInput) {
  if (input.isDefault) {
    await prisma.productVariant.updateMany({ where: { productId }, data: { isDefault: false } });
  }
  return prisma.productVariant.create({ data: { productId, ...input } });
}

export async function adminUpdateVariant(variantId: string, input: VariantInput) {
  if (input.isDefault) {
    const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
    if (variant) {
      await prisma.productVariant.updateMany({
        where: { productId: variant.productId },
        data: { isDefault: false },
      });
    }
  }
  return prisma.productVariant.update({ where: { id: variantId }, data: input });
}

export async function adminDeleteVariant(variantId: string) {
  return prisma.productVariant.delete({ where: { id: variantId } });
}

// ---- Customization fields ----
export type CustomizationFieldInput = {
  label: string;
  fieldKey: string;
  type: CustomizationFieldType;
  isRequired: boolean;
  options: string[];
  maxLength?: number | null;
  sortOrder: number;
};

export async function adminAddCustomizationField(productId: string, input: CustomizationFieldInput) {
  return prisma.productCustomizationField.create({ data: { productId, ...input } });
}

export async function adminUpdateCustomizationField(fieldId: string, input: CustomizationFieldInput) {
  return prisma.productCustomizationField.update({ where: { id: fieldId }, data: input });
}

export async function adminDeleteCustomizationField(fieldId: string) {
  return prisma.productCustomizationField.delete({ where: { id: fieldId } });
}

// ---- Bundle items ----
export async function adminAddBundleItem(bundleId: string, componentId: string, quantity: number) {
  return prisma.productBundleItem.create({ data: { bundleId, componentId, quantity } });
}

export async function adminDeleteBundleItem(bundleItemId: string) {
  return prisma.productBundleItem.delete({ where: { id: bundleItemId } });
}

export async function adminSearchProductsForBundle(search: string, excludeId: string) {
  return prisma.product.findMany({
    where: {
      name: { contains: search, mode: "insensitive" },
      id: { not: excludeId },
      type: { not: "BUNDLE" },
    },
    take: 10,
  });
}
