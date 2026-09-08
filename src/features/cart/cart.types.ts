export type CartItemDTO = {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  image: string | null;
  variantId: string | null;
  variantName: string | null;
  unitPrice: number;
  quantity: number;
  stock: number;
  allowBackorder: boolean;
  trackInventory: boolean;
  customization: Record<string, unknown> | null;
};

export type CartDTO = {
  id: string;
  items: CartItemDTO[];
};
