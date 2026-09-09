import { requireAdmin } from "@/lib/auth/current-user";
import {
  AdminSidebar,
  AdminMobileHeader,
} from "@/features/admin/admin-sidebar";
import { siteConfig } from "@/config/site";
import { getStoreSettings } from "@/server/services/admin-settings.service";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  // Categories er poriborte store settings fetch kora hocche
  const storeSettings = await getStoreSettings();

  const storeName = storeSettings?.storeName || siteConfig.name;
  const logoUrl = storeSettings?.logoUrl;

  return (
    <div className="min-h-screen bg-sand lg:flex">
      <AdminSidebar storeName={storeName} logoUrl={logoUrl} />
      <div className="min-w-0 flex-1">
        <AdminMobileHeader storeName={storeName} logoUrl={logoUrl} />
        <main className="min-w-0 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
