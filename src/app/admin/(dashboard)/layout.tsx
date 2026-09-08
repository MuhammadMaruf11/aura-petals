import { requireAdmin } from "@/lib/auth/current-user";
import { AdminSidebar, AdminMobileHeader } from "@/features/admin/admin-sidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defense in depth: middleware already blocks non-admins from /admin/*,
  // but every admin page/action should also independently verify the role
  // server-side rather than trusting the client or the route alone.
  await requireAdmin();

  return (
    <div className="min-h-screen bg-sand lg:flex">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        <AdminMobileHeader />
        <main className="min-w-0 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
