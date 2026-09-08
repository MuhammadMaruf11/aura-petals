"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  updateOrderStatusAction,
  updateOrderTrackingAction,
  updatePaymentStatusAction,
  updateOrderAdminNoteAction,
} from "@/server/actions/admin-order.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Order, OrderStatus, PaymentStatus } from "@prisma/client";

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED",
  "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "FAILED_DELIVERY",
  "RETURN_REQUESTED", "RETURNED", "REFUND_REQUESTED", "REFUNDED",
];
const PAYMENT_STATUSES: PaymentStatus[] = [
  "UNPAID", "PENDING", "PAID", "FAILED", "REFUNDED", "PARTIALLY_REFUNDED",
];

export function AdminOrderControls({ order }: { order: Order }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [statusNote, setStatusNote] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(order.paymentStatus);
  const [courierName, setCourierName] = useState(order.courierName ?? "");
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber ?? "");
  const [trackingUrl, setTrackingUrl] = useState(order.trackingUrl ?? "");
  const [adminNote, setAdminNote] = useState(order.adminNote ?? "");

  function handleStatusUpdate() {
    startTransition(async () => {
      await updateOrderStatusAction(order.id, status, statusNote || undefined);
      toast.success("Order status updated");
      setStatusNote("");
      router.refresh();
    });
  }

  function handlePaymentUpdate() {
    startTransition(async () => {
      await updatePaymentStatusAction(order.id, paymentStatus);
      toast.success("Payment status updated");
      router.refresh();
    });
  }

  function handleTrackingUpdate() {
    startTransition(async () => {
      await updateOrderTrackingAction(order.id, { courierName, trackingNumber, trackingUrl });
      toast.success("Tracking info updated");
      router.refresh();
    });
  }

  function handleNoteUpdate() {
    startTransition(async () => {
      await updateOrderAdminNoteAction(order.id, adminNote);
      toast.success("Note saved");
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>Order status</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Select value={status} onValueChange={(v) => setStatus(v as OrderStatus)}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {ORDER_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s.replaceAll("_", " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Note for this status change (optional)"
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
          />
          <Button onClick={handleStatusUpdate} disabled={isPending} className="w-full">
            Update status
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Payment</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Select value={paymentStatus} onValueChange={(v) => setPaymentStatus(v as PaymentStatus)}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PAYMENT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s.replaceAll("_", " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handlePaymentUpdate} disabled={isPending} variant="outline" className="w-full">
            Update payment status
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Tracking</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Courier name" value={courierName} onChange={(e) => setCourierName(e.target.value)} />
          <Input placeholder="Tracking number" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} />
          <Input placeholder="Tracking URL" value={trackingUrl} onChange={(e) => setTrackingUrl(e.target.value)} />
          <Button onClick={handleTrackingUpdate} disabled={isPending} variant="outline" className="w-full">
            Save tracking info
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Internal note</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} rows={3} />
          <Button onClick={handleNoteUpdate} disabled={isPending} variant="outline" className="w-full">
            Save note
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
