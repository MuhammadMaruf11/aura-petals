import { DashboardShell } from "@/components/platform/dashboard-shell";

const adminNav = [
  {
    href: "/admin",
    label: "Overview",
    description: "High-level store operations, metrics, and automation activity.",
  },
  {
    href: "/admin/branding",
    label: "Branding",
    description: "Manage logo, copy, and theme variables.",
  },
  {
    href: "/admin/products",
    label: "Products",
    description: "Run product CRUD with image and video metadata.",
  },
  {
    href: "/admin/messages",
    label: "Messages",
    description: "Respond to storefront contact form enquiries.",
  },
  {
    href: "/admin/automation",
    label: "Automation",
    description: "Review distribution rules and lifecycle events.",
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      title="SME Admin"
      subtitle="Tenant branding, product operations, and customer communication."
      items={adminNav}
      workspace="admin"
    >
      {children}
    </DashboardShell>
  );
}
