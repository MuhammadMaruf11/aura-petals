import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Sparkles, HeartHandshake, ShieldCheck, Gem } from "lucide-react";

export const metadata: Metadata = { title: "Our Story · " + siteConfig.name };

export default function AboutPage() {
  return (
    <div className="container-boutique py-16 px-4 sm:px-6 space-y-12">
      {/* Hero Header Section */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 text-primary font-semibold text-xs tracking-wider uppercase">
          <Sparkles className="size-3.5" /> Our Story
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Handmade, with care & passion
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Discover the journey behind {siteConfig.name} and why we believe in
          the timeless beauty of handcrafted gifts.
        </p>
      </div>

      {/* Main Content Card Container */}
      <div className="bg-white border border-border/60 rounded-3xl p-8 sm:p-12 shadow-xs space-y-8 text-foreground">
        <div className="space-y-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
          <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-primary first-letter:mr-1">
            {siteConfig.name} started with a simple idea: gifts feel more
            meaningful when someone actually made them. What began as a small
            collection of hand-shaped clay pieces grew, one custom order at a
            time, into a home for handmade gifts that people in Bangladesh could
            give — and receive — with pride.
          </p>
          <p>
            Every piece we sell is made in small batches, not mass-produced. Our
            clay art is shaped and painted by hand, our personalized gifts are
            made to order, and our gift boxes are packed individually rather
            than pulled off a line. That means occasional small variations
            between pieces — we see that as a feature, not a flaw. It&apos;s
            proof a person, not a machine, made your gift.
          </p>
        </div>

        {/* Feature Highlight Grid */}
        <div className="grid gap-4 sm:grid-cols-3 pt-6 border-t border-border/60">
          <div className="bg-neutral-50/60 p-5 rounded-2xl border border-border/50 space-y-2">
            <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Gem className="size-4" />
            </div>
            <h2 className="font-heading text-sm font-bold text-foreground">
              100% Handmade
            </h2>
            <p className="text-xs text-muted-foreground">
              Shaped, painted, and packed individually with close personal
              attention.
            </p>
          </div>

          <div className="bg-neutral-50/60 p-5 rounded-2xl border border-border/50 space-y-2">
            <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <HeartHandshake className="size-4" />
            </div>
            <h2 className="font-heading text-sm font-bold text-foreground">
              Made in Bangladesh
            </h2>
            <p className="text-xs text-muted-foreground">
              Proudly crafting meaningful custom creations locally for our
              community.
            </p>
          </div>

          <div className="bg-neutral-50/60 p-5 rounded-2xl border border-border/50 space-y-2">
            <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <ShieldCheck className="size-4" />
            </div>
            <h2 className="font-heading text-sm font-bold text-foreground">
              Honest & Simple
            </h2>
            <p className="text-xs text-muted-foreground">
              Fair pricing, transparent timelines, and real human support.
            </p>
          </div>
        </div>

        {/* Closing Statement */}
        <div className="bg-secondary/40 p-6 rounded-2xl border border-border/50 text-center space-y-2">
          <p className="text-sm font-medium text-foreground">
            We&apos;re a small, budget-conscious team based in Bangladesh, and
            we keep things simple on purpose.
          </p>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary pt-1">
            Thank you for supporting handmade.
          </p>
        </div>
      </div>
    </div>
  );
}
