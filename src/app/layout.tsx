import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import { Providers } from "@/app/providers";
import { siteConfig } from "@/config/site";
import { AnalyticsScripts } from "@/lib/analytics/analytics-scripts";
import { getStoreSettings } from "@/server/services/admin-settings.service";
import "@/app/globals.css";
import GlobalLoader from "@/components/ui/GlobalLoader";
import PageTransition from "@/components/ui/PageTransition";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Admin-configured values win; env vars are a fallback for deployments
  const settings = await getStoreSettings();
  const trackingId = settings.gtmId || process.env.NEXT_PUBLIC_GTM_ID || null;
  const pixelId =
    settings.metaPixelId || process.env.NEXT_PUBLIC_META_PIXEL_ID || null;

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${manrope.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AnalyticsScripts trackingId={trackingId} pixelId={pixelId} />

        {/* Global Initial Loading Screen */}
        <GlobalLoader />

        <Providers>
          {/* Smooth Page Transition Wrapper */}
          <PageTransition>{children}</PageTransition>
          <Toaster richColors position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
