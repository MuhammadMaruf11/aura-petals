"use client";

import { useState } from "react";

import { Panel, SectionHeading } from "@/components/platform/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePlatformStore } from "@/store/usePlatformStore";

export default function SuperAdminPlansPage() {
  const plans = usePlatformStore((state) => state.plans);
  const updatePlan = usePlatformStore((state) => state.updatePlan);
  const [drafts, setDrafts] = useState(
    Object.fromEntries(
      plans.map((plan) => [
        plan.id,
        {
          ...plan,
          featuresText: plan.features.join(", "),
        },
      ])
    )
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Pricing Tiers"
        title="Adjust plan price points, limits, and bundled features."
        description="This page addresses the super-admin pricing tier management requirement."
      />

      <div className="grid gap-6 xl:grid-cols-3">
        {plans.map((plan) => {
          const draft = drafts[plan.id];

          return (
            <Panel key={plan.id} title={plan.name} subtitle="Edit the commercial limits for this plan.">
              <div className="grid gap-4">
                <label className="space-y-2 text-sm font-medium">
                  Monthly price
                  <Input
                    type="number"
                    value={draft.monthlyPrice}
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [plan.id]: {
                          ...current[plan.id],
                          monthlyPrice: Number(event.target.value) || 0,
                        },
                      }))
                    }
                    className="h-11 rounded-full"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium">
                  Product limit
                  <Input
                    type="number"
                    value={draft.productLimit}
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [plan.id]: {
                          ...current[plan.id],
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
                        [plan.id]: {
                          ...current[plan.id],
                          automationQuota: Number(event.target.value) || 0,
                        },
                      }))
                    }
                    className="h-11 rounded-full"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium">
                  Team seats
                  <Input
                    type="number"
                    value={draft.teamSeats}
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [plan.id]: {
                          ...current[plan.id],
                          teamSeats: Number(event.target.value) || 0,
                        },
                      }))
                    }
                    className="h-11 rounded-full"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium">
                  Features
                  <textarea
                    value={draft.featuresText}
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [plan.id]: {
                          ...current[plan.id],
                          featuresText: event.target.value,
                        },
                      }))
                    }
                    className="min-h-28 w-full rounded-[28px] border border-border bg-background px-4 py-3 text-sm outline-none"
                  />
                </label>
                <Button
                  className="rounded-full px-5"
                  onClick={() =>
                    updatePlan(plan.id, {
                      monthlyPrice: drafts[plan.id].monthlyPrice,
                      productLimit: drafts[plan.id].productLimit,
                      automationQuota: drafts[plan.id].automationQuota,
                      teamSeats: drafts[plan.id].teamSeats,
                      features: drafts[plan.id].featuresText
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    })
                  }
                >
                  Save plan
                </Button>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
