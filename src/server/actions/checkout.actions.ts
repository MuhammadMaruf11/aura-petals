"use server";

import { getSession } from "@/lib/auth/current-user";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations/checkout";
import { placeOrder } from "@/server/services/order.service";
import { validateCoupon } from "@/server/services/coupon.service";
import { getCurrentCartDTO } from "@/server/services/cart.service";
import { getAllDeliveryCharges } from "@/server/services/delivery.service";
import { trackServerEvent } from "@/lib/analytics/server-events";

export async function getDeliveryChargesAction() {
  return getAllDeliveryCharges();
}

export type CheckoutActionState =
  | { success: true; orderNumber: string }
  | { success: false; message: string };

export async function submitCheckout(input: CheckoutInput): Promise<CheckoutActionState> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please check the form for errors." };
  }

  try {
    const order = await placeOrder({
      email: parsed.data.email,
      phone: parsed.data.phone,
      shippingAddress: parsed.data.shippingAddress,
      billingAddress: parsed.data.billingAddress ?? null,
      billingSameAsShipping: parsed.data.billingSameAsShipping,
      paymentMethod: parsed.data.paymentMethod,
      deliveryZone: parsed.data.deliveryZone,
      couponCode: parsed.data.couponCode || null,
      customerNote: parsed.data.customerNote || null,
    });

    await trackServerEvent("Purchase", {
      value: Number(order.total),
      currency: order.currency,
      content_ids: [order.id],
    });

    return { success: true, orderNumber: order.orderNumber };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Could not place your order.",
    };
  }
}

export async function checkCoupon(
  code: string,
): Promise<
  | { valid: true; discountAmount: number; type: "PERCENTAGE" | "FIXED"; value: number }
  | { valid: false; message: string }
> {
  const session = await getSession();
  const cart = await getCurrentCartDTO();
  const subtotal = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const result = await validateCoupon(code, subtotal, session?.sub ?? null);
  if (!result.valid) return result;

  return {
    valid: true,
    discountAmount: result.discountAmount,
    type: result.coupon.type,
    value: Number(result.coupon.value),
  };
}
