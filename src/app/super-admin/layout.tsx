import { DashboardShell } from "@/components/platform/dashboard-shell";

const superAdminNav = [
  {
    href: "/super-admin",
    label: "Overview",
    description: "Global SaaS health, tenant count, and pending actions.",
  },
  {
    href: "/super-admin/plans",
    label: "Plans",
    description: "Adjust monthly pricing, quotas, and included features.",
  },
  {
    href: "/super-admin/subscriptions",
    label: "Subscriptions",
    description: "Control tenant status, limits, and storefront access.",
  },
  {
    href: "/super-admin/payments",
    label: "Payments",
    description: "Record and verify bKash or Nagad transactions.",
  },
];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      title="Super Admin"
      subtitle="SaaS owner controls for tenant plans, subscriptions, and payments."
      items={superAdminNav}
      workspace="super-admin"
    >
      {children}
    </DashboardShell>
  );
}
