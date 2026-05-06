"use client";

import Link from "next/link";

import { platformAutomationRules, usePlatformStore } from "@/store/usePlatformStore";
import { formatDate } from "@/lib/platform";
import { MetricCard, Panel, SectionHeading } from "@/components/platform/ui";
import { Button } from "@/components/ui/button";

export default function AdminOverviewPage() {
  const products = usePlatformStore((state) => state.products);
  const messages = usePlatformStore((state) => state.messages);
  const branding = usePlatformStore((state) => state.branding);
  const automationEvents = usePlatformStore((state) => state.automationEvents);

  const activeProducts = products.filter((product) => product.status === "active");
  const draftProducts = products.filter((product) => product.status === "draft");
  const unreadMessages = messages.filter((message) => message.status === "new");

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="SME Admin"
        title={`${branding.businessName} control panel`}
        description="Manage branding, products, customer messages, and automation visibility from one SME workspace."
        action={
          <Button asChild className="rounded-full px-5">
            <Link href="/admin/products">Open product manager</Link>
          </Button>
        }
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Active products" value={String(activeProducts.length)} helper="Live on the storefront." />
        <MetricCard label="Draft products" value={String(draftProducts.length)} helper="Ready for upcoming launches." />
        <MetricCard label="New enquiries" value={String(unreadMessages.length)} helper="Submitted from the contact page." />
        <MetricCard label="Automation rules" value={String(platformAutomationRules.length)} helper="Visible make.com and media policies." />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel
          title="Recent catalog activity"
          subtitle="Products and updates feeding the storefront module."
          badge={`${products.length} total`}
        >
          <div className="space-y-4">
            {products.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-border/70 bg-muted/35 p-4"
              >
                <div>
                  <p className="font-medium text-foreground">{product.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.category} • {product.tier} • stock {product.stock}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">{formatDate(product.updatedAt)}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Customer inbox snapshot"
          subtitle="Contact page enquiries routed into the admin board."
          badge={`${messages.length} threads`}
        >
          <div className="space-y-4">
            {messages.slice(0, 4).map((message) => (
              <div key={message.id} className="rounded-[24px] border border-border/70 bg-muted/35 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-medium text-foreground">{message.subject}</p>
                  <p className="text-xs uppercase tracking-[0.22em] text-secondary">{message.status}</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{message.customerName}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel
          title="Brand and storefront checklist"
          subtitle="Core operational modules required by the system design."
        >
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Branding settings with logo and color controls are available in the branding section.</p>
            <p>Product CRUD supports multiple images plus video URLs while keeping video hidden from the website.</p>
            <p>Message board connects directly to storefront contact enquiries.</p>
            <p>Automation policies outline social distribution and Cloudinary cleanup behavior.</p>
          </div>
        </Panel>

        <Panel
          title="Automation timeline"
          subtitle="Visibility into webhook, publish, cleanup, and messaging events."
        >
          <div className="space-y-4">
            {automationEvents.slice(0, 6).map((event) => (
              <div key={event.id} className="rounded-[24px] border border-border/70 bg-muted/35 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-medium text-foreground">{event.title}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(event.createdAt)}</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
