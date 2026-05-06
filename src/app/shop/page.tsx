import { Suspense } from "react";

import ShopPageClient from "@/components/pages/shop-page";

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] bg-background" />}>
      <ShopPageClient />
    </Suspense>
  );
}
