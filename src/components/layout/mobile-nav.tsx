"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import Image from "next/image";

export function MobileNav({
  logoUrl,
  storeName,
}: {
  logoUrl?: string | null;
  storeName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-[85vw] max-w-72 flex-col">
        <SheetHeader>
          <SheetTitle className="font-heading text-left">
            <Link
              href="/"
              className="flex items-center font-heading text-xl tracking-tight sm:text-2xl"
            >
              {logoUrl ? (
                <Image
                  src={logoUrl || siteConfig.logoUrl}
                  alt={storeName}
                  width={80}
                  height={30}
                  className=" object-contain"
                  priority
                />
              ) : (
                <span className="truncate">{storeName}</span>
              )}
            </Link>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-1 mt-4">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-medium hover:bg-secondary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
