"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteCouponAction } from "@/server/actions/admin-coupon.actions";

export function DeleteCouponButton({ couponId }: { couponId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm("Delete this coupon?")) return;
    startTransition(async () => {
      await deleteCouponAction(couponId);
      router.refresh();
    });
  }

  return (
    <button onClick={handleDelete} disabled={isPending} aria-label="Delete coupon">
      <Trash2 className="size-4 text-destructive" />
    </button>
  );
}
