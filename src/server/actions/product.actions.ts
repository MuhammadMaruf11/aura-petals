"use server";

import { getProductsByIds, getProductById } from "@/server/services/product.service";
import { serializeDecimals } from "@/lib/serialize";

export async function getProductsForIds(ids: string[]) {
  const products = await getProductsByIds(ids);
  return serializeDecimals(products);
}

export async function getProductForQuickView(productId: string) {
  const product = await getProductById(productId);
  return serializeDecimals(product);
}
