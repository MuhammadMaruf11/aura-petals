"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  markContactReadAction,
  deleteContactMessageAction,
} from "@/server/actions/admin-contact.actions";

export function ContactMessageControls({
  id,
  isRead,
}: {
  id: string;
  isRead: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function toggleRead() {
    startTransition(async () => {
      await markContactReadAction(id, !isRead);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!confirm("Delete this message? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteContactMessageAction(id);
      router.push("/admin/contacts");
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-3">
      <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={toggleRead}>
        Mark as {isRead ? "unread" : "read"}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={handleDelete}
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="size-4" />
        Delete
      </Button>
    </div>
  );
}
