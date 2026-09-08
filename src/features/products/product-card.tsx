import Image from "next/image";
import Link from "next/link";
import type { ProductCardData } from "@/server/services/product.service";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { WishlistButton } from "@/features/wishlist/wishlist-button";
import { CardAddToCartButton } from "@/features/products/card-add-to-cart-button";
import { QuickViewButton } from "@/features/products/quick-view-button";
import { isOutOfStock } from "@/lib/stock";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { getYouTubeCardEmbedUrl } from "@/utils/GetYoutubeUrl";

const badgeLabels: Record<string, string> = {
  NEW: "New",
  BEST_SELLER: "Best Seller",
  LIMITED_EDITION: "Limited Edition",
  HANDMADE: "Handmade",
  PERSONALIZED: "Personalized",
  SALE: "Sale",
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const image = product.images[0]?.url;
  const hoverImage = product.images[1]?.url;
  const videoEmbedUrl = getYouTubeCardEmbedUrl(product.videoUrl);

  const displayPrice =
    product.variants[0] && product.type === "VARIANT"
      ? Number(product.variants[0].price)
      : Number(product.price);
  const isOnSale =
    product.compareAtPrice &&
    Number(product.compareAtPrice) > Number(product.price);
  const href = `/products/${product.slug}`;

  const outOfStock =
    product.type === "STANDARD" &&
    isOutOfStock({
      stock: product.stock,
      allowBackorder: product.allowBackorder,
      trackInventory: product.trackInventory,
    });

  return (
    <div className="group relative flex flex-col">
      <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-secondary">
        <Link
          href={href}
          className="absolute inset-0 z-0"
          aria-label={product.name}
        >
          {/* Default Image */}
          {image && (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className={`object-cover transition-opacity duration-500 group-hover:opacity-0 ${
                outOfStock ? "grayscale-40 opacity-70" : ""
              }`}
            />
          )}

          {/* Priority 1: Video on Hover */}
          {!outOfStock && videoEmbedUrl ? (
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <iframe
                src={videoEmbedUrl}
                title={product.name}
                className="h-full w-full pointer-events-none object-cover scale-125"
                allow="autoplay; encrypted-media"
              />
            </div>
          ) : (
            /* Priority 2: Hover Image (if no video) */
            hoverImage &&
            !outOfStock && (
              <Image
                src={hoverImage}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )
          )}
        </Link>

        {/* Video Badge (Shows small Play icon when video is available) */}
        {!outOfStock && videoEmbedUrl && (
          <div className="pointer-events-none absolute right-2.5 bottom-2.5 z-10 flex size-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-opacity group-hover:opacity-0">
            <Play className="size-3.5 fill-current ml-0.5" />
          </div>
        )}

        {/* Badges / Out of Stock */}
        {outOfStock ? (
          <div className="pointer-events-none absolute left-2.5 top-2.5 z-10 sm:left-3 sm:top-3">
            <Badge variant="secondary">Out of Stock</Badge>
          </div>
        ) : (
          product.badges.length > 0 && (
            <div className="pointer-events-none absolute left-2.5 top-2.5 z-10 flex flex-col gap-1.5 sm:left-3 sm:top-3">
              {product.badges.slice(0, 2).map((badge) => (
                <Badge
                  key={badge}
                  variant={badge === "SALE" ? "destructive" : "secondary"}
                >
                  {badgeLabels[badge] ?? badge}
                </Badge>
              ))}
            </div>
          )
        )}

        {/* Wishlist Button */}
        <div className="absolute right-2.5 top-2.5 z-10 opacity-100 transition-opacity sm:right-3 sm:top-3 lg:opacity-0 lg:group-hover:opacity-100">
          <WishlistButton productId={product.id} />
        </div>

        {/* Action Button */}
        <div className="pointer-events-none absolute inset-x-2.5 bottom-2.5 z-10 opacity-100 transition-opacity sm:inset-x-3 sm:bottom-3 lg:opacity-0 lg:group-hover:opacity-100">
          <div className="pointer-events-auto">
            {product.type === "STANDARD" ? (
              outOfStock ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled
                  className="w-full shadow-sm"
                >
                  Out of Stock
                </Button>
              ) : (
                <CardAddToCartButton
                  productId={product.id}
                  name={product.name}
                  price={displayPrice}
                  currency={product.currency}
                />
              )
            ) : (
              <QuickViewButton productId={product.id} />
            )}
          </div>
        </div>
      </div>

      <Link href={href} className="mt-3 space-y-1">
        {product.category && (
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {product.category.name}
          </p>
        )}
        <h3 className="font-heading text-base leading-tight line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium">
            {formatPrice(displayPrice)}
          </span>
          {isOnSale && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(Number(product.compareAtPrice))}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="aspect-4/5 animate-pulse rounded-2xl bg-secondary" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-secondary" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-secondary" />
    </div>
  );
}
