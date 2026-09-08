import type { Metadata } from "next";
import { listProducts } from "@/server/services/product.service";
import { ProductCard } from "@/features/products/product-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { TrackSearch } from "@/features/products/track-search";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const query = sp.q ?? "";

  const { items, total, page, pageCount } = query
    ? await listProducts({ search: query, page: sp.page ? Number(sp.page) : 1 })
    : { items: [], total: 0, page: 1, pageCount: 0 };

  return (
    <div className="container-boutique py-12">
      {query && <TrackSearch query={query} />}
      <form className="relative mx-auto mb-10 max-w-xl">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="q"
          defaultValue={query}
          placeholder="Search for handmade gifts…"
          className="pl-11"
        />
      </form>

      {!query ? (
        <EmptyState title="Search our collection" description="Try “clay vase”, “gift box”, or “personalized”." />
      ) : items.length === 0 ? (
        <EmptyState
          title={`No results for "${query}"`}
          description="Try a broader search term, or browse categories instead."
        />
      ) : (
        <>
          <p className="mb-6 text-sm text-muted-foreground">
            {total} result{total === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination page={page} pageCount={pageCount} basePath="/search" searchParams={sp} />
        </>
      )}
    </div>
  );
}
