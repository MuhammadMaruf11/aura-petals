import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";

import AppShell from "@/components/providers/app-shell";
import ProductsProvider from "@/components/providers/products-provider";
import ReactQueryProvider from "@/components/providers/react-query-provider";
import TenantThemeProvider from "@/components/providers/tenant-theme-provider";

import "./custom.css";
import "./globals.css";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});

const bodyFont = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Aura & Petals | Timeless Gifts & Blooms",
  description:
    "Multi-tenant gifting storefront and SaaS platform for premium florals, curated products, admin control, and automation workflows.",
  metadataBase: new URL("https://aura-petals.vercel.app"),
  openGraph: {
    title: "Aura & Petals",
    description: "Premium gifts, SME operations, and SaaS subscription management in one experience.",
    images: ["/images/logo/main-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable} scroll-smooth`}>
      <body className="flex min-h-screen flex-col bg-background font-body antialiased">
        <ReactQueryProvider>
          <ProductsProvider />
          <TenantThemeProvider />
          <AppShell>{children}</AppShell>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
