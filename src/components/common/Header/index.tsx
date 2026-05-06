"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Menu, Search, ShoppingCart, User } from "lucide-react";
import { useRouter } from "next/navigation";

import { CartDrawer } from "@/components/common/Drawers/CartDrawer";
import { MobileMenu } from "@/components/common/Drawers/MobileMenu";
import { BottomNav } from "@/components/common/Header/bottom-nav";
import { WishlistModal } from "@/components/common/Modals/WishlistModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMounted } from "@/hooks/use-mounted";
import { formatPrice } from "@/lib/platform";
import { useCartStore } from "@/store/useCartStore";
import { usePlatformStore } from "@/store/usePlatformStore";
import { useWishlistStore } from "@/store/useWishlistStore";

const Header = () => {
  const router = useRouter();
  const mounted = useMounted();
  const branding = usePlatformStore((state) => state.branding);
  const auth = usePlatformStore((state) => state.auth);
  const { cart, getTotalPrice } = useCartStore();
  const { wishlist } = useWishlistStore();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop All", href: "/shop" },
    { name: "Elite Items", href: "/shop?tier=elite" },
    { name: "Budget Friendly", href: "/shop?tier=average" },
    { name: "Custom Crafts", href: "/shop?category=crafts" },
  ];

  if (!mounted) {
    return null;
  }

  const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearchSubmit = () => {
    const query = searchTerm.trim();
    router.push(query ? `/shop?search=${encodeURIComponent(query)}` : "/shop");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="hidden border-b bg-muted/30 md:block">
          <div className="container mx-auto flex h-12 items-center justify-between gap-6 px-4">
            <div className="w-4/12 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                Special Offer: 20% OFF on all Elite Crafts this week!
              </span>
            </div>

            <div className="relative w-6/12">
              <Input
                type="text"
                value={searchTerm}
                placeholder="Search for timeless gifts..."
                className="h-8 bg-white pl-8 text-[11px] focus-visible:ring-primary"
                onChange={(event) => setSearchTerm(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearchSubmit();
                  }
                }}
              />
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>

            <div className="flex w-2/12 items-center justify-end gap-4">
              <Link
                href={auth.isAuthenticated ? "/profile" : "/login"}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all hover:text-primary"
              >
                <User size={14} /> {auth.isAuthenticated ? "My Profile" : "Login / Register"}
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto flex h-20 items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMenuOpen(true)} className="p-2 text-primary md:hidden">
              <Menu size={24} />
            </button>
            <Link href="/" className="shrink-0">
              <Image src={branding.logoUrl} alt={branding.businessName} width={250} height={60} />
            </Link>
          </div>

          <nav className="hidden items-center gap-10 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground md:hidden" onClick={handleSearchSubmit}>
              <Search size={20} />
            </Button>

            <Button variant="ghost" size="icon" className="relative hidden md:flex" onClick={() => setIsWishlistOpen(true)}>
              <Heart size={20} />
              {wishlist.length > 0 ? (
                <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-secondary text-[8px] font-bold text-white">
                  {wishlist.length}
                </span>
              ) : null}
            </Button>

            <Button className="flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-white" onClick={() => setIsCartOpen(true)}>
              <div className="relative">
                <ShoppingCart size={18} />
                {cartQuantity > 0 ? (
                  <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full border-2 border-primary bg-secondary text-[8px] font-bold text-white">
                    {cartQuantity}
                  </span>
                ) : null}
              </div>
              <span className="hidden text-sm font-bold sm:inline">{formatPrice(getTotalPrice())}</span>
            </Button>
          </div>
        </div>
      </header>

      <BottomNav onWishlistOpen={() => setIsWishlistOpen(true)} onCartOpen={() => setIsCartOpen(true)} />
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} navLinks={navLinks} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WishlistModal isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </>
  );
};

export default Header;
