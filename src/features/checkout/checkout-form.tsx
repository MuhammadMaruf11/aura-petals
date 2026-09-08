"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations/checkout";
import { checkCoupon, submitCheckout, getDeliveryChargesAction } from "@/server/actions/checkout.actions";
import { useCart } from "@/features/cart/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formatPrice } from "@/lib/utils";
import { trackAddPaymentInfo, trackInitiateCheckout } from "@/lib/analytics/events";
import { DELIVERY_ZONE_LABELS } from "@/lib/delivery-zones";

const emptyAddress = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "BD",
};

export function CheckoutForm() {
  const router = useRouter();
  const { data: cart } = useCart();
  const { data: deliveryCharges } = useQuery({
    queryKey: ["delivery-charges"],
    queryFn: () => getDeliveryChargesAction(),
  });
  const [isPending, startTransition] = useTransition();
  const [couponState, setCouponState] = useState<
    { code: string; discountAmount: number } | null
  >(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  const items = cart?.items ?? [];
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discount = couponState?.discountAmount ?? 0;

  const form = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      phone: "",
      shippingAddress: emptyAddress,
      billingSameAsShipping: true,
      paymentMethod: "COD",
      deliveryZone: "DHAKA_CITY",
      couponCode: "",
      customerNote: "",
    },
  });

  const billingSameAsShipping = form.watch("billingSameAsShipping");
  const paymentMethod = form.watch("paymentMethod");
  const deliveryZone = form.watch("deliveryZone");
  const deliveryCharge = deliveryCharges?.[deliveryZone] ?? 0;
  const estimatedTotal = Math.max(subtotal - discount, 0) + deliveryCharge;

  useEffect(() => {
    trackAddPaymentInfo(paymentMethod);
  }, [paymentMethod]);

  useEffect(() => {
    if (items.length > 0) {
      trackInitiateCheckout(
        items.map((i) => ({ id: i.productId, name: i.productName, price: i.unitPrice })),
        subtotal,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setCheckingCoupon(true);
    setCouponError(null);
    const result = await checkCoupon(couponInput);
    setCheckingCoupon(false);
    if (!result.valid) {
      setCouponError(result.message);
      setCouponState(null);
      return;
    }
    setCouponState({ code: couponInput.toUpperCase(), discountAmount: result.discountAmount });
    form.setValue("couponCode", couponInput);
    toast.success("Coupon applied");
  }

  function onSubmit(values: CheckoutInput) {
    startTransition(async () => {
      const result = await submitCheckout(values);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      router.push(`/checkout/confirmation/${result.orderNumber}`);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className="space-y-4">
            <h2 className="font-heading text-xl">Contact information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading text-xl">Shipping address</h2>
            <AddressFields namePrefix="shippingAddress" />
          </section>

          <section className="space-y-4">
            <h2 className="font-heading text-xl">Delivery zone</h2>
            <FormField
              control={form.control}
              name="deliveryZone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(DELIVERY_ZONE_LABELS) as (keyof typeof DELIVERY_ZONE_LABELS)[]).map(
                          (zone) => (
                            <SelectItem key={zone} value={zone}>
                              {DELIVERY_ZONE_LABELS[zone]}
                              {deliveryCharges ? ` — ${formatPrice(deliveryCharges[zone])}` : ""}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <section className="space-y-3">
            <FormField
              control={form.control}
              name="billingSameAsShipping"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="font-normal">Billing address is the same as shipping</FormLabel>
                </FormItem>
              )}
            />
            {!billingSameAsShipping && (
              <div className="space-y-4 pt-2">
                <h3 className="font-heading text-lg">Billing address</h3>
                <AddressFields namePrefix="billingAddress" />
              </div>
            )}
          </section>

          <section className="space-y-4">
            <h2 className="font-heading text-xl">Payment method</h2>
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-3 rounded-lg border border-primary bg-primary/5 p-4">
                      <input type="hidden" {...field} value="COD" />
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-primary">
                        <span className="size-2.5 rounded-full bg-primary" />
                      </span>
                      <div>
                        <p className="text-sm font-medium">Cash on Delivery</p>
                        <p className="text-xs text-muted-foreground">
                          Pay in cash when your order arrives.
                        </p>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <section className="space-y-2">
            <FormField
              control={form.control}
              name="customerNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Delivery instructions, gift notes, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>
        </div>

        <div className="h-fit space-y-4 rounded-2xl border border-border/70 bg-card p-6">
          <h2 className="font-heading text-lg">Order summary</h2>
          <div className="max-h-64 space-y-3 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.productName} × {item.quantity}
                </span>
                <span>{formatPrice(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Coupon code"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
            />
            <Button type="button" variant="outline" onClick={handleApplyCoupon} disabled={checkingCoupon}>
              Apply
            </Button>
          </div>
          {couponError && <p className="text-sm text-destructive">{couponError}</p>}
          {couponState && (
            <p className="text-sm text-success">
              Coupon {couponState.code} applied: -{formatPrice(couponState.discountAmount)}
            </p>
          )}

          <div className="space-y-1 border-t border-border/70 pt-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery ({DELIVERY_ZONE_LABELS[deliveryZone]})</span>
              <span>{formatPrice(deliveryCharge)}</span>
            </div>
          </div>
          <div className="flex justify-between border-t border-border/70 pt-3 text-base font-medium">
            <span>Estimated total</span>
            <span>{formatPrice(estimatedTotal)}</span>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isPending || items.length === 0}>
            {isPending ? "Placing order…" : "Place order"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function AddressFields({ namePrefix }: { namePrefix: "shippingAddress" | "billingAddress" }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField
        name={`${namePrefix}.fullName`}
        render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel>Full name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name={`${namePrefix}.phone`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Input type="tel" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name={`${namePrefix}.country`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name={`${namePrefix}.line1`}
        render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel>Address line 1</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name={`${namePrefix}.line2`}
        render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel>Address line 2 (optional)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name={`${namePrefix}.city`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name={`${namePrefix}.state`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>State / Province (optional)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name={`${namePrefix}.postalCode`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Postal code (optional)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
