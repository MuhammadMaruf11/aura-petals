import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db/prisma";

export const getStoreSettings = cache(async () => {
  const settings = await prisma.storeSettings.findUnique({ where: { id: "singleton" } });
  if (settings) return settings;
  return prisma.storeSettings.create({ data: { id: "singleton" } });
});

export type StoreSettingsInput = {
  storeName: string;
  storeEmail?: string;
  storePhone?: string;
  storeAddress?: string;
  logoUrl?: string;
  logoCloudinaryPublicId?: string | null;
  currencyCode: string;
  currencySymbol: string;
  instagramUrl?: string;
  facebookUrl?: string;
  whatsappUrl?: string;
  tiktokUrl?: string;
  deliveryChargeDhaka: number;
  deliveryChargeOutsideDhaka: number;
  deliveryChargeOther: number;
  shippingFlatRate: number;
  freeShippingThreshold?: number | null;
  taxRatePercent: number;
  gtmId?: string;
  metaPixelId?: string;
};

export async function updateStoreSettings(input: StoreSettingsInput) {
  return prisma.storeSettings.upsert({
    where: { id: "singleton" },
    update: input,
    create: { id: "singleton", ...input },
  });
}
