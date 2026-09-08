import type { Metadata } from "next";
import { listProducts, getAllCategories, getCategoryTree } from "@/server/services/product.service";
import { ShopFilterSidebar } from "@/features/products/shop-filter-sidebar";
import { ShopResultsGrid } from "@/features/products/shop-results-grid";
import { ProductFilters } from "@/features/products/product-filters";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { serializeDecimals } from "@/lib/serialize";

type SearchParams = Record<string, string | undefined>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category?: string[] }>;
}): Promise<Metadata> {
  const { category } = await params;
  const categorySlug = category?.[0];
  if (!categorySlug) return { title: "Shop All" };

  const categories = await getAllCategories();
  const match = categories.find((c) => c.slug === categorySlug);
  return {
    title: match?.name ?? "Shop",
    description: match?.description ?? undefined,
  };
}

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ category?: string[] }>;
  searchParams: Promise<SearchParams>;
}) {
  const { category } = await params;
  const sp = await searchParams;
  const categorySlug = category?.[0];
  const badges = (sp.badges ?? "")
    .split(",")
    .filter((b): b is "NEW" | "BEST_SELLER" => b === "NEW" || b === "BEST_SELLER");

  const [{ items, total, page, pageCount }, categories, categoryTree] = await Promise.all([
    listProducts({
      categorySlug,
      search: sp.q,
      sort: (sp.sort as "newest" | "price-asc" | "price-desc" | "best-selling") ?? "newest",
      inStockOnly: sp.inStock === "true",
      isFeatured: sp.featured === "true",
      badges: badges.length > 0 ? badges : undefined,
      minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
      maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
      page: sp.page ? Number(sp.page) : 1,
    }),
    getAllCategories(),
    getCategoryTree(),
  ]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);
  const title = activeCategory?.name ?? "Shop All";
  const basePath = categorySlug ? `/shop/${categorySlug}` : "/shop";

  return (
    <div className="container-boutique py-12">
      <div className="mb-8">
        <h1 className="font-heading text-3xl">{title}</h1>
        {activeCategory?.description && (
          <p className="mt-2 max-w-2xl text-muted-foreground">{activeCategory.description}</p>
        )}
      </div>

      <div className="flex flex-col gap-10 lg:flex-row">
        <ShopFilterSidebar categoryTree={categoryTree} activeCategorySlug={categorySlug} />

        <div className="min-w-0 flex-1">
          <ProductFilters total={total} />

          {items.length === 0 ? (
            <EmptyState
              title="No products found"
              description="Try different filters or check back soon — new pieces are added often."
            />
          ) : (
            <ShopResultsGrid items={serializeDecimals(items)} />
          )}

          <Pagination page={page} pageCount={pageCount} basePath={basePath} searchParams={sp} />
        </div>
      </div>
    </div>
  );
}
