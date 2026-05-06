"use client";

import Link from "next/link";

import { Panel, SectionHeading } from "@/components/platform/ui";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/platform";
import { useCartStore } from "@/store/useCartStore";
import { usePlatformStore } from "@/store/usePlatformStore";

export default function CheckoutPageClient() {
  const { cart, getTotalPrice } = useCartStore();
  const profile = usePlatformStore((state) => state.profile);

  return (
    <div className="bg-background py-16">
      <div className="container mx-auto space-y-8 px-4">
        <SectionHeading
          eyebrow="Checkout"
          title="Mock checkout review for the current storefront flow."
          description="A full payment gateway is outside the current system design, but this page closes the purchase path with a clear order review."
        />

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <Panel title="Delivery profile" subtitle="Customer details currently come from the profile store.">
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>{profile.fullName}</p>
              <p>{profile.email}</p>
              <p>{profile.phone}</p>
              <p>{profile.address}</p>
              <Button asChild variant="secondary" className="rounded-full px-5">
                <Link href="/profile">Edit profile</Link>
              </Button>
            </div>
          </Panel>

          <Panel title="Order review" subtitle="Videos stay off-site; image-led products remain visible on the storefront.">
            <div className="space-y-4 text-sm text-muted-foreground">
              {cart.length ? (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <span>
                      {item.title} x {item.quantity}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))
              ) : (
                <p>No items in cart.</p>
              )}

              <div className="flex items-center justify-between border-t border-border pt-4 font-medium text-foreground">
                <span>Total</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>

              <div className="rounded-[24px] bg-muted/55 p-4 text-sm">
                Manual checkout handoff can be connected to Supabase orders and regional payment collection later.
              </div>

              <Button asChild className="w-full rounded-full">
                <Link href="/contact">Confirm and contact the store</Link>
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
