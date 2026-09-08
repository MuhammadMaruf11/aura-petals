import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getRelatedProducts,
  getFrequentlyBoughtTogether,
  getCategoryBreadcrumb,
} from "@/server/services/product.service";
import { ProductGallery } from "@/features/products/product-gallery";
import { AddToCartForm } from "@/features/products/add-to-cart-form";
import { ProductSection } from "@/features/home/product-section";
import { RecordAndShowRecentlyViewed } from "@/features/products/recently-viewed-section";
import { TrackProductView } from "@/features/products/track-product-view";
import { WishlistButton } from "@/features/wishlist/wishlist-button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { serializeDecimals } from "@/lib/serialize";
import { stripHtml } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { getYouTubeGalleryEmbedUrl } from "@/utils/GetYoutubeUrl";

const badgeLabels: Record<string, string> = {
  NEW: "New",
  BEST_SELLER: "Best Seller",
  LIMITED_EDITION: "Limited Edition",
  HANDMADE: "Handmade",
  PERSONALIZED: "Personalized",
  SALE: "Sale",
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description:
      product.shortDescription ?? stripHtml(product.description).slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.shortDescription ?? undefined,
      images: product.images[0] ? [{ url: product.images[0].url }] : undefined,
    },
    alternates: { canonical: `${siteConfig.url}/products/${product.slug}` },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.id, product.categoryId);
  const frequentlyBoughtTogether = await getFrequentlyBoughtTogether(
    product.id,
    product.categoryId,
  );
  const breadcrumb = product.categoryId
    ? await getCategoryBreadcrumb(product.categoryId)
    : [];
  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        product.reviews.length
      : null;

  const totalStock =
    product.type === "VARIANT"
      ? product.variants.reduce((sum, v) => sum + v.stock, 0)
      : product.stock;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription ?? undefined,
    image: product.images.map((i) => i.url),
    sku: product.sku ?? undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: Number(product.price),
      availability:
        totalStock > 0 || product.allowBackorder
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${siteConfig.url}/products/${product.slug}`,
    },
    ...(product.reviews.length > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: (
              product.reviews.reduce((sum, r) => sum + r.rating, 0) /
              product.reviews.length
            ).toFixed(1),
            reviewCount: product.reviews.length,
          },
        }
      : {}),
  };

  const embedVideoUrl = getYouTubeGalleryEmbedUrl(product.videoUrl);

  return (
    <div className="container-boutique py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TrackProductView
        id={product.id}
        name={product.name}
        price={Number(product.price)}
        currency={product.currency}
      />

      {breadcrumb.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Link href="/shop" className="hover:text-primary">
            Shop
          </Link>
          {breadcrumb.map((crumb) => (
            <span key={crumb.id} className="flex items-center gap-1.5">
              <span>/</span>
              <Link href={`/shop/${crumb.slug}`} className="hover:text-primary">
                {crumb.name}
              </Link>
            </span>
          ))}
        </nav>
      )}

      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <ProductGallery
          images={product.images}
          productName={product.name}
          videoUrl={product.videoUrl}
        />

        <div className="lg:sticky lg:top-24">
          <div className="flex items-start justify-between gap-4">
            <div>
              {product.category && (
                <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                  {product.category.name}
                </p>
              )}
              <h1 className="font-heading text-3xl leading-tight sm:text-4xl">
                {product.name}
              </h1>
            </div>
            <WishlistButton productId={product.id} />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {product.badges.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {product.badges.map((badge) => (
                  <Badge
                    key={badge}
                    variant={badge === "SALE" ? "destructive" : "secondary"}
                  >
                    {badgeLabels[badge] ?? badge}
                  </Badge>
                ))}
              </div>
            )}
            {averageRating !== null && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="size-4 fill-primary text-primary" />
                {averageRating.toFixed(1)}
                <span>({product.reviews.length})</span>
              </div>
            )}
          </div>

          {product.shortDescription && (
            <p className="mt-4 text-muted-foreground">
              {product.shortDescription}
            </p>
          )}

          <div className="mt-6 border-t border-border/70 pt-6">
            <AddToCartForm product={serializeDecimals(product)} />
          </div>

          {product.type === "BUNDLE" && product.bundleItems.length > 0 && (
            <div className="mt-8 space-y-2 rounded-2xl border border-border/70 p-4">
              <p className="text-sm font-medium">This gift box includes</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {product.bundleItems.map((item) => (
                  <li key={item.id}>
                    {item.quantity}× {item.component.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.sku && (
            <p className="mt-6 text-xs text-muted-foreground">
              SKU: {product.sku}
            </p>
          )}
        </div>
      </div>

      <Tabs defaultValue="description" className="mt-16">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          {embedVideoUrl && (
            <TabsTrigger value="video">Product Video</TabsTrigger>
          )}
          <TabsTrigger value="shipping">Shipping &amp; Returns</TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews ({product.reviews.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="description"
          className="mt-6 max-w-2xl text-sm leading-relaxed text-foreground/90 [&_h3]:font-heading [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_a]:text-primary [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
        {embedVideoUrl && (
          <TabsContent value="video" className="mt-6">
            <div className="relative aspect-video w-full max-w-2xl overflow-hidden rounded-2xl border border-border">
              <iframe
                src={embedVideoUrl}
                title={`${product.name} Video`}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </TabsContent>
        )}
        <TabsContent
          value="shipping"
          className="mt-6 max-w-2xl text-sm leading-relaxed text-foreground/90"
        >
          <p>
            Each piece is made to order and ships within 3–5 business days.
            Since every item is handmade, small variations in color and texture
            are part of its charm.
          </p>
          <p className="mt-3">
            Not the right fit? Unused items can be returned within 14 days of
            delivery. Personalized items are final sale unless damaged in
            transit.
          </p>
        </TabsContent>
        <TabsContent value="reviews" className="mt-6 max-w-2xl space-y-4">
          {product.reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No reviews yet — be the first to share your thoughts.
            </p>
          ) : (
            product.reviews.map((review) => (
              <div key={review.id} className="border-b border-border/60 pb-4">
                <p className="text-sm font-medium">{review.user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {review.rating} / 5
                </p>
                {review.body && <p className="mt-1 text-sm">{review.body}</p>}
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>

      <ProductSection
        title="Frequently bought together"
        products={frequentlyBoughtTogether}
      />
      <ProductSection title="You may also like" products={related} />
      <RecordAndShowRecentlyViewed productId={product.id} />
    </div>
  );
}
