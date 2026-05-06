"use client";

import { ChangeEvent, useState } from "react";

import { MetricCard, Panel, SectionHeading } from "@/components/platform/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePlatformStore } from "@/store/usePlatformStore";

export default function AdminBrandingPage() {
  const branding = usePlatformStore((state) => state.branding);
  const updateBranding = usePlatformStore((state) => state.updateBranding);
  const updateBrandColors = usePlatformStore((state) => state.updateBrandColors);
  const updateLogo = usePlatformStore((state) => state.updateLogo);

  const [businessName, setBusinessName] = useState(branding.businessName);
  const [tagline, setTagline] = useState(branding.tagline);
  const [logoUrl, setLogoUrl] = useState(branding.logoUrl);

  const handleLogoFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLogoUrl(reader.result);
        updateLogo(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Branding"
        title="Control logo and theme variables from the SME admin panel."
        description="Primary, secondary, accent, background, and foreground colors are applied through CSS variables so the storefront reacts immediately."
      />

      <div className="grid gap-5 md:grid-cols-3">
        <MetricCard label="Primary color" value={branding.colors.primary} helper="Used across CTA and navigation emphasis." />
        <MetricCard label="Secondary color" value={branding.colors.secondary} helper="Used for badges, accents, and supportive visuals." />
        <MetricCard label="Logo source" value={logoUrl.startsWith("data:") ? "Uploaded" : "URL"} helper="Upload a logo file or set a hosted asset URL." />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Business identity" subtitle="Edit tenant-facing copy and logo assets.">
          <div className="grid gap-4">
            <label className="space-y-2 text-sm font-medium">
              Business name
              <Input value={businessName} onChange={(event) => setBusinessName(event.target.value)} className="h-11 rounded-full" />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Tagline
              <Input value={tagline} onChange={(event) => setTagline(event.target.value)} className="h-11 rounded-full" />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Logo URL
              <Input value={logoUrl} onChange={(event) => setLogoUrl(event.target.value)} className="h-11 rounded-full" />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Upload logo file
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoFile}
                className="block w-full rounded-[28px] border border-border bg-background px-4 py-3 text-sm"
              />
            </label>
            <Button
              className="h-11 rounded-full"
              onClick={() => {
                updateBranding({ businessName, tagline });
                updateLogo(logoUrl);
              }}
            >
              Save business identity
            </Button>
          </div>
        </Panel>

        <Panel title="Color variables" subtitle="Live theme controls for storefront personalization.">
          <div className="grid gap-4">
            {(
              Object.entries(branding.colors) as Array<
                [keyof typeof branding.colors, string]
              >
            ).map(([key, value]) => (
              <label key={key} className="space-y-2 text-sm font-medium capitalize">
                {key}
                <div className="flex items-center gap-3 rounded-full border border-border bg-background px-4 py-2">
                  <input
                    type="color"
                    value={value}
                    onChange={(event) => updateBrandColors({ [key]: event.target.value })}
                    className="size-8 rounded-full border-0 bg-transparent"
                  />
                  <Input
                    value={value}
                    onChange={(event) => updateBrandColors({ [key]: event.target.value })}
                    className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                  />
                </div>
              </label>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Live storefront preview" subtitle="This reflects the same theme variables applied across the public site.">
        <div className="rounded-[32px] border border-border/70 bg-background p-6">
          <div className="space-y-4 rounded-[28px] border border-border/60 bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">Preview</p>
            <h2 className="font-heading text-4xl text-primary">{businessName || branding.businessName}</h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {tagline || branding.tagline}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button className="rounded-full px-5">Primary CTA</Button>
              <Button variant="secondary" className="rounded-full px-5">
                Secondary CTA
              </Button>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
