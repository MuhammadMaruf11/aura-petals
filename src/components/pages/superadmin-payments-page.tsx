"use client";

import { useState } from "react";

import { Panel, SectionHeading } from "@/components/platform/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate, formatPrice } from "@/lib/platform";
import { usePlatformStore } from "@/store/usePlatformStore";

export default function SuperAdminPaymentsPage() {
  const payments = usePlatformStore((state) => state.payments);
  const addPayment = usePlatformStore((state) => state.addPayment);
  const updatePaymentStatus = usePlatformStore((state) => state.updatePaymentStatus);

  const [tenantName, setTenantName] = useState("");
  const [planName, setPlanName] = useState("");
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState<"bKash" | "Nagad">("bKash");
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [note, setNote] = useState("");

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Payments"
        title="Record and verify manual bKash and Nagad subscription payments."
        description="This page handles the manual regional payment processing requirement for the SaaS owner."
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel title="New payment record" subtitle="Store a manual payment submission for later verification.">
          <div className="grid gap-4">
            <label className="space-y-2 text-sm font-medium">
              Tenant name
              <Input value={tenantName} onChange={(event) => setTenantName(event.target.value)} className="h-11 rounded-full" />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Plan name
              <Input value={planName} onChange={(event) => setPlanName(event.target.value)} className="h-11 rounded-full" />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Amount
              <Input
                type="number"
                value={amount}
                onChange={(event) => setAmount(Number(event.target.value) || 0)}
                className="h-11 rounded-full"
              />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Method
              <select
                value={method}
                onChange={(event) => setMethod(event.target.value as typeof method)}
                className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none"
              >
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium">
              Sender number
              <Input value={senderNumber} onChange={(event) => setSenderNumber(event.target.value)} className="h-11 rounded-full" />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Transaction ID
              <Input value={transactionId} onChange={(event) => setTransactionId(event.target.value)} className="h-11 rounded-full" />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Note
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className="min-h-28 w-full rounded-[28px] border border-border bg-background px-4 py-3 text-sm outline-none"
              />
            </label>
            <Button
              className="rounded-full px-5"
              onClick={() => {
                addPayment({
                  tenantName,
                  planName,
                  amount,
                  method,
                  senderNumber,
                  transactionId,
                  note,
                });
                setTenantName("");
                setPlanName("");
                setAmount(0);
                setMethod("bKash");
                setSenderNumber("");
                setTransactionId("");
                setNote("");
              }}
            >
              Add payment record
            </Button>
          </div>
        </Panel>

        <Panel title="Verification queue" subtitle="Pending, verified, and flagged payments remain visible to the SaaS owner.">
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="rounded-[28px] border border-border/70 bg-muted/35 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{payment.tenantName}</p>
                    <p className="text-sm text-muted-foreground">
                      {payment.planName} • {payment.method} • {payment.senderNumber}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {payment.transactionId} • {formatDate(payment.submittedAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary">{formatPrice(payment.amount)}</p>
                    <p className="text-xs uppercase tracking-[0.22em] text-secondary">{payment.status}</p>
                  </div>
                </div>

                <p className="mt-3 text-sm text-muted-foreground">{payment.note}</p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    className="rounded-full px-4"
                    onClick={() => updatePaymentStatus(payment.id, "verified")}
                  >
                    Verify
                  </Button>
                  <Button
                    variant="secondary"
                    className="rounded-full px-4"
                    onClick={() => updatePaymentStatus(payment.id, "pending")}
                  >
                    Mark pending
                  </Button>
                  <Button
                    variant="ghost"
                    className="rounded-full px-4 text-red-700 hover:text-red-700"
                    onClick={() => updatePaymentStatus(payment.id, "flagged", "Needs manual fraud review or confirmation.")}
                  >
                    Flag
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
