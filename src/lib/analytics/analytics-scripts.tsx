"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Fires a page_view/PageView on every client-side route change. gtag.js
 * and the Pixel snippet each send one page view automatically on their own
 * initial load — but Next.js App Router navigations don't reload the page,
 * so without this, only that very first page view would ever be recorded
 * for a visitor who browses multiple pages in one visit.
 */
function RouteChangeTracker({ hasGa4, hasPixel }: { hasGa4: boolean; hasPixel: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = searchParams.size > 0 ? `${pathname}?${searchParams.toString()}` : pathname;
    if (hasGa4 && window.gtag) {
      window.gtag("event", "page_view", { page_path: url });
    }
    if (hasPixel && window.fbq) {
      window.fbq("track", "PageView");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return null;
}

/**
 * Renders tracking scripts for whichever IDs are configured. The IDs are
 * passed in as props (resolved server-side in the root layout from
 * StoreSettings, falling back to the NEXT_PUBLIC_* env vars) rather than
 * read from `process.env` here — this component only ever does script
 * injection, never its own data fetching, so admin-configured tracking IDs
 * actually take effect without a rebuild.
 *
 * The `trackingId` field doubles as either a GA4 Measurement ID
 * ("G-XXXXXXXXXX", loaded directly via gtag.js) or a GTM container ID
 * ("GTM-XXXXXXX", loaded via the standard GTM snippet) — detected from its
 * prefix, so the one existing admin field covers both without adding a
 * second column or a second admin field for what is, for this project's
 * purposes, the same "paste an analytics ID" slot.
 */
export function AnalyticsScripts({
  trackingId,
  pixelId,
}: {
  trackingId?: string | null;
  pixelId?: string | null;
}) {
  const isGa4 = trackingId?.startsWith("G-");
  const isGtm = trackingId?.startsWith("GTM-");

  return (
    <>
      {trackingId && isGa4 && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${trackingId}');
            `}
          </Script>
        </>
      )}

      {trackingId && isGtm && (
        <>
          <Script id="gtm-init" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${trackingId}');
            `}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${trackingId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="gtm"
            />
          </noscript>
        </>
      )}

      {pixelId && (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {(isGa4 || pixelId) && (
        <Suspense fallback={null}>
          <RouteChangeTracker hasGa4={Boolean(isGa4)} hasPixel={Boolean(pixelId)} />
        </Suspense>
      )}
    </>
  );
}
