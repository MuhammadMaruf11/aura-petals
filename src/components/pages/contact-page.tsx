"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, MailCheck, MessageCircleMore } from "lucide-react";

import { MetricCard, Panel, SectionHeading } from "@/components/platform/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/platform";
import { useMounted } from "@/hooks/use-mounted";
import { usePlatformStore } from "@/store/usePlatformStore";

export default function ContactPageClient() {
  const mounted = useMounted();
  const messages = usePlatformStore((state) => state.messages);
  const addMessage = usePlatformStore((state) => state.addMessage);

  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const latestMessage = useMemo(() => messages[0], [messages]);

  if (!mounted) {
    return <div className="min-h-[50vh] bg-background" />;
  }

  return (
    <div className="bg-background py-16">
      <div className="container mx-auto space-y-10 px-4">
        <SectionHeading
          eyebrow="Contact"
          title="Send a message that routes directly to the SME admin board."
          description="The system design calls for a storefront contact page tied to the admin panel. This page writes into the shared message store that the admin dashboard also reads."
        />

        <div className="grid gap-5 md:grid-cols-3">
          <MetricCard label="Open routing" value="Shared inbox" helper="Contact submissions are visible in admin immediately." />
          <MetricCard label="Response states" value="3 stages" helper="New, in progress, and resolved workflows are available." />
          <MetricCard label="Admin handoff" value="Direct" helper="No separate CRM layer is required for the mock flow." />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <Panel title="Customer enquiry form" subtitle="Use this form to create a new admin message board entry.">
            <div className="grid gap-4">
              <label className="space-y-2 text-sm font-medium">
                Name
                <Input value={customerName} onChange={(event) => setCustomerName(event.target.value)} className="h-11 rounded-full" />
              </label>
              <label className="space-y-2 text-sm font-medium">
                Email
                <Input value={email} onChange={(event) => setEmail(event.target.value)} className="h-11 rounded-full" />
              </label>
              <label className="space-y-2 text-sm font-medium">
                Phone
                <Input value={phone} onChange={(event) => setPhone(event.target.value)} className="h-11 rounded-full" />
              </label>
              <label className="space-y-2 text-sm font-medium">
                Subject
                <Input value={subject} onChange={(event) => setSubject(event.target.value)} className="h-11 rounded-full" />
              </label>
              <label className="space-y-2 text-sm font-medium">
                Message
                <textarea
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  className="min-h-36 w-full rounded-[28px] border border-border bg-background px-4 py-3 text-sm outline-none"
                />
              </label>
              <Button
                className="h-11 rounded-full"
                onClick={() => {
                  if (!customerName || !email || !subject || !body) return;
                  addMessage({ customerName, email, phone, subject, body });
                  setSubmitted(true);
                  setCustomerName("");
                  setEmail("");
                  setPhone("");
                  setSubject("");
                  setBody("");
                }}
              >
                Send to admin board
              </Button>
              {submitted ? (
                <div className="rounded-3xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
                  Message sent. The SME admin board now has a fresh enquiry entry.
                </div>
              ) : null}
            </div>
          </Panel>

          <div className="space-y-6">
            <Panel
              title="Latest admin-routed message"
              subtitle="This preview reflects the same data used in the admin dashboard."
              badge={latestMessage?.status ?? "empty"}
            >
              {latestMessage ? (
                <div className="space-y-4 text-sm text-muted-foreground">
                  <div>
                    <p className="font-semibold text-foreground">{latestMessage.subject}</p>
                    <p>{latestMessage.customerName}</p>
                    <p>{formatDate(latestMessage.receivedAt)}</p>
                  </div>
                  <p>{latestMessage.body}</p>
                  {latestMessage.reply ? (
                    <div className="rounded-3xl bg-muted/55 p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-secondary">Admin reply</p>
                      <p className="mt-2">{latestMessage.reply}</p>
                    </div>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No messages yet.</p>
              )}
            </Panel>

            <Panel title="Why this matters" subtitle="The storefront and admin panel remain connected at the UX layer.">
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <MessageCircleMore className="mt-0.5 size-4 text-secondary" />
                  <p>Customers submit enquiries from the public site.</p>
                </div>
                <div className="flex items-start gap-3">
                  <MailCheck className="mt-0.5 size-4 text-secondary" />
                  <p>Admins can view, update status, and reply from the private dashboard.</p>
                </div>
                <div className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 size-4 text-secondary" />
                  <p>That interaction is already modelled and ready for a Supabase table later.</p>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}
