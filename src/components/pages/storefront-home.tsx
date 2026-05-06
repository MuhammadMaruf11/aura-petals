"use client";

import { BadgeCheck, Sparkles, Workflow } from "lucide-react";

import CategorySection from "@/components/Home/CategorySection";
import Hero from "@/components/Home/Hero";
import ProductGrid from "@/components/Home/ProductGrid";
import { MetricCard, Panel, SectionHeading } from "@/components/platform/ui";
import { useMounted } from "@/hooks/use-mounted";
import { usePlatformStore } from "@/store/usePlatformStore";

const HomePageClient = () => {
  const mounted = useMounted();
  const branding = usePlatformStore((state) => state.branding);
  const products = usePlatformStore((state) => state.products);

  if (!mounted) {
    return <div className="min-h-[40vh] bg-background" />;
  }

  const featuredProducts = products.filter((product) => product.featured && product.status === "active");

  return (
    <>
      <Hero />
      <section className="border-b border-border/70 bg-card/60">
        <div className="container mx-auto grid gap-5 px-4 py-8 md:grid-cols-3">
          <MetricCard label="Tenant-ready" value="3 panels" helper="Storefront, SME admin, super-admin flows." />
          <MetricCard label="Automation rules" value="2 core rules" helper="Image and short-form video distribution is documented." />
          <MetricCard label="Brand control" value="Live theme" helper="Primary, secondary, and accent colors update from admin settings." />
        </div>
      </section>

      <CategorySection />

      <ProductGrid
        title="Featured Collection"
        subtitle="Freshly Curated"
        products={featuredProducts}
      />

      <section className="bg-muted/35 py-20">
        <div className="container mx-auto space-y-10 px-4">
          <SectionHeading
            eyebrow="Platform Coverage"
            title={`${branding.businessName} covers storefront, operations, and SaaS control.`}
            description="The system design requires one polished customer storefront, one SME admin workspace, and one super-admin SaaS command center. Those flows are now connected under a shared data model."
          />

          <div className="grid gap-6 lg:grid-cols-3">
            <Panel
              title="Storefront flow"
              subtitle="Browse, filter, inspect details, contact the brand, and manage a customer profile."
              badge="Customer side"
            >
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 size-4 text-secondary" />
                  <p>Home page, product grid, product detail page, auth, profile, and contact are wired together.</p>
                </div>
                <div className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 size-4 text-secondary" />
                  <p>Video media is tracked on products but intentionally hidden from the website experience.</p>
                </div>
              </div>
            </Panel>

            <Panel
              title="SME operations"
              subtitle="Branding controls, product CRUD, message board, and automation visibility."
              badge="Admin panel"
            >
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <Workflow className="mt-0.5 size-4 text-secondary" />
                  <p>Product changes create a visible automation timeline for publish and cleanup events.</p>
                </div>
                <div className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 size-4 text-secondary" />
                  <p>Contact form submissions show up in the admin message board from the same shared store.</p>
                </div>
              </div>
            </Panel>

            <Panel
              title="SaaS command"
              subtitle="Subscription health, pricing tiers, and manual bKash or Nagad verification."
              badge="Super-admin"
            >
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 size-4 text-secondary" />
                  <p>Plans, tenant status, storefront availability, and payment states are manageable in-app.</p>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 size-4 text-secondary" />
                  <p>This keeps the system design requirements visible even before Supabase and Make.com are connected.</p>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePageClient;
