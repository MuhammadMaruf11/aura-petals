"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, LayoutDashboard, PanelLeftOpen, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  description: string;
};

export function DashboardShell({
  title,
  subtitle,
  items,
  workspace,
  children,
}: {
  title: string;
  subtitle: string;
  items: NavItem[];
  workspace: "admin" | "super-admin";
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const workspaceLabel =
    workspace === "super-admin" ? "SaaS Owner Workspace" : "SME Operator Workspace";

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b border-border/70 bg-card/95 backdrop-blur">
        <div className="container mx-auto flex min-h-20 items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <LayoutDashboard className="size-6" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
                {workspaceLabel}
              </p>
              <h1 className="font-heading text-2xl text-primary">{title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-border/70 bg-muted/35 px-4 py-2 text-xs font-medium text-muted-foreground md:flex">
              <ShieldCheck className="size-4 text-secondary" />
              <span>{subtitle}</span>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/30 hover:text-primary"
            >
              <ChevronLeft className="size-4" />
              Storefront
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto grid gap-6 px-4 py-8 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-[32px] border border-border/80 bg-card p-6 shadow-sm lg:sticky lg:top-8 lg:h-fit">
          <div className="space-y-4 border-b border-border/70 pb-5">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <LayoutDashboard className="size-6" />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
                Workspace
              </p>
              <h1 className="font-heading text-3xl text-primary">{title}</h1>
              <p className="text-sm leading-6 text-muted-foreground">{subtitle}</p>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block rounded-[22px] border px-4 py-3 transition",
                    active
                      ? "border-primary/20 bg-primary/8 text-primary"
                      : "border-transparent bg-muted/35 text-foreground hover:border-border hover:bg-card"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <PanelLeftOpen className="mt-0.5 size-4 shrink-0" />
                    <div className="space-y-1">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs leading-5 text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </aside>

        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
