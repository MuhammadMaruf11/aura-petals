"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";

export function MobileNav({ isSignedIn }: { isSignedIn: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-[85vw] max-w-72 flex-col">
        <SheetHeader>
          <SheetTitle className="font-heading">{siteConfig.name}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-1">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2.5 text-base hover:bg-secondary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Separator className="my-2" />

        {/* Search and account links live here on small screens, where the
            navbar hides the standalone icon buttons to avoid overflow. */}
        <nav className="flex flex-col gap-1 px-1 sm:hidden">
          <Link
            href="/search"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-base hover:bg-secondary"
          >
            <Search className="size-4" /> Search
          </Link>
          <Link
            href={isSignedIn ? "/account/wishlist" : "/login?redirect=/account/wishlist"}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-base hover:bg-secondary"
          >
            <Heart className="size-4" /> Wishlist
          </Link>
          <Link
            href={isSignedIn ? "/account" : "/login"}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-base hover:bg-secondary"
          >
            <User className="size-4" /> {isSignedIn ? "My Account" : "Sign In"}
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
