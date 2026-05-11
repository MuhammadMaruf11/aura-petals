import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import "./custom.css";
import FramerProvider from "@/components/providers/framer-provider";
import Header from "@/components/common/Header";
import ReactQueryProvider from "@/components/providers/react-query-provider";

// Fonts setup
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
  description: "Explore premium craft petals, cosmetics, and jewelry for average and elite customers.",
  openGraph: {
    title: "Aura & Petals",
    description: "Premium gifts for your loved ones.",
    images: ["/logo.png"], // Your logo path
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-background font-body antialiased">
        <ReactQueryProvider>
          <Header />

          <main className="grow">
            <FramerProvider>
              {children}
            </FramerProvider>
          </main>

          {/* Footer - will be made dynamic later */}
          <footer className="border-t bg-white py-8">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Aura & Petals. All rights reserved.
            </div>
          </footer></ReactQueryProvider>
      </body>
    </html>
  );
}