import Link from "next/link";
import type { getActiveBanners } from "@/server/services/product.service";

type Banner = Awaited<ReturnType<typeof getActiveBanners>>[number];

export function PromoStrip({ banners }: { banners: Banner[] }) {
  const banner = banners[0];
  if (!banner) return null;

  const content = (
    <p className="truncate">
      <span className="font-medium">{banner.title}</span>
      {banner.subtitle && <span className="text-primary-foreground/80"> — {banner.subtitle}</span>}
    </p>
  );

  return (
    <div className="bg-primary px-4 py-2 text-center text-xs text-primary-foreground sm:text-sm">
      {banner.ctaHref ? (
        <Link href={banner.ctaHref} className="hover:underline">
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  );
}
