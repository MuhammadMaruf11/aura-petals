import Link from "next/link";
import Image from "next/image";
import { Heart, Search, ShoppingBag, User, ChevronDown } from "lucide-react";
import { getSession } from "@/lib/auth/current-user";
import { Button } from "@/components/ui/button";
import { CartSheetTrigger } from "@/features/cart/cart-sheet-trigger";
import { MobileNav } from "@/components/layout/mobile-nav";
import { getStoreSettings } from "@/server/services/admin-settings.service";
import { adminListCategories } from "@/server/services/admin-category.service";
import { siteConfig } from "@/config/site";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";

interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  depth: number;
  isActive: boolean;
  parentId: string | null;
  children?: CategoryNode[];
}

export async function Navbar() {
  const [session, storeSettings, categories] = await Promise.all([
    getSession(),
    getStoreSettings(),
    adminListCategories(),
  ]);

  const storeName = storeSettings?.storeName || siteConfig.name;
  const logoUrl = storeSettings?.logoUrl;

  const activeCategories = categories.filter((cat) => cat.isActive);

  // Build hierarchical tree from flat categories list
  const buildCategoryTree = (cats: typeof activeCategories) => {
    const map = new Map<string, CategoryNode & { children: CategoryNode[] }>();
    const roots: (CategoryNode & { children: CategoryNode[] })[] = [];

    cats.forEach((cat) => {
      map.set(cat.id, { ...cat, children: [] });
    });

    cats.forEach((cat) => {
      const node = map.get(cat.id)!;
      if (cat.parentId && map.has(cat.parentId)) {
        map.get(cat.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  const categoryTree = buildCategoryTree(activeCategories);

  // Recursive renderer for submenus
  const renderCategoryMenuItems = (
    items: (CategoryNode & { children?: CategoryNode[] })[],
  ) => {
    return items.map((cat) => {
      const hasChildren = cat.children && cat.children.length > 0;

      if (hasChildren) {
        return (
          <DropdownMenuSub key={cat.id}>
            <DropdownMenuSubTrigger className="w-full cursor-pointer">
              <span>{cat.name}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="w-48 bg-white">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/shop/${cat.slug}`}
                    className="w-full cursor-pointer font-medium text-primary"
                  >
                    View All {cat.name}
                  </Link>
                </DropdownMenuItem>
                {renderCategoryMenuItems(cat.children!)}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        );
      }

      return (
        <DropdownMenuItem key={cat.id} asChild>
          <Link href={`/shop/${cat.slug}`} className="w-full cursor-pointer">
            {cat.name}
          </Link>
        </DropdownMenuItem>
      );
    });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-white backdrop-blur print:hidden">
      <div className="container-boutique flex h-16 items-center justify-between gap-2 sm:h-20 sm:gap-4">
        {/* Left: Mobile Drawer Trigger (Hidden on Desktop) */}
        <div className="flex items-center lg:hidden">
          <MobileNav logoUrl={logoUrl} storeName={storeName} />
        </div>

        {/* Center/Left on desktop: Logo */}
        <div className="flex items-center justify-center lg:justify-start flex-1 lg:flex-none">
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
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-6 lg:flex">
          <Link
            href="/"
            className="text-sm text-foreground/85 transition-colors hover:text-primary font-medium"
          >
            Home
          </Link>
          <Link
            href="/shop"
            className="text-sm text-foreground/85 transition-colors hover:text-primary font-medium"
          >
            Shop
          </Link>
          {/* Categories Dropdown with Nested Submenus */}
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer flex items-center gap-1 text-sm text-foreground/85 transition-colors hover:text-primary font-medium outline-none">
              Categories <ChevronDown className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 bg-white">
              <DropdownMenuItem asChild>
                <Link
                  href="/shop"
                  className="w-full cursor-pointer font-medium"
                >
                  All Categories
                </Link>
              </DropdownMenuItem>
              {renderCategoryMenuItems(categoryTree)}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            href="/about"
            className="text-sm text-foreground/85 transition-colors hover:text-primary font-medium"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm text-foreground/85 transition-colors hover:text-primary font-medium"
          >
            Contact
          </Link>
        </nav>

        {/* Right side: Desktop actions only */}
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <Button
            variant="ghost"
            size="icon"
            asChild
            aria-label="Search"
            className="inline-flex"
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
            className="hidden lg:inline-flex"
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
          <Button
            variant="ghost"
            size="icon"
            asChild
            aria-label="Account"
            className="hidden lg:inline-flex"
          >
            <Link href={session ? "/account" : "/login"}>
              <User />
            </Link>
          </Button>
          <CartSheetTrigger>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Cart"
              className="hidden lg:inline-flex"
            >
              <ShoppingBag />
            </Button>
          </CartSheetTrigger>
        </div>
      </div>
    </header>
  );
}
