import { Suspense } from "react";

import AuthPage from "@/components/pages/auth-page";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] bg-background" />}>
      <AuthPage mode="register" />
    </Suspense>
  );
}
