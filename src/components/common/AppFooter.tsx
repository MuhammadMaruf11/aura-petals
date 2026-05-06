export default function AppFooter() {
  return (
    <footer className="border-t border-border/80 bg-card/80">
      <div className="container mx-auto grid gap-8 px-4 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
            Aura & Petals
          </p>
          <h2 className="font-heading text-3xl text-primary">
            Multi-tenant gifting storefront with admin automation.
          </h2>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Built for SMEs that need a refined storefront, social publishing rules, and
            SaaS-ready admin controls in one place.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Storefront</p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <p>Shop all products</p>
            <p>Contact the studio</p>
            <p>Profile and order tracking</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Platform</p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <p>Operator workspaces stay hidden until staff authentication is active.</p>
            <p>Cloudinary lifecycle and Make.com automation visibility are built into the private side.</p>
          </div>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="container mx-auto flex flex-col gap-2 px-4 py-4 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>Copyright {new Date().getFullYear()} Aura & Petals. All rights reserved.</p>
          <p>Primary stack: Next.js App Router, Tailwind CSS, Supabase-ready SaaS architecture.</p>
        </div>
      </div>
    </footer>
  );
}
