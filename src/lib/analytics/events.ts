"use client";

import { pushToDataLayer } from "@/lib/analytics/gtm";
import { firePixelEvent } from "@/lib/analytics/meta-pixel";

type ProductLike = {
  id: string;
  name: string;
  price: number;
  currency?: string;
};

/**
 * The only module the rest of the app should call into for tracking.
 * Every function fires both GTM (dataLayer) and Meta Pixel events with
 * consistent shapes, so product code never touches gtag/fbq directly.
 */

export function trackPageView() {
  pushToDataLayer({ event: "page_view" });
  firePixelEvent("PageView");
}

export function trackViewContent(product: ProductLike) {
  pushToDataLayer({
    event: "view_item",
    ecommerce: {
      currency: product.currency ?? "USD",
      value: product.price,
      items: [{ item_id: product.id, item_name: product.name, price: product.price }],
    },
  });
  firePixelEvent("ViewContent", {
    content_ids: [product.id],
    content_name: product.name,
    content_type: "product",
    value: product.price,
    currency: product.currency ?? "USD",
  });
}

export function trackSearch(query: string) {
  pushToDataLayer({ event: "search", search_term: query });
  firePixelEvent("Search", { search_string: query });
}

export function trackAddToCart(product: ProductLike, quantity: number) {
  pushToDataLayer({
    event: "add_to_cart",
    ecommerce: {
      currency: product.currency ?? "USD",
      value: product.price * quantity,
      items: [
        { item_id: product.id, item_name: product.name, price: product.price, quantity },
      ],
    },
  });
  firePixelEvent("AddToCart", {
    content_ids: [product.id],
    content_name: product.name,
    content_type: "product",
    value: product.price * quantity,
    currency: product.currency ?? "USD",
  });
}

export function trackAddToWishlist(product: ProductLike) {
  pushToDataLayer({
    event: "add_to_wishlist",
    ecommerce: { items: [{ item_id: product.id, item_name: product.name }] },
  });
  firePixelEvent("AddToWishlist", {
    content_ids: [product.id],
    content_name: product.name,
    value: product.price,
    currency: product.currency ?? "USD",
  });
}

export function trackInitiateCheckout(items: ProductLike[], value: number, currency = "USD") {
  pushToDataLayer({
    event: "begin_checkout",
    ecommerce: {
      currency,
      value,
      items: items.map((p) => ({ item_id: p.id, item_name: p.name, price: p.price })),
    },
  });
  firePixelEvent("InitiateCheckout", {
    content_ids: items.map((p) => p.id),
    value,
    currency,
    num_items: items.length,
  });
}

export function trackAddPaymentInfo(paymentMethod: string) {
  pushToDataLayer({ event: "add_payment_info", payment_type: paymentMethod });
  firePixelEvent("AddPaymentInfo");
}

export function trackPurchase(orderId: string, value: number, currency = "USD") {
  pushToDataLayer({
    event: "purchase",
    ecommerce: { transaction_id: orderId, value, currency },
  });
  firePixelEvent("Purchase", { content_ids: [orderId], value, currency });
}
