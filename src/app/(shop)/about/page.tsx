import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Our Story" };

export default function AboutPage() {
  return (
    <div className="container-boutique py-12">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-medium text-primary">Our Story</p>
        <h1 className="mt-2 font-heading text-3xl">Handmade, with care</h1>

        <div className="mt-8 space-y-6 text-muted-foreground">
          <p>
            {siteConfig.name} started with a simple idea: gifts feel more meaningful when
            someone actually made them. What began as a small collection of hand-shaped clay
            pieces grew, one custom order at a time, into a home for handmade gifts that people
            in Bangladesh could give — and receive — with pride.
          </p>
          <p>
            Every piece we sell is made in small batches, not mass-produced. Our clay art is
            shaped and painted by hand, our personalized gifts are made to order, and our gift
            boxes are packed individually rather than pulled off a line. That means occasional
            small variations between pieces — we see that as a feature, not a flaw. It&apos;s
            proof a person, not a machine, made your gift.
          </p>
          <p>
            We&apos;re a small, budget-conscious team based in Bangladesh, and we keep things
            simple on purpose: fair prices, honest delivery timelines, and real people to talk
            to if something isn&apos;t right. Thank you for supporting handmade.
          </p>
        </div>
      </div>
    </div>
  );
}
