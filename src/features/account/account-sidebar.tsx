"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Heart, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutUser } from "@/server/actions/auth.actions";
import { useRouter } from "next/navigation";

const links = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard },
  { href: "/account/orders", label: "My Orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/settings", label: "Settings", icon: Settings },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-full shrink-0 space-y-1 lg:w-56">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm",
              isActive ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
            )}
          >
            <link.icon className="size-4" />
            {link.label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={async () => {
          await logoutUser();
          router.push("/");
          router.refresh();
        }}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10"
      >
        <LogOut className="size-4" />
        Sign out
      </button>
    </aside>
  );
}
