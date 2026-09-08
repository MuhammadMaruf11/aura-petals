import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { getActiveBanners } from "@/server/services/product.service";

type Banner = Awaited<ReturnType<typeof getActiveBanners>>[number];

export function MidPageBanner({ banners }: { banners: Banner[] }) {
  const banner = banners[0];
  if (!banner) return null;

  return (
    <section className="container-boutique py-4">
      <div className="relative overflow-hidden rounded-[2rem] bg-sand">
        <div className="relative aspect-[21/9] w-full sm:aspect-[3/1]">
          <Image
            src={banner.imageUrl}
            alt={banner.title}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-start justify-center gap-3 bg-gradient-to-r from-black/40 via-black/10 to-transparent px-8 sm:px-14">
            <h2 className="max-w-md text-balance font-heading text-2xl text-white sm:text-4xl">
              {banner.title}
            </h2>
            {banner.subtitle && (
              <p className="max-w-sm text-balance text-sm text-white/90 sm:text-base">
                {banner.subtitle}
              </p>
            )}
            {banner.ctaHref && banner.ctaLabel && (
              <Button asChild>
                <Link href={banner.ctaHref}>{banner.ctaLabel}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
