import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/features/cart/cart-drawer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { getSession } from "@/lib/auth/current-user";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <>
      <Navbar />
      <MobileBottomNav isSignedIn={!!session} />
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}
