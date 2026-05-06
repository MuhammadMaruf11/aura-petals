"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, ShieldCheck, ShoppingCart, Sparkles } from "lucide-react";

import { ProductCard } from "@/components/common/ProductCard";
import { QuickView } from "@/components/common/Modals/QuickView";
import { Panel, SectionHeading } from "@/components/platform/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatPrice, tierLabels } from "@/lib/platform";
import { useMounted } from "@/hooks/use-mounted";
import { usePlatformStore } from "@/store/usePlatformStore";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";

export default function ProductDetailPageClient({ slug }: { slug: string }) {
  const mounted = useMounted();
  const products = usePlatformStore((state) => state.products);
  const { addToCart } = useCartStore();
  const { toggleWishlist } = useWishlistStore();

  const product = products.find((item) => item.slug === slug);
  const [activeImage, setActiveImage] = useState(product?.image_url ?? "");
  const [selectedProduct, setSelectedProduct] = useState<(typeof products)[number] | null>(null);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(
        (item) =>
          item.id !== product.id &&
          item.status === "active" &&
          (item.category === product.category || item.tier === product.tier)
      )
      .slice(0, 4);
  }, [product, products]);

  if (!mounted) {
    return <div className="min-h-[50vh] bg-background" />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24">
        <Panel title="Product not found" subtitle="The requested product may have been removed or renamed.">
          <Button asChild className="rounded-full px-5">
            <Link href="/shop">Return to shop</Link>
          </Button>
        </Panel>
      </div>
    );
  }

  const currentImage = activeImage || product.image_url;

  return (
    <div className="bg-background">
      <div className="container mx-auto space-y-16 px-4 py-12">
        <Button asChild variant="ghost" className="rounded-full px-4 text-sm">
          <Link href="/shop">
            <ArrowLeft />
            Back to shop
          </Link>
        </Button>

        <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-[32px] border border-border/70 bg-card bg-cover bg-center"
              style={{ backgroundImage: `url(${currentImage})` }}
            />
            <div className="grid grid-cols-3 gap-3">
              {product.images.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={`relative aspect-[4/5] overflow-hidden rounded-[22px] border transition ${
                    currentImage === image
                      ? "border-primary ring-2 ring-primary/15"
                      : "border-border/70"
                  }`}
                  style={{ backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <SectionHeading
              eyebrow={tierLabels[product.tier]}
              title={product.title}
              description={product.subtitle}
            />

            <div className="flex flex-wrap items-center gap-3">
              <p className="font-heading text-4xl text-primary">{formatPrice(product.price)}</p>
              {product.compareAtPrice ? (
                <p className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice)}
                </p>
              ) : null}
              <Badge variant="secondary">{product.category}</Badge>
              <Badge variant={product.featured ? "default" : "outline"}>
                {product.featured ? "Featured" : "Limited"}
              </Badge>
            </div>

            <p className="max-w-2xl text-base leading-7 text-muted-foreground">{product.description}</p>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] border border-border/80 bg-card p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Stock</p>
                <p className="mt-2 font-heading text-3xl text-primary">{product.stock}</p>
              </div>
              <div className="rounded-[24px] border border-border/80 bg-card p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Updated</p>
                <p className="mt-2 text-sm font-medium text-foreground">{formatDate(product.updatedAt)}</p>
              </div>
              <div className="rounded-[24px] border border-border/80 bg-card p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Video policy</p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {product.videoUrl ? "Social only" : "Image-only product"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                className="h-12 rounded-full px-6"
                onClick={() => addToCart({ ...product, quantity: 1 })}
              >
                <ShoppingCart />
                Add to cart
              </Button>
              <Button
                variant="secondary"
                className="h-12 rounded-full px-6"
                onClick={() => toggleWishlist(product)}
              >
                <Heart />
                Save to wishlist
              </Button>
            </div>

            <Panel title="Specifications" subtitle="Structured product information for the detail page requirement.">
              <div className="grid gap-4 sm:grid-cols-2">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="rounded-3xl bg-muted/55 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      {spec.label}
                    </p>
                    <p className="mt-2 text-sm text-foreground">{spec.value}</p>
                  </div>
                ))}
              </div>
            </Panel>

            {product.videoUrl ? (
              <Panel
                title="Video handling rule"
                subtitle="The product has a short-form video asset, but the storefront does not render it."
                badge="Make.com policy"
              >
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <ShieldCheck className="mt-0.5 size-4 text-secondary" />
                  <p>
                    This URL is reserved for Facebook, Instagram, YouTube, TikTok, and LinkedIn distribution only.
                    The website intentionally stays image-first per system design.
                  </p>
                </div>
              </Panel>
            ) : null}
          </div>
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow="Related Picks"
            title="Products from the same collection path"
            description="Recommended items use the same catalog state as the storefront grid."
          />

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {relatedProducts.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                onQuickView={setSelectedProduct}
                onWishlist={toggleWishlist}
                onAddToCart={(next) => addToCart({ ...next, quantity: 1 })}
              />
            ))}
          </div>
        </section>

        <section className="rounded-[36px] border border-border/70 bg-card/70 p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary">Custom Orders</p>
              <h2 className="font-heading text-3xl text-primary">Need a branded or bulk variation of this product?</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Contact the SME team directly. Your enquiry will flow into the admin message board for follow-up.
              </p>
            </div>
            <Button asChild variant="secondary" className="h-12 rounded-full px-6">
              <Link href="/contact">
                Request custom quote
                <Sparkles />
              </Link>
            </Button>
          </div>
        </section>
      </div>

      <QuickView
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
