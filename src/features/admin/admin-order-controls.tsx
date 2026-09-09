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
import type { Order, OrderStatus, PaymentStatus } from "@prisma/client";
import { RefreshCw, CreditCard, Truck, FileText } from "lucide-react";

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "FAILED_DELIVERY",
  "RETURN_REQUESTED",
  "RETURNED",
  "REFUND_REQUESTED",
  "REFUNDED",
];
const PAYMENT_STATUSES: PaymentStatus[] = [
  "UNPAID",
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
];

export function AdminOrderControls({ order }: { order: Order }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [statusNote, setStatusNote] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    order.paymentStatus,
  );
  const [courierName, setCourierName] = useState(order.courierName ?? "");
  const [trackingNumber, setTrackingNumber] = useState(
    order.trackingNumber ?? "",
  );
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
      await updateOrderTrackingAction(order.id, {
        courierName,
        trackingNumber,
        trackingUrl,
      });
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
    <div className="space-y-6 sticky top-6">
      {/* Order Status Control */}
      <div className="bg-white border border-border/60 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
          <RefreshCw className="size-4 text-primary" /> Order Status
        </h3>
        <div className="space-y-3">
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as OrderStatus)}
          >
            <SelectTrigger className="w-full h-11 rounded-2xl bg-white border-border/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              {ORDER_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s.replaceAll("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Status note (optional)"
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            className="h-11 rounded-2xl bg-white border-border/60 text-sm"
          />
          <Button
            onClick={handleStatusUpdate}
            disabled={isPending}
            className="w-full rounded-full h-11 font-medium shadow-xs"
          >
            Update status
          </Button>
        </div>
      </div>

      {/* Payment Control */}
      <div className="bg-white border border-border/60 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
          <CreditCard className="size-4 text-primary" /> Payment Status
        </h3>
        <div className="space-y-3">
          <Select
            value={paymentStatus}
            onValueChange={(v) => setPaymentStatus(v as PaymentStatus)}
          >
            <SelectTrigger className="w-full h-11 rounded-2xl bg-white border-border/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              {PAYMENT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s.replaceAll("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handlePaymentUpdate}
            disabled={isPending}
            variant="outline"
            className="w-full rounded-full h-11 border-border/60 font-medium"
          >
            Update payment status
          </Button>
        </div>
      </div>

      {/* Tracking Control */}
      <div className="bg-white border border-border/60 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
          <Truck className="size-4 text-primary" /> Tracking Info
        </h3>
        <div className="space-y-3">
          <Input
            placeholder="Courier name"
            value={courierName}
            onChange={(e) => setCourierName(e.target.value)}
            className="h-11 rounded-2xl bg-white border-border/60 text-sm"
          />
          <Input
            placeholder="Tracking number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="h-11 rounded-2xl bg-white border-border/60 text-sm"
          />
          <Input
            placeholder="Tracking URL"
            value={trackingUrl}
            onChange={(e) => setTrackingUrl(e.target.value)}
            className="h-11 rounded-2xl bg-white border-border/60 text-sm"
          />
          <Button
            onClick={handleTrackingUpdate}
            disabled={isPending}
            variant="outline"
            className="w-full rounded-full h-11 border-border/60 font-medium"
          >
            Save tracking info
          </Button>
        </div>
      </div>

      {/* Internal Note Control */}
      <div className="bg-white border border-border/60 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
          <FileText className="size-4 text-primary" /> Internal Note
        </h3>
        <div className="space-y-3">
          <Textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            rows={3}
            placeholder="Add internal notes about this order..."
            className="rounded-2xl bg-white border-border/60 text-sm p-3 resize-none"
          />
          <Button
            onClick={handleNoteUpdate}
            disabled={isPending}
            variant="outline"
            className="w-full rounded-full h-11 border-border/60 font-medium"
          >
            Save note
          </Button>
        </div>
      </div>
    </div>
  );
}
