"use client";

import { useState } from "react";

import { Panel, SectionHeading } from "@/components/platform/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscriptionLabels } from "@/lib/platform";
import { usePlatformStore } from "@/store/usePlatformStore";

export default function SuperAdminSubscriptionsPage() {
  const plans = usePlatformStore((state) => state.plans);
  const subscriptions = usePlatformStore((state) => state.subscriptions);
  const updateSubscription = usePlatformStore((state) => state.updateSubscription);

  const [drafts, setDrafts] = useState(
    Object.fromEntries(subscriptions.map((subscription) => [subscription.id, subscription]))
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Subscriptions"
        title="Activate, adjust, pause, or disable tenant instances."
        description="This page implements the SaaS owner subscription management flow."
      />

      <div className="space-y-5">
        {subscriptions.map((subscription) => {
          const draft = drafts[subscription.id];

          return (
            <Panel
              key={subscription.id}
              title={subscription.tenantName}
              subtitle={`Owner: ${subscription.ownerName}`}
              badge={subscriptionLabels[draft.status]}
            >
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <label className="space-y-2 text-sm font-medium">
                  Plan
                  <select
                    value={draft.planId}
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [subscription.id]: {
                          ...current[subscription.id],
                          planId: event.target.value,
                        },
                      }))
                    }
                    className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none"
                  >
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 text-sm font-medium">
                  Status
                  <select
                    value={draft.status}
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [subscription.id]: {
                          ...current[subscription.id],
                          status: event.target.value as typeof draft.status,
                        },
                      }))
                    }
                    className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none"
                  >
                    <option value="trial">Trial</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </label>
                <label className="space-y-2 text-sm font-medium">
                  Product limit
                  <Input
                    type="number"
                    value={draft.productLimit}
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [subscription.id]: {
                          ...current[subscription.id],
                          productLimit: Number(event.target.value) || 0,
                        },
                      }))
                    }
                    className="h-11 rounded-full"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium">
                  Automation quota
                  <Input
                    type="number"
                    value={draft.automationQuota}
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [subscription.id]: {
                          ...current[subscription.id],
                          automationQuota: Number(event.target.value) || 0,
                        },
                      }))
                    }
                    className="h-11 rounded-full"
                  />
                </label>
                <label className="flex items-center gap-3 rounded-full border border-border bg-muted/35 px-4 py-3 text-sm">
                  <input
                    type="checkbox"
                    checked={draft.storefrontEnabled}
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [subscription.id]: {
                          ...current[subscription.id],
                          storefrontEnabled: event.target.checked,
                        },
                      }))
                    }
                  />
                  Storefront enabled
                </label>
              </div>

              <div className="mt-5">
                <Button
                  className="rounded-full px-5"
                  onClick={() => updateSubscription(subscription.id, drafts[subscription.id])}
                >
                  Save subscription
                </Button>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
