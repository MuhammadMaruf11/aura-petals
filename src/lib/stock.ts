/**
 * Determines whether a product/variant is out of stock, given the same
 * three fields every stock check in the app already has available:
 * `stock`, `allowBackorder`, and `trackInventory`.
 *
 * `trackInventory: false` means this product's stock isn't meaningfully
 * tracked (e.g. made-to-order with no fixed count) — it was already a
 * field on the schema and the admin form, but no stock check anywhere
 * actually read it, so a product with trackInventory off but stock left
 * at its default of 0 was incorrectly treated as out of stock everywhere.
 *
 * A pure function (no server-only imports) so it can be called identically
 * from client display code (product cards, PDP, cart) and from the
 * server-side enforcement in cart/order services — one formula, not two
 * that could drift apart.
 */
export function isOutOfStock(item: {
  stock: number;
  allowBackorder: boolean;
  trackInventory: boolean;
}): boolean {
  if (!item.trackInventory) return false;
  if (item.allowBackorder) return false;
  return item.stock <= 0;
}

/** The largest quantity that can currently be added/set for this item. */
export function maxOrderableQuantity(item: {
  stock: number;
  allowBackorder: boolean;
  trackInventory: boolean;
}): number {
  if (!item.trackInventory || item.allowBackorder) return Infinity;
  return Math.max(item.stock, 0);
}
