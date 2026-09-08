import { Hero } from "@/features/home/hero";
import { PromoStrip } from "@/features/home/promo-strip";
import { MidPageBanner } from "@/features/home/mid-page-banner";
import { FeaturedCategories } from "@/features/home/featured-categories";
import { ProductSection } from "@/features/home/product-section";
import { WhyChooseUs, Testimonials } from "@/features/home/trust-sections";
import {
  getFeaturedCategories,
  getFeaturedProducts,
  getNewArrivals,
  getGiftBundles,
  getLimitedEditionProducts,
  getActiveBanners,
} from "@/server/services/product.service";

export default async function HomePage() {
  const [
    categories,
    featured,
    newArrivals,
    bundles,
    limited,
    heroBanners,
    promoBanners,
    midPageBanners,
  ] = await Promise.all([
    getFeaturedCategories(),
    getFeaturedProducts(),
    getNewArrivals(),
    getGiftBundles(),
    getLimitedEditionProducts(),
    getActiveBanners("HERO"),
    getActiveBanners("PROMO_STRIP"),
    getActiveBanners("MID_PAGE"),
  ]);

  return (
    <>
      <PromoStrip banners={promoBanners} />
      <Hero banners={heroBanners} />
      <FeaturedCategories categories={categories} />
      <ProductSection
        title="Featured pieces"
        subtitle="A few of our favorites, chosen for you"
        viewAllHref="/shop"
        products={featured}
      />
      <ProductSection
        title="Gift boxes & combos"
        subtitle="Ready-to-give, thoughtfully paired"
        viewAllHref="/shop/gift-boxes"
        products={bundles}
      />
      <MidPageBanner banners={midPageBanners} />
      <WhyChooseUs />
      <ProductSection
        title="New arrivals"
        viewAllHref="/shop?sort=newest"
        products={newArrivals}
      />
      <ProductSection
        title="Limited edition"
        subtitle="Once they're gone, they're gone"
        viewAllHref="/shop?type=limited"
        products={limited}
      />
      <Testimonials />
    </>
  );
}
