"use client";

import { usePathname } from "next/navigation";

import AppFooter from "@/components/common/AppFooter";
import Header from "@/components/common/Header";
import TawkChat from "@/components/common/TawkChat";
import FramerProvider from "@/components/providers/framer-provider";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isWorkspaceRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/super-admin");

  if (isWorkspaceRoute) {
    return <FramerProvider>{children}</FramerProvider>;
  }

  return (
    <>
      <Header />
      <main className="grow">
        <FramerProvider>{children}</FramerProvider>
      </main>
      <AppFooter />
      <TawkChat />
    </>
  );
}
