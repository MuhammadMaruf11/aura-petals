"use client";

import Link from "next/link";

import { MetricCard, Panel, SectionHeading } from "@/components/platform/ui";
import { Button } from "@/components/ui/button";
import { formatDate, formatPrice, subscriptionLabels } from "@/lib/platform";
import { usePlatformStore } from "@/store/usePlatformStore";

export default function SuperAdminOverviewPage() {
  const plans = usePlatformStore((state) => state.plans);
  const subscriptions = usePlatformStore((state) => state.subscriptions);
  const payments = usePlatformStore((state) => state.payments);

  const activeSubscriptions = subscriptions.filter((item) => item.status === "active");
  const pendingPayments = payments.filter((item) => item.status === "pending");
  const monthlyRevenue = subscriptions.reduce((sum, subscription) => {
    const plan = plans.find((item) => item.id === subscription.planId);
    return sum + (plan?.monthlyPrice ?? 0);
  }, 0);

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Super Admin"
        title="Control tenant subscriptions, plan tiers, and manual payment verification."
        description="This workspace covers the SaaS owner responsibilities described in the system design document."
        action={
          <Button asChild className="rounded-full px-5">
            <Link href="/super-admin/payments">Review payments</Link>
          </Button>
        }
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Plans" value={String(plans.length)} helper="Tier definitions for different business sizes." />
        <MetricCard label="Active tenants" value={String(activeSubscriptions.length)} helper="Currently enabled client storefronts." />
        <MetricCard label="Pending payments" value={String(pendingPayments.length)} helper="Awaiting bKash or Nagad verification." />
        <MetricCard label="Recurring value" value={formatPrice(monthlyRevenue)} helper="Aggregate monthly plan value from active data." />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <Panel title="Subscription health" subtitle="See current plan distribution and storefront availability.">
          <div className="space-y-4">
            {subscriptions.map((subscription) => {
              const plan = plans.find((item) => item.id === subscription.planId);

              return (
                <div key={subscription.id} className="rounded-[28px] border border-border/70 bg-muted/35 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-foreground">{subscription.tenantName}</p>
                      <p className="text-sm text-muted-foreground">
                        {subscription.ownerName} • {plan?.name ?? "Unknown plan"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.22em] text-secondary">
                        {subscriptionLabels[subscription.status]}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        renews {formatDate(subscription.renewalDate)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="Manual payment queue" subtitle="Manual confirmation is required for regional payment rails.">
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="rounded-[28px] border border-border/70 bg-muted/35 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-foreground">{payment.tenantName}</p>
                    <p className="text-sm text-muted-foreground">
                      {payment.method} • {payment.transactionId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary">{formatPrice(payment.amount)}</p>
                    <p className="text-xs uppercase tracking-[0.22em] text-secondary">{payment.status}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{payment.note}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
