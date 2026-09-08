import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import {
  AdminSidebar,
  AdminMobileHeader,
} from "@/features/admin/admin-sidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // ১. ইউজার না থাকলে লগইন পেজে রিরেক্ট করুন
  if (!user) {
    redirect("/login?next=/admin");
  }

  // ২. ইউজার যদি এডমিন না হয়, তবে হোমপেজে পাঠাই দিন
  if (user.role !== "ADMIN") {
    redirect("/");
  }

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
