import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  adminGetContactMessage,
  adminMarkContactMessageRead,
} from "@/server/services/admin-contact.service";
import { ContactMessageControls } from "@/features/admin/contact-message-controls";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Message · Admin" };

export default async function AdminContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const message = await adminGetContactMessage(id);
  if (!message) notFound();

  // Opening a message from the inbox is the natural "read" signal.
  if (!message.isRead) {
    await adminMarkContactMessageRead(id, true);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/admin/contacts"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Back to messages
      </Link>

      <div className="rounded-2xl border border-border/70 bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-heading text-xl">{message.subject}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{formatDate(message.createdAt)}</p>
          </div>
          <ContactMessageControls id={message.id} isRead={true} />
        </div>

        <div className="mt-6 space-y-1 text-sm">
          <p>
            <span className="text-muted-foreground">From: </span>
            {message.name} &lt;
            <Link href={`mailto:${message.email}`} className="text-primary hover:underline">
              {message.email}
            </Link>
            &gt;
          </p>
          {message.phone && (
            <p>
              <span className="text-muted-foreground">Phone: </span>
              {message.phone}
            </p>
          )}
        </div>

        <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed">{message.message}</p>
      </div>
    </div>
  );
}
