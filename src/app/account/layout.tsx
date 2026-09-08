import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AccountSidebar } from "@/features/account/account-sidebar";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="container-boutique flex flex-col gap-8 py-12 lg:flex-row">
          <AccountSidebar />
          <div className="flex-1">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
