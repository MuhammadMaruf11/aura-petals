import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().trim().min(2),
  slug: z
    .string()
    .trim()
    .min(2)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase letters, numbers, and hyphens only",
    ),
  shortDescription: z.string().trim().max(300).optional().or(z.literal("")),
  description: z.string().trim().min(10),
  sku: z.string().trim().optional().or(z.literal("")),
  brand: z.string().trim().optional().or(z.literal("")),
  type: z.enum(["STANDARD", "VARIANT", "PERSONALIZED", "BUNDLE"]),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]),
  badges: z.array(
    z.enum([
      "NEW",
      "BEST_SELLER",
      "LIMITED_EDITION",
      "HANDMADE",
      "PERSONALIZED",
      "SALE",
    ]),
  ),
  categoryId: z.string().optional().or(z.literal("")),
  price: z.coerce.number().min(0),
  compareAtPrice: z.coerce.number().min(0).optional().or(z.literal("")),
  costPrice: z.coerce.number().min(0).optional().or(z.literal("")),
  stock: z.coerce.number().int().min(0),
  lowStockThreshold: z.coerce.number().int().min(0),
  allowBackorder: z.boolean(),
  trackInventory: z.boolean(),
  isFeatured: z.boolean(),
  videoUrl: z.string().trim().optional().or(z.literal("")),
  weightGrams: z.coerce.number().int().min(0).optional().or(z.literal("")),
  metaTitle: z.string().trim().optional().or(z.literal("")),
  metaDescription: z.string().trim().optional().or(z.literal("")),
});
export type ProductFormValues = z.infer<typeof productFormSchema>;

export const variantFormSchema = z.object({
  name: z.string().trim().min(1),
  sku: z.string().trim().min(1),
  price: z.coerce.number().min(0),
  optionsJson: z.string().min(2), // JSON object string, e.g. {"Color":"Terracotta"}
  stock: z.coerce.number().int().min(0),
  image: z.string().trim().optional().or(z.literal("")),
  allowBackorder: z.boolean(),
  isDefault: z.boolean(),
});

export const customizationFieldFormSchema = z.object({
  label: z.string().trim().min(1),
  fieldKey: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9_]+$/, "Use letters, numbers, and underscores only"),
  type: z.enum(["TEXT", "TEXTAREA", "DATE", "COLOR", "SELECT", "IMAGE_UPLOAD"]),
  isRequired: z.boolean(),
  optionsCsv: z.string().optional().or(z.literal("")),
  maxLength: z.coerce.number().int().min(1).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0),
});

export const categoryFormSchema = z.object({
  name: z.string().trim().min(2),
  slug: z
    .string()
    .trim()
    .min(2)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().trim().optional().or(z.literal("")),
  image: z.string().trim().optional().or(z.literal("")),
  imageCloudinaryPublicId: z.string().trim().optional().nullable(),
  parentId: z.string().optional().or(z.literal("")),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
  sortOrder: z.coerce.number().int().min(0),
});

export const couponFormSchema = z.object({
  code: z.string().trim().min(3).toUpperCase(),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.coerce.number().min(0),
  minPurchase: z.coerce.number().min(0).optional().or(z.literal("")),
  maxDiscount: z.coerce.number().min(0).optional().or(z.literal("")),
  usageLimit: z.coerce.number().int().min(0).optional().or(z.literal("")),
  perUserLimit: z.coerce.number().int().min(0).optional().or(z.literal("")),
  startsAt: z.string().optional().or(z.literal("")),
  endsAt: z.string().optional().or(z.literal("")),
  isActive: z.boolean(),
});

// src/lib/validations/admin.ts

export const storeSettingsFormSchema = z.object({
  storeName: z.string().trim().min(1),
  storeEmail: z.string().email().optional().or(z.literal("")),
  storePhone: z.string().trim().optional().or(z.literal("")),
  storeAddress: z.string().trim().optional().or(z.literal("")),
  logoUrl: z.string().trim().optional().or(z.literal("")),
  logoCloudinaryPublicId: z.string().trim().nullable().optional(),
  faviconUrl: z.string().trim().optional().or(z.literal("")),
  faviconCloudinaryPublicId: z.string().trim().nullable().optional(),
  themeColor: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Use a hex color like #8b6f4e"),
  currencyCode: z.string().trim().min(2).max(6),
  currencySymbol: z.string().trim().min(1).max(4),
  instagramUrl: z.string().trim().optional().or(z.literal("")),
  facebookUrl: z.string().trim().optional().or(z.literal("")),
  whatsappUrl: z.string().trim().optional().or(z.literal("")),
  tiktokUrl: z.string().trim().optional().or(z.literal("")),
  deliveryChargeDhaka: z.coerce.number().min(0),
  deliveryChargeOutsideDhaka: z.coerce.number().min(0),
  deliveryChargeOther: z.coerce.number().min(0),
  shippingFlatRate: z.coerce.number().min(0).optional(),

  // Empty string, null ba undefined ke undefined-e transform korbe
  freeShippingThreshold: z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined ? undefined : Number(val),
    z.number().min(0).optional(),
  ),

  taxRatePercent: z.coerce.number().min(0).max(100),
  gtmId: z.string().trim().optional().or(z.literal("")),
  metaPixelId: z.string().trim().optional().or(z.literal("")),
});

export const bannerFormSchema = z.object({
  title: z.string().trim().min(1),
  subtitle: z.string().trim().optional().or(z.literal("")),
  imageUrl: z.string().trim().min(1),
  cloudinaryPublicId: z.string().trim().nullable().optional(),
  ctaLabel: z.string().trim().optional().or(z.literal("")),
  ctaHref: z.string().trim().optional().or(z.literal("")),
  placement: z.enum(["HERO", "PROMO_STRIP", "MID_PAGE"]),
  sortOrder: z.coerce.number().int().min(0),
  isActive: z.boolean(),
  startsAt: z.string().optional().or(z.literal("")),
  endsAt: z.string().optional().or(z.literal("")),
});

// The image is uploaded and tracked outside react-hook-form (via
// SingleImageUploader + local state), so the client-side resolver
// validates everything except imageUrl/cloudinaryPublicId — those are
// merged in right before calling the server action, which validates the
// full bannerFormSchema server-side.
export const bannerFormClientSchema = bannerFormSchema.omit({
  imageUrl: true,
  cloudinaryPublicId: true,
});
