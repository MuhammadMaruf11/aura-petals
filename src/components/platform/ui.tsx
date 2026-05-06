import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center"
      )}
    >
      <div className={cn("space-y-3", align === "center" && "max-w-3xl")}>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-2">
          <h2 className="font-heading text-3xl text-primary md:text-4xl">{title}</h2>
          {description ? (
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <Card className="rounded-3xl border border-border/80 bg-card shadow-sm">
      <CardContent className="space-y-3 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {label}
        </p>
        <p className="font-heading text-4xl text-primary">{value}</p>
        {helper ? <p className="text-sm text-muted-foreground">{helper}</p> : null}
      </CardContent>
    </Card>
  );
}

export function Panel({
  title,
  subtitle,
  badge,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("rounded-[28px] border border-border/80 bg-card shadow-sm", className)}>
      <CardHeader className="space-y-3 border-b border-border/70 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-2xl text-primary">{title}</CardTitle>
            {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>
          {badge ? <Badge variant="secondary">{badge}</Badge> : null}
        </div>
      </CardHeader>
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  );
}
