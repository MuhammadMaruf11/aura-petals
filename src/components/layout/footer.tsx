import Link from "next/link";
import { AtSign, Camera } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getStoreSettings } from "@/server/services/admin-settings.service";

export async function Footer() {
  const storeSettings = await getStoreSettings();

  const storeName = storeSettings?.storeName || siteConfig.name;
  const logoUrl = storeSettings?.logoUrl;

  return (
    <footer className="border-t border-border/70 bg-sand print:hidden">
      <div className="container-boutique grid gap-10 py-16 md:grid-cols-4">
        <div className="space-y-3 md:col-span-1">
          <Link
            href="/"
            className="flex items-center font-heading text-xl tracking-tight sm:text-2xl"
          >
            {logoUrl ? (
              <Image
                src={logoUrl || siteConfig.logoUrl}
                alt={storeName}
                width={98}
                height={64}
                className="max-h-12 sm:max-h-16 w-auto object-contain"
                priority
              />
            ) : (
              <span className="truncate">{storeName}</span>
            )}
          </Link>
          <p className="text-sm text-muted-foreground">
            Handmade clay art and personalized gifts, made slowly and with care.
          </p>
          <div className="flex gap-3 pt-2">
            <Link
              href={siteConfig.links.instagram}
              aria-label="Instagram"
              className="text-muted-foreground hover:text-primary"
            >
              <Camera className="size-5" />
            </Link>
            <Link
              href={siteConfig.links.facebook}
              aria-label="Facebook"
              className="text-muted-foreground hover:text-primary"
            >
              <AtSign className="size-5" />
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">Shop</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">Help</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/account/orders" className="hover:text-primary">
                Track an order
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary">
                Contact us
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-primary">
                Our story
              </Link>
            </li>
            <li>
              <Link href="/shipping-returns" className="hover:text-primary">
                Shipping &amp; returns
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">Stay in the loop</p>
          <p className="text-sm text-muted-foreground">
            New collections, seasonal gift edits, and early access — no spam.
          </p>
          <form className="flex gap-2">
            <Input
              type="email"
              placeholder="Email address"
              className="bg-card"
            />
            <Button type="submit" variant="default">
              Join
            </Button>
          </form>
        </div>
      </div>

      <div className="border-t border-border/70 py-6">
        <p className="container-boutique text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
