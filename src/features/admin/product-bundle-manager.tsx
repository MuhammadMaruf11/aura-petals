"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  addBundleItemAction,
  deleteBundleItemAction,
  searchProductsForBundleAction,
} from "@/server/actions/admin-product.actions";
import { formatPrice } from "@/lib/utils";
import type { Product, ProductBundleItem } from "@prisma/client";

type BundleItemWithComponent = ProductBundleItem & { component: Product };

export function ProductBundleManager({
  bundleId,
  items,
}: {
  bundleId: string;
  items: BundleItemWithComponent[];
}) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSearch(value: string) {
    setSearch(value);
    startTransition(async () => {
      const found = value.trim() ? await searchProductsForBundleAction(value, bundleId) : [];
      setResults(found);
    });
  }

  function handleAdd(componentId: string) {
    startTransition(async () => {
      await addBundleItemAction(bundleId, componentId, 1);
      setSearch("");
      setResults([]);
      router.refresh();
    });
  }

  function handleDelete(bundleItemId: string) {
    startTransition(async () => {
      await deleteBundleItemAction(bundleItemId, bundleId);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {items.length > 0 && (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between rounded-lg border border-border/70 p-3 text-sm">
              <span>
                {item.quantity}× {item.component.name}{" "}
                <span className="text-muted-foreground">
                  ({formatPrice(Number(item.component.price))} each)
                </span>
              </span>
              <button onClick={() => handleDelete(item.id)} aria-label="Remove from bundle">
                <Trash2 className="size-4 text-destructive" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="relative max-w-sm">
        <Input
          placeholder="Search products to add…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {results.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-popover shadow-md">
            {results.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => handleAdd(product.id)}
                disabled={isPending}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-secondary"
              >
                {product.name} — {formatPrice(Number(product.price))}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
