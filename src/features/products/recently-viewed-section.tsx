"use client";

import { useEffect, useState } from "react";
import {
  useRecentlyViewedIds,
  useRecordRecentlyViewed,
} from "@/features/products/use-recently-viewed";
import { getProductsForIds } from "@/server/actions/product.actions";
import { ProductSection } from "@/features/home/product-section";
import type { ProductCardData } from "@/server/services/product.service";

/** Drop this on a product detail page: records the view and shows past views. */
export function RecordAndShowRecentlyViewed({ productId }: { productId: string }) {
  useRecordRecentlyViewed(productId);
  const ids = useRecentlyViewedIds(productId);
  const [products, setProducts] = useState<ProductCardData[]>([]);

  useEffect(() => {
    if (ids.length === 0) return;
    let cancelled = false;
    getProductsForIds(ids.slice(0, 8)).then((result) => {
      if (!cancelled) setProducts(result);
    });
    return () => {
      cancelled = true;
    };
  }, [ids]);

  if (products.length === 0) return null;

  return <ProductSection title="Recently viewed" products={products} />;
}
