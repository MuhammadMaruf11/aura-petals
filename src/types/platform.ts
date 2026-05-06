export type ProductTier = "elite" | "average";

export type ProductCategory =
  | "elite"
  | "petals"
  | "crafts"
  | "budget"
  | "wellness";

export type MessageStatus = "new" | "in_progress" | "resolved";
export type SubscriptionStatus = "trial" | "active" | "paused" | "disabled";
export type PaymentStatus = "pending" | "verified" | "flagged";
export type PaymentMethod = "bKash" | "Nagad";

export interface Category {
  id: string;
  name: string;
  slug: ProductCategory;
  description: string;
  image: string;
  countLabel: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  image_url: string;
  images: string[];
  videoUrl?: string;
  tier: ProductTier;
  category: ProductCategory;
  featured: boolean;
  stock: number;
  status: "active" | "draft";
  tags: string[];
  specs: ProductSpec[];
  createdAt: string;
  updatedAt: string;
}

export interface TenantBranding {
  businessName: string;
  tagline: string;
  logoUrl: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
}

export interface ContactMessage {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  subject: string;
  body: string;
  status: MessageStatus;
  receivedAt: string;
  source: "contact-page";
  reply?: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  placedAt: string;
  status: "processing" | "shipped" | "delivered";
  total: number;
  items: OrderItem[];
}

export interface CustomerProfile {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  memberSince: string;
  orderHistory: Order[];
}

export interface AuthSession {
  isAuthenticated: boolean;
  role: "guest" | "customer" | "admin" | "super_admin";
}

export interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  productLimit: number;
  automationQuota: number;
  teamSeats: number;
  features: string[];
}

export interface TenantSubscription {
  id: string;
  tenantName: string;
  ownerName: string;
  planId: string;
  status: SubscriptionStatus;
  storefrontEnabled: boolean;
  renewalDate: string;
  productLimit: number;
  automationQuota: number;
}

export interface PaymentRecord {
  id: string;
  tenantName: string;
  planName: string;
  amount: number;
  method: PaymentMethod;
  senderNumber: string;
  transactionId: string;
  submittedAt: string;
  status: PaymentStatus;
  note: string;
}

export interface AutomationRule {
  id: string;
  title: string;
  trigger: string;
  channels: string[];
  exclusions?: string[];
  note: string;
}

export interface AutomationEvent {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  type: "publish" | "cleanup" | "payment" | "message";
}

export interface ProductDraft {
  title: string;
  subtitle: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  videoUrl?: string;
  tier: ProductTier;
  category: ProductCategory;
  featured: boolean;
  stock: number;
  status: "active" | "draft";
  tags: string[];
  specs: ProductSpec[];
}
