"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteBannerAction } from "@/server/actions/admin-settings.actions";

export function DeleteBannerButton({ bannerId }: { bannerId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm("Delete this banner?")) return;
    startTransition(async () => {
      await deleteBannerAction(bannerId);
      router.refresh();
    });
  }

  return (
    <button onClick={handleDelete} disabled={isPending} aria-label="Delete banner">
      <Trash2 className="size-4 text-destructive" />
    </button>
  );
}
