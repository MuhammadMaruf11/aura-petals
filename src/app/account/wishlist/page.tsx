import type { Metadata } from "next";
import { getWishlistWithProducts } from "@/server/services/wishlist.service";
import { WishlistItemCard } from "@/features/wishlist/wishlist-item-card";
import { EmptyState } from "@/components/shared/empty-state";
import { serializeDecimals } from "@/lib/serialize";

export const metadata: Metadata = { title: "My Wishlist" };

export default async function WishlistPage() {
  const items = await getWishlistWithProducts();

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl">Wishlist</h1>
      {items.length === 0 ? (
        <EmptyState
          title="Your wishlist is empty"
          description="Save pieces you love to find them here later."
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const serialized = serializeDecimals(item.product);
            const product = {
              ...serialized,
              price: Number(serialized.price),
              compareAtPrice: serialized.compareAtPrice
                ? Number(serialized.compareAtPrice)
                : null,
            };

            return <WishlistItemCard key={item.id} product={product} />;
          })}
        </div>
      )}
    </div>
  );
}
