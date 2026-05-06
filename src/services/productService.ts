import { getSupabaseClient } from "@/lib/supabase";
import type { Product } from "@/types/platform";

type ProductRow = Partial<Product> & {
  imageUrl?: string;
  video_url?: string | null;
  compare_at_price?: number | string | null;
  created_at?: string;
  updated_at?: string;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const parseArrayValue = (value: unknown): unknown[] => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : value ? [value] : [];
    } catch {
      return value ? [value] : [];
    }
  }

  return [];
};

const asStringArray = (value: unknown): string[] =>
  parseArrayValue(value).filter((item): item is string => typeof item === "string" && item.length > 0);

const asSpecArray = (value: unknown): Product["specs"] =>
  parseArrayValue(value)
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    .map((item) => ({
      label: typeof item.label === "string" ? item.label : "",
      value: typeof item.value === "string" ? item.value : "",
    }))
    .filter((spec) => spec.label && spec.value);

const normalizeNumber = (value: unknown, fallback = 0) => {
  const normalized = typeof value === "number" ? value : Number(value);
  return Number.isFinite(normalized) ? normalized : fallback;
};

const normalizeProductRow = (row: ProductRow): Product => {
  const title = typeof row.title === "string" && row.title.trim() ? row.title : "Untitled product";
  const primaryImage =
    typeof row.image_url === "string"
      ? row.image_url
      : typeof row.imageUrl === "string"
        ? row.imageUrl
        : "";
  const images = asStringArray(row.images);
  const normalizedImages = images.length ? images : primaryImage ? [primaryImage] : [];

  return {
    id: typeof row.id === "string" ? row.id : crypto.randomUUID(),
    slug: typeof row.slug === "string" && row.slug ? row.slug : slugify(title),
    title,
    subtitle: typeof row.subtitle === "string" ? row.subtitle : "",
    description: typeof row.description === "string" ? row.description : "",
    price: normalizeNumber(row.price),
    compareAtPrice:
      row.compareAtPrice == null && row.compare_at_price == null
        ? undefined
        : normalizeNumber(row.compareAtPrice ?? row.compare_at_price),
    image_url: primaryImage || normalizedImages[0] || "",
    images: normalizedImages,
    videoUrl:
      typeof row.videoUrl === "string"
        ? row.videoUrl
        : typeof row.video_url === "string"
          ? row.video_url
          : undefined,
    tier: row.tier === "elite" ? "elite" : "average",
    category:
      row.category === "elite" ||
      row.category === "petals" ||
      row.category === "crafts" ||
      row.category === "budget" ||
      row.category === "wellness"
        ? row.category
        : "budget",
    featured: Boolean(row.featured),
    stock: normalizeNumber(row.stock),
    status: row.status === "draft" ? "draft" : "active",
    tags: asStringArray(row.tags),
    specs: asSpecArray(row.specs),
    createdAt: typeof row.createdAt === "string" ? row.createdAt : row.created_at ?? new Date().toISOString(),
    updatedAt: typeof row.updatedAt === "string" ? row.updatedAt : row.updated_at ?? new Date().toISOString(),
  };
};

export const getProducts = async (): Promise<Product[]> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as ProductRow[]).map(normalizeProductRow);
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  if (!query) {
    return [];
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .ilike("title", `%${query}%`);

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as ProductRow[]).map(normalizeProductRow);
};
