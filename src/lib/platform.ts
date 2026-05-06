import type { ProductDraft, ProductTier, SubscriptionStatus } from "@/types/platform";

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

export const tierLabels: Record<ProductTier, string> = {
  elite: "Elite",
  average: "Everyday",
};

export const subscriptionLabels: Record<SubscriptionStatus, string> = {
  trial: "Trial",
  active: "Active",
  paused: "Paused",
  disabled: "Disabled",
};

export const createEmptyProductDraft = (): ProductDraft => ({
  title: "",
  subtitle: "",
  description: "",
  price: 0,
  compareAtPrice: 0,
  images: [""],
  videoUrl: "",
  tier: "average",
  category: "crafts",
  featured: false,
  stock: 1,
  status: "draft",
  tags: [""],
  specs: [
    { label: "Material", value: "" },
    { label: "Packaging", value: "" },
  ],
});
