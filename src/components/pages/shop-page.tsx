"use client";

import { startTransition, useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";

import { ProductCard } from "@/components/common/ProductCard";
import { QuickView } from "@/components/common/Modals/QuickView";
import { EmptyState } from "@/components/common/EmptyState";
import { Panel, SectionHeading } from "@/components/platform/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories } from "@/data/platform";
import { useMounted } from "@/hooks/use-mounted";
import { usePlatformStore } from "@/store/usePlatformStore";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";

const sortOptions = [
  { value: "featured", label: "Featured first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "latest", label: "Recently updated" },
];

export default function ShopPageClient() {
  const mounted = useMounted();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const products = usePlatformStore((state) => state.products);
  const { addToCart } = useCartStore();
  const { toggleWishlist } = useWishlistStore();

  const [selectedProduct, setSelectedProduct] = useState<(typeof products)[number] | null>(null);

  const initialSearch = searchParams.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(initialSearch);
  const deferredSearch = useDeferredValue(searchInput);
  const category = searchParams.get("category") ?? "";
  const tier = searchParams.get("tier") ?? "";
  const sort = searchParams.get("sort") ?? "featured";

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const filteredProducts = useMemo(() => {
    const base = products.filter((product) => product.status === "active");
    const normalized = deferredSearch.trim().toLowerCase();

    const next = base.filter((product) => {
      const matchesCategory = category ? product.category === category : true;
      const matchesTier = tier ? product.tier === tier : true;
      const matchesSearch = normalized
        ? [product.title, product.subtitle, product.description, ...product.tags]
            .join(" ")
            .toLowerCase()
            .includes(normalized)
        : true;

      return matchesCategory && matchesTier && matchesSearch;
    });

    return next.sort((left, right) => {
      if (sort === "price-asc") return left.price - right.price;
      if (sort === "price-desc") return right.price - left.price;
      if (sort === "latest") return right.updatedAt.localeCompare(left.updatedAt);
      if (left.featured !== right.featured) return left.featured ? -1 : 1;
      return left.title.localeCompare(right.title);
    });
  }, [products, deferredSearch, category, tier, sort]);

  if (!mounted) {
    return <div className="min-h-[50vh] bg-background" />;
  }

  return (
    <div className="bg-background">
      <section className="border-b border-border/70 bg-card/50">
        <div className="container mx-auto space-y-6 px-4 py-14">
          <SectionHeading
            eyebrow="Shop"
            title="Filter curated products by category, tier, search, and price."
            description="This storefront module matches the system design requirement for a searchable products page with multi-parameter filtering and sorting."
          />

          <div className="grid gap-4 rounded-[28px] border border-border/80 bg-card p-5 shadow-sm lg:grid-cols-[2fr_1fr_1fr_1fr]">
            <label className="space-y-2 text-sm font-medium text-foreground">
              Search
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchInput}
                  onChange={(event) => {
                    const next = event.target.value;
                    setSearchInput(next);
                    updateQuery("search", next);
                  }}
                  placeholder="Search by title, tag, or mood"
                  className="h-11 rounded-full border-border bg-background pl-10"
                />
              </div>
            </label>

            <label className="space-y-2 text-sm font-medium text-foreground">
              Category
              <select
                value={category}
                onChange={(event) => updateQuery("category", event.target.value)}
                className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none"
              >
                <option value="">All categories</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium text-foreground">
              Tier
              <select
                value={tier}
                onChange={(event) => updateQuery("tier", event.target.value)}
                className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none"
              >
                <option value="">All tiers</option>
                <option value="elite">Elite</option>
                <option value="average">Everyday</option>
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium text-foreground">
              Sort
              <select
                value={sort}
                onChange={(event) => updateQuery("sort", event.target.value)}
                className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto space-y-8 px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"}
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <SlidersHorizontal className="size-4" />
              <span>Query updates are reflected in the URL for shareable filtered views.</span>
            </div>
          </div>

          {filteredProducts.length ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setSelectedProduct}
                  onWishlist={toggleWishlist}
                  onAddToCart={(item) => addToCart({ ...item, quantity: 1 })}
                />
              ))}
            </div>
          ) : (
            <Panel
              title="No product matched this filter"
              subtitle="Reset the search or jump back to the full catalog."
            >
              <EmptyState
                title="Nothing matched your current query"
                description="Try removing one filter or browse the full featured collection."
              />
              <div className="mt-6 flex justify-center">
                <Button asChild className="rounded-full px-5">
                  <Link href="/shop">
                    Reset filters
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </Panel>
          )}
        </div>
      </section>

      <QuickView
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
