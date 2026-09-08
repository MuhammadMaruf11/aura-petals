"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Ticket,
  Settings,
  Image as ImageIcon,
  Mail,
  LogOut,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutUser } from "@/server/actions/auth.actions";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/contacts", label: "Messages", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function isLinkActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

function AdminNavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1">
      {links.map((link) => {
        const isActive = isLinkActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors sm:py-2",
              isActive
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary",
            )}
          >
            <link.icon className="size-4 shrink-0" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

function AdminSignOutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        await logoutUser();
        router.push("/admin/login");
        router.refresh();
      }}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-destructive transition-colors hover:bg-destructive/10 sm:py-2"
    >
      <LogOut className="size-4 shrink-0" />
      Sign out
    </button>
  );
}

/** Persistent sidebar shown at lg (1024px) and above. */
export function AdminSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border/70 bg-card p-4 lg:flex print:hidden">
      <p className="mb-6 px-2 font-heading text-xl">Aura &amp; Petals</p>
      <AdminNavLinks />
      <AdminSignOutButton />
    </aside>
  );
}

/** Sticky top bar + slide-out drawer shown below lg (1024px). */
export function AdminMobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/70 bg-card px-4 lg:hidden print:hidden">
      <p className="font-heading text-lg">Aura &amp; Petals</p>
      <Sheet open={open} onOpenChange={setOpen}>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Open admin menu"
          onClick={() => setOpen(true)}
        >
          <Menu />
        </Button>
        <SheetContent side="left" className="flex w-72 flex-col">
          <SheetHeader>
            <SheetTitle>Admin menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-1 flex-col">
            <AdminNavLinks onNavigate={() => setOpen(false)} />
            <AdminSignOutButton />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
