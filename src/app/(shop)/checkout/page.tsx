import type { Metadata } from "next";
import { CheckoutForm } from "@/features/checkout/checkout-form";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="container-boutique py-12">
      <h1 className="mb-8 font-heading text-3xl">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
