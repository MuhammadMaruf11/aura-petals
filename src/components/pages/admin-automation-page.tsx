"use client";

import { platformAutomationRules, usePlatformStore } from "@/store/usePlatformStore";
import { formatDate } from "@/lib/platform";
import { MetricCard, Panel, SectionHeading } from "@/components/platform/ui";

export default function AdminAutomationPage() {
  const automationEvents = usePlatformStore((state) => state.automationEvents);

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Automation"
        title="Keep media rules and event visibility aligned with the system design."
        description="This section documents the Make.com flow, Cloudinary cleanup policy, and channel constraints for images and short-form videos."
      />

      <div className="grid gap-5 md:grid-cols-3">
        <MetricCard label="Image rule" value="Website yes" helper="Images publish to Facebook, Instagram, LinkedIn, and the website." />
        <MetricCard label="Video rule" value="Website no" helper="Short-form videos route to social channels only." />
        <MetricCard label="Cleanup rule" value="Queued" helper="Cloudinary lifecycle actions appear as admin-visible events." />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <Panel title="Distribution rules" subtitle="Canonical workflow rules from the system design document.">
          <div className="space-y-4">
            {platformAutomationRules.map((rule) => (
              <div key={rule.id} className="rounded-[28px] border border-border/70 bg-muted/35 p-5">
                <p className="font-medium text-foreground">{rule.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{rule.trigger}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Channels: {rule.channels.join(", ")}
                </p>
                {rule.exclusions?.length ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Exclusions: {rule.exclusions.join(", ")}
                  </p>
                ) : null}
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{rule.note}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Recent events" subtitle="A lightweight activity feed for publish, cleanup, payment, and message workflows.">
          <div className="space-y-4">
            {automationEvents.map((event) => (
              <div key={event.id} className="rounded-[28px] border border-border/70 bg-muted/35 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-medium text-foreground">{event.title}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(event.createdAt)}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{event.description}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
