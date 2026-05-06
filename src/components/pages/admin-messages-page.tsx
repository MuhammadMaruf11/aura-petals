"use client";

import { useState } from "react";

import { Panel, SectionHeading } from "@/components/platform/ui";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/platform";
import { usePlatformStore } from "@/store/usePlatformStore";

export default function AdminMessagesPage() {
  const messages = usePlatformStore((state) => state.messages);
  const replyToMessage = usePlatformStore((state) => state.replyToMessage);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>(
    Object.fromEntries(messages.map((message) => [message.id, message.reply ?? ""]))
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Message Board"
        title="View and respond to customer enquiries from the contact page."
        description="Messages created on the storefront contact page land here for SME follow-up and status tracking."
      />

      <Panel title="Inbox" subtitle="Statuses support triage and resolution workflows." badge={`${messages.length} messages`}>
        <div className="space-y-5">
          {messages.map((message) => (
            <div key={message.id} className="rounded-[28px] border border-border/70 bg-muted/35 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{message.subject}</p>
                  <p className="text-sm text-muted-foreground">
                    {message.customerName} • {message.email} • {formatDate(message.receivedAt)}
                  </p>
                  <p className="text-sm leading-6 text-muted-foreground">{message.body}</p>
                </div>
                <select
                  value={message.status}
                  onChange={(event) =>
                    replyToMessage(
                      message.id,
                      replyDrafts[message.id] ?? "",
                      event.target.value as (typeof message)["status"]
                    )
                  }
                  className="h-10 rounded-full border border-border bg-background px-4 text-sm outline-none"
                >
                  <option value="new">New</option>
                  <option value="in_progress">In progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div className="mt-4 space-y-3">
                <textarea
                  value={replyDrafts[message.id] ?? ""}
                  onChange={(event) =>
                    setReplyDrafts((current) => ({ ...current, [message.id]: event.target.value }))
                  }
                  className="min-h-28 w-full rounded-[24px] border border-border bg-background px-4 py-3 text-sm outline-none"
                  placeholder="Write an admin response"
                />
                <Button
                  className="rounded-full px-5"
                  onClick={() => replyToMessage(message.id, replyDrafts[message.id] ?? "", message.status)}
                >
                  Save response
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
