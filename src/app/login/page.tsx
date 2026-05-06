import { Suspense } from "react";

import AuthPage from "@/components/pages/auth-page";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] bg-background" />}>
      <AuthPage mode="login" />
    </Suspense>
  );
}
