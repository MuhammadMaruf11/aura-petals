"use client";

import type { ProductCardData } from "@/server/services/product.service";
import { ProductCard } from "@/features/products/product-card";
import { ProductListItem } from "@/features/products/product-list-item";
import { useShopViewMode } from "@/features/products/use-shop-view-mode";

export function ShopResultsGrid({ items }: { items: ProductCardData[] }) {
  const [viewMode] = useShopViewMode();

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {items.map((product) => (
          <ProductListItem key={product.id} product={product} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
