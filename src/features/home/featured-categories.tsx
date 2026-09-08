import Image from "next/image";
import Link from "next/link";
import type { Category } from "@prisma/client";

export function FeaturedCategories({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="container-boutique py-16">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="font-heading text-3xl">Shop by category</h2>
        <Link href="/shop" className="text-sm text-primary hover:underline">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/shop/${category.slug}`}
            className="group flex flex-col items-center gap-3 text-center"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-secondary">
              {category.image && (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="200px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </div>
            <span className="text-sm font-medium">{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
