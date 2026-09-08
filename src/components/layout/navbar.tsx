import Link from "next/link";
import Image from "next/image";
import { Heart, Search, ShoppingBag, User } from "lucide-react";
import { getSession } from "@/lib/auth/current-user";
import { Button } from "@/components/ui/button";
import { CartSheetTrigger } from "@/features/cart/cart-sheet-trigger";
import { MobileNav } from "@/components/layout/mobile-nav";
import { getStoreSettings } from "@/server/services/admin-settings.service";
import { siteConfig } from "@/config/site";

export async function Navbar() {
  const [session, storeSettings] = await Promise.all([
    getSession(),
    getStoreSettings(),
  ]);

  const storeName = storeSettings?.storeName || siteConfig.name;
  const logoUrl = storeSettings?.logoUrl;

  console.log('logoUrl',logoUrl)

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-white backdrop-blur print:hidden">
      <div className="container-boutique flex h-16 items-center justify-between gap-2 sm:h-20 sm:gap-4">
        <div className="flex min-w-0 items-center gap-1 sm:gap-2">
          <MobileNav isSignedIn={!!session} />
          <Link
            href="/"
            className="flex items-center font-heading text-xl tracking-tight sm:text-2xl"
          >
            {logoUrl ? (
              <Image
                src={logoUrl || siteConfig.logoUrl}
                alt={storeName}
                width={140}
                height={50}
                className="max-h-16 w-auto object-contain"
                priority
              />
            ) : (
              <span className="truncate">{storeName}</span>
            )}
          </Link>
        </div>

        <nav className="hidden items-center gap-8 lg:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-foreground/80 transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          {/* Search and Wishlist move into the mobile drawer below `sm` to
              avoid the navbar overflowing on narrow phones (320–375px). */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            aria-label="Search"
            className="hidden sm:inline-flex"
          >
            <Link href="/search">
              <Search />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            aria-label="Wishlist"
            className="hidden sm:inline-flex"
          >
            <Link
              href={
                session
                  ? "/account/wishlist"
                  : "/login?redirect=/account/wishlist"
              }
            >
              <Heart />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild aria-label="Account">
            <Link href={session ? "/account" : "/login"}>
              <User />
            </Link>
          </Button>
          <CartSheetTrigger>
            <Button variant="ghost" size="icon" aria-label="Cart">
              <ShoppingBag />
            </Button>
          </CartSheetTrigger>
        </div>
      </div>
    </header>
  );
}
