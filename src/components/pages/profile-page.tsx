"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, PackageCheck } from "lucide-react";

import { MetricCard, Panel, SectionHeading } from "@/components/platform/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate, formatPrice } from "@/lib/platform";
import { useMounted } from "@/hooks/use-mounted";
import { usePlatformStore } from "@/store/usePlatformStore";

export default function ProfilePageClient() {
  const mounted = useMounted();
  const auth = usePlatformStore((state) => state.auth);
  const profile = usePlatformStore((state) => state.profile);
  const updateProfile = usePlatformStore((state) => state.updateProfile);
  const logout = usePlatformStore((state) => state.logout);

  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);

  if (!mounted) {
    return <div className="min-h-[50vh] bg-background" />;
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Panel title="Login required" subtitle="Profile settings and order history are available after authentication.">
          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-full px-5">
              <Link href="/login">
                Login
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="secondary" className="rounded-full px-5">
              <Link href="/register">Create account</Link>
            </Button>
          </div>
        </Panel>
      </div>
    );
  }

  const totalOrders = profile.orderHistory.length;
  const totalSpend = profile.orderHistory.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="bg-background py-16">
      <div className="container mx-auto space-y-10 px-4">
        <SectionHeading
          eyebrow="Customer Profile"
          title={`Welcome back, ${profile.fullName}.`}
          description="Manage profile settings and review order history from one customer workspace."
          action={
            <Button variant="ghost" className="rounded-full px-5" onClick={logout}>
              Sign out
            </Button>
          }
        />

        <div className="grid gap-5 md:grid-cols-3">
          <MetricCard label="Orders" value={String(totalOrders)} helper="Tracked inside the customer profile module." />
          <MetricCard label="Total spend" value={formatPrice(totalSpend)} helper="Based on the seeded storefront order history." />
          <MetricCard label="Member since" value={formatDate(profile.memberSince)} helper="This can map directly to an auth profile record." />
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <Panel title="Profile settings" subtitle="Editable customer information for the auth/profile requirement.">
            <div className="grid gap-4">
              <label className="space-y-2 text-sm font-medium">
                Full name
                <Input value={fullName} onChange={(event) => setFullName(event.target.value)} className="h-11 rounded-full" />
              </label>
              <label className="space-y-2 text-sm font-medium">
                Email
                <Input value={email} onChange={(event) => setEmail(event.target.value)} className="h-11 rounded-full" />
              </label>
              <label className="space-y-2 text-sm font-medium">
                Phone
                <Input value={phone} onChange={(event) => setPhone(event.target.value)} className="h-11 rounded-full" />
              </label>
              <label className="space-y-2 text-sm font-medium">
                Address
                <Input value={address} onChange={(event) => setAddress(event.target.value)} className="h-11 rounded-full" />
              </label>

              <Button
                className="mt-2 h-11 rounded-full"
                onClick={() => updateProfile({ fullName, email, phone, address })}
              >
                Save profile
              </Button>
            </div>
          </Panel>

          <Panel title="Order history" subtitle="Track customer purchases with current statuses and items." badge={`${totalOrders} orders`}>
            <div className="space-y-4">
              {profile.orderHistory.map((order) => (
                <div key={order.id} className="rounded-[28px] border border-border/70 bg-muted/35 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(order.placedAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-heading text-2xl text-primary">{formatPrice(order.total)}</p>
                      <p className="text-sm uppercase tracking-[0.2em] text-secondary">{order.status}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {order.items.map((item) => (
                      <div key={`${order.id}-${item.productId}`} className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                          {item.title} x {item.quantity}
                        </span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="rounded-[36px] border border-border/70 bg-card/70 p-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-secondary/20 text-secondary">
              <PackageCheck className="size-7" />
            </div>
            <div className="space-y-1">
              <p className="font-heading text-2xl text-primary">Customer-facing account flow is in place.</p>
              <p className="text-sm text-muted-foreground">
                The remaining backend step is swapping the mock store with real Supabase user and order data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
