import Link from "next/link";
import type { ProductCardData } from "@/server/services/product.service";
import { ProductCard } from "@/features/products/product-card";

export function ProductSection({
  title,
  subtitle,
  viewAllHref,
  products,
}: {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  products: ProductCardData[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="container-boutique py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-heading text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-sm text-primary hover:underline">
            View all
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
