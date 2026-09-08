import "server-only";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/current-user";
import { getOrCreateCartForCurrentVisitor } from "@/server/services/cart.service";
import { validateCoupon } from "@/server/services/coupon.service";
import { getDeliveryCharge } from "@/server/services/delivery.service";
import { maxOrderableQuantity } from "@/lib/stock";
import type { OrderStatus, PaymentMethod, DeliveryZone, Prisma } from "@prisma/client";

export type CheckoutAddressInput = {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
};

export type PlaceOrderInput = {
  email: string;
  phone: string;
  shippingAddress: CheckoutAddressInput;
  billingAddress?: CheckoutAddressInput | null;
  billingSameAsShipping: boolean;
  paymentMethod: PaymentMethod;
  deliveryZone: DeliveryZone;
  couponCode?: string | null;
  customerNote?: string | null;
  saveAddressId?: string | null; // if the user selected a saved address instead of typing a new one
};

async function generateOrderNumber(): Promise<string> {
  const date = new Date();
  const prefix = `AP-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;
  // count today's orders to build a readable, roughly-sequential suffix
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const countToday = await prisma.order.count({ where: { createdAt: { gte: startOfDay } } });
  const suffix = String(countToday + 1).padStart(4, "0");
  return `${prefix}-${suffix}`;
}

async function getStoreSettingsOrDefaults() {
  const settings = await prisma.storeSettings.findUnique({ where: { id: "singleton" } });
  return (
    settings ?? {
      shippingFlatRate: 0 as unknown as Prisma.Decimal,
      freeShippingThreshold: null,
      taxRatePercent: 0 as unknown as Prisma.Decimal,
      currencyCode: "USD",
    }
  );
}

export async function placeOrder(input: PlaceOrderInput) {
  const session = await getSession();
  const cart = await getOrCreateCartForCurrentVisitor();

  const cartItems = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
    include: {
      product: { include: { images: { where: { isMain: true }, take: 1 } } },
      variant: true,
    },
  });

  if (cartItems.length === 0) {
    throw new Error("Your bag is empty.");
  }

  // Re-validate stock at checkout time to avoid overselling.
  for (const item of cartItems) {
    const stock = item.variant ? item.variant.stock : item.product.stock;
    const allowBackorder = item.variant
      ? item.variant.allowBackorder
      : item.product.allowBackorder;
    const maxQuantity = maxOrderableQuantity({
      stock,
      allowBackorder,
      trackInventory: item.product.trackInventory,
    });
    if (item.quantity > maxQuantity) {
      throw new Error(`"${item.product.name}" only has ${stock} left in stock.`);
    }
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.variant ? Number(item.variant.price) : Number(item.product.price);
    return sum + price * item.quantity;
  }, 0);

  const settings = await getStoreSettingsOrDefaults();

  let discountTotal = 0;
  let couponId: string | null = null;
  if (input.couponCode) {
    const result = await validateCoupon(input.couponCode, subtotal, session?.sub ?? null);
    if (!result.valid) {
      throw new Error(result.message);
    }
    discountTotal = result.discountAmount;
    couponId = result.coupon.id;
  }

  const freeShippingThreshold = settings.freeShippingThreshold
    ? Number(settings.freeShippingThreshold)
    : null;
  const zoneDeliveryCharge = await getDeliveryCharge(input.deliveryZone);
  const shippingTotal =
    freeShippingThreshold !== null && subtotal - discountTotal >= freeShippingThreshold
      ? 0
      : zoneDeliveryCharge;

  const taxableAmount = Math.max(subtotal - discountTotal, 0);
  const taxTotal =
    Math.round(taxableAmount * (Number(settings.taxRatePercent) / 100) * 100) / 100;

  const total = Math.max(subtotal - discountTotal + shippingTotal + taxTotal, 0);

  const shippingSnapshot = input.shippingAddress;
  const billingSnapshot = input.billingSameAsShipping
    ? input.shippingAddress
    : input.billingAddress ?? input.shippingAddress;

  const orderNumber = await generateOrderNumber();

  const order = await prisma.$transaction(async (tx) => {
    let shippingAddressId: string | null = null;
    let billingAddressId: string | null = null;

    if (session) {
      const savedShipping = await tx.address.create({
        data: {
          userId: session.sub,
          type: "SHIPPING",
          ...shippingAddressToRecord(input.shippingAddress),
        },
      });
      shippingAddressId = savedShipping.id;

      if (!input.billingSameAsShipping && input.billingAddress) {
        const savedBilling = await tx.address.create({
          data: {
            userId: session.sub,
            type: "BILLING",
            ...shippingAddressToRecord(input.billingAddress),
          },
        });
        billingAddressId = savedBilling.id;
      } else {
        billingAddressId = savedShipping.id;
      }
    }

    const createdOrder = await tx.order.create({
      data: {
        orderNumber,
        userId: session?.sub ?? null,
        email: input.email,
        phone: input.phone,
        status: "PENDING",
        paymentStatus: input.paymentMethod === "COD" ? "UNPAID" : "PENDING",
        paymentMethod: input.paymentMethod,
        shippingAddressId,
        billingAddressId,
        shippingSnapshot,
        billingSnapshot,
        subtotal,
        discountTotal,
        shippingTotal,
        deliveryZone: input.deliveryZone,
        taxTotal,
        total,
        currency: settings.currencyCode,
        couponId,
        customerNote: input.customerNote ?? null,
        items: {
          create: cartItems.map((item) => {
            const unitPrice = item.variant
              ? Number(item.variant.price)
              : Number(item.product.price);
            const snapshotImageUrl = item.variant?.image ?? item.product.images[0]?.url ?? null;
            return {
              productId: item.productId,
              variantId: item.variantId,
              productName: item.product.name,
              variantName: item.variant?.name ?? null,
              imageUrl: snapshotImageUrl,
              unitPrice,
              quantity: item.quantity,
              lineTotal: unitPrice * item.quantity,
              customization: item.customization ?? undefined,
            };
          }),
        },
        trackingEvents: {
          create: { status: "PENDING", note: "Order placed" },
        },
      },
    });

    // Decrement stock
    for (const item of cartItems) {
      if (item.variantId) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      } else {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    if (couponId) {
      await tx.coupon.update({ where: { id: couponId }, data: { usageCount: { increment: 1 } } });
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return createdOrder;
  });

  return order;
}

function shippingAddressToRecord(address: CheckoutAddressInput) {
  return {
    fullName: address.fullName,
    phone: address.phone,
    line1: address.line1,
    line2: address.line2 || null,
    city: address.city,
    state: address.state || null,
    postalCode: address.postalCode || null,
    country: address.country,
  };
}

const orderDetailInclude = {
  items: { include: { product: { include: { images: { where: { isMain: true }, take: 1 } } } } },
  trackingEvents: { orderBy: { createdAt: "asc" as const } },
  shippingAddress: true,
  billingAddress: true,
  coupon: true,
} satisfies Prisma.OrderInclude;

export type OrderDetailData = Prisma.OrderGetPayload<{ include: typeof orderDetailInclude }>;

export async function getOrderByNumberForCurrentUser(orderNumber: string) {
  const session = await getSession();
  return prisma.order.findFirst({
    where: {
      orderNumber,
      ...(session ? { userId: session.sub } : {}),
    },
    include: orderDetailInclude,
  });
}

export async function getOrdersForCurrentUser() {
  const session = await getSession();
  if (!session) return [];
  return prisma.order.findMany({
    where: { userId: session.sub },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
}

export async function adminListOrders(params: { status?: OrderStatus; search?: string; page?: number; pageSize?: number }) {
  const { status, search, page = 1, pageSize = 20 } = params;
  const where: Prisma.OrderWhereInput = {
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { orderNumber: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { items: true, user: true },
    }),
    prisma.order.count({ where }),
  ]);

  return { items, total, page, pageCount: Math.ceil(total / pageSize) };
}

export async function adminGetOrderById(id: string) {
  return prisma.order.findUnique({ where: { id }, include: orderDetailInclude });
}

// ---- Admin-facing order management ----

export async function adminUpdateOrderStatus(
  orderId: string,
  status: OrderStatus,
  note?: string,
) {
  return prisma.$transaction([
    prisma.order.update({ where: { id: orderId }, data: { status } }),
    prisma.orderTrackingEvent.create({ data: { orderId, status, note } }),
  ]);
}

export async function adminUpdateTrackingInfo(
  orderId: string,
  data: { courierName?: string; trackingNumber?: string; trackingUrl?: string },
) {
  return prisma.order.update({ where: { id: orderId }, data });
}
