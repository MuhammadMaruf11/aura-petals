import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required"),
  phone: z.string().trim().min(6, "Enter a valid phone number"),
  line1: z.string().trim().min(3, "Address is required"),
  line2: z.string().trim().optional().or(z.literal("")),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().optional().or(z.literal("")),
  postalCode: z.string().trim().optional().or(z.literal("")),
  country: z.string().trim().min(2, "Country is required"),
});
export type AddressInput = z.infer<typeof addressSchema>;

export const checkoutSchema = z
  .object({
    email: z.email("Enter a valid email address"),
    phone: z.string().trim().min(6, "Enter a valid phone number"),
    shippingAddress: addressSchema,
    billingSameAsShipping: z.boolean(),
    billingAddress: addressSchema.optional(),
    paymentMethod: z.enum(["COD", "STRIPE", "SSLCOMMERZ"]),
    deliveryZone: z.enum(["DHAKA_CITY", "OUTSIDE_DHAKA", "OTHER"]),
    couponCode: z.string().trim().optional().or(z.literal("")),
    customerNote: z.string().trim().max(500).optional().or(z.literal("")),
  })
  .refine((data) => data.billingSameAsShipping || !!data.billingAddress, {
    message: "Billing address is required",
    path: ["billingAddress"],
  });
export type CheckoutInput = z.infer<typeof checkoutSchema>;
