"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  automationRules,
  defaultBranding,
  seedAutomationEvents,
  seedMessages,
  seedPayments,
  seedPlans,
  seedProducts,
  seedProfile,
  seedSubscriptions,
} from "@/data/platform";
import type {
  AutomationEvent,
  AuthSession,
  ContactMessage,
  CustomerProfile,
  PaymentRecord,
  PricingPlan,
  Product,
  ProductDraft,
  TenantBranding,
  TenantSubscription,
} from "@/types/platform";

type PlatformState = {
  branding: TenantBranding;
  products: Product[];
  messages: ContactMessage[];
  profile: CustomerProfile;
  auth: AuthSession;
  plans: PricingPlan[];
  subscriptions: TenantSubscription[];
  payments: PaymentRecord[];
  automationEvents: typeof seedAutomationEvents;
  resetPlatform: () => void;
  setProducts: (products: Product[]) => void;
  updateBranding: (branding: Partial<TenantBranding>) => void;
  updateBrandColors: (colors: Partial<TenantBranding["colors"]>) => void;
  updateLogo: (logoUrl: string) => void;
  addProduct: (draft: ProductDraft) => void;
  updateProduct: (id: string, draft: ProductDraft) => void;
  deleteProduct: (id: string) => void;
  addMessage: (
    message: Omit<ContactMessage, "id" | "receivedAt" | "status" | "source">
  ) => void;
  replyToMessage: (id: string, reply: string, status: ContactMessage["status"]) => void;
  updatePlan: (id: string, updates: Partial<PricingPlan>) => void;
  updateSubscription: (id: string, updates: Partial<TenantSubscription>) => void;
  addPayment: (
    payment: Omit<PaymentRecord, "id" | "submittedAt" | "status">
  ) => void;
  updatePaymentStatus: (id: string, status: PaymentRecord["status"], note?: string) => void;
  login: (email: string) => void;
  logout: () => void;
  register: (profile: Pick<CustomerProfile, "fullName" | "email" | "phone" | "address">) => void;
  updateProfile: (updates: Partial<CustomerProfile>) => void;
};

const createInitialState = () => ({
  branding: defaultBranding,
  products: seedProducts,
  messages: seedMessages,
  profile: seedProfile,
  auth: {
    isAuthenticated: false,
    role: "guest" as const,
  },
  plans: seedPlans,
  subscriptions: seedSubscriptions,
  payments: seedPayments,
  automationEvents: seedAutomationEvents,
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeDraft = (draft: ProductDraft): ProductDraft => ({
  ...draft,
  images: draft.images.filter(Boolean),
  tags: draft.tags.filter(Boolean),
  specs: draft.specs.filter((spec) => spec.label && spec.value),
});

const createAutomationEvent = (
  event: Pick<AutomationEvent, "title" | "description" | "type">,
  createdAt: string
): AutomationEvent => ({
  id: crypto.randomUUID(),
  createdAt,
  ...event,
});

export const usePlatformStore = create<PlatformState>()(
  persist(
    (set) => ({
      ...createInitialState(),
      resetPlatform: () => set(createInitialState()),
      setProducts: (products) =>
        set(() => ({
          products,
        })),
      updateBranding: (branding) =>
        set((state) => ({
          branding: {
            ...state.branding,
            ...branding,
            colors: {
              ...state.branding.colors,
              ...branding.colors,
            },
          },
        })),
      updateBrandColors: (colors) =>
        set((state) => ({
          branding: {
            ...state.branding,
            colors: {
              ...state.branding.colors,
              ...colors,
            },
          },
        })),
      updateLogo: (logoUrl) =>
        set((state) => ({
          branding: {
            ...state.branding,
            logoUrl,
          },
        })),
      addProduct: (draft) =>
        set((state) => {
          const normalized = normalizeDraft(draft);
          const now = new Date().toISOString();
          const nextProduct: Product = {
            id: crypto.randomUUID(),
            slug: slugify(normalized.title),
            image_url: normalized.images[0] ?? state.products[0]?.image_url ?? "",
            createdAt: now,
            updatedAt: now,
            ...normalized,
          };

          return {
            products: [nextProduct, ...state.products],
            automationEvents: [
              createAutomationEvent(
                {
                title: "Webhook queued for publish",
                description: `${nextProduct.title} will sync to approved channels through Make.com.`,
                type: "publish",
                },
                now
              ),
              ...state.automationEvents,
            ].slice(0, 8),
          };
        }),
      updateProduct: (id, draft) =>
        set((state) => {
          const normalized = normalizeDraft(draft);
          const now = new Date().toISOString();
          const current = state.products.find((product) => product.id === id);
          if (!current) {
            return state;
          }

          return {
            products: state.products.map((product) =>
              product.id === id
                ? {
                    ...product,
                    ...normalized,
                    slug: slugify(normalized.title),
                    image_url: normalized.images[0] ?? product.image_url,
                    updatedAt: now,
                  }
                : product
            ),
            automationEvents: [
              createAutomationEvent(
                {
                title: "Cloudinary sync queued",
                description: `${current.title} media changes were staged for cleanup and republish.`,
                type: "cleanup",
                },
                now
              ),
              ...state.automationEvents,
            ].slice(0, 8),
          };
        }),
      deleteProduct: (id) =>
        set((state) => {
          const target = state.products.find((product) => product.id === id);
          if (!target) {
            return state;
          }

          const now = new Date().toISOString();
          return {
            products: state.products.filter((product) => product.id !== id),
            automationEvents: [
              createAutomationEvent(
                {
                title: "Product archived and media cleanup scheduled",
                description: `${target.title} was removed from the storefront and queued for Cloudinary cleanup.`,
                type: "cleanup",
                },
                now
              ),
              ...state.automationEvents,
            ].slice(0, 8),
          };
        }),
      addMessage: (message) =>
        set((state) => {
          const now = new Date().toISOString();
          return {
            messages: [
              {
                id: crypto.randomUUID(),
                status: "new",
                receivedAt: now,
                source: "contact-page",
                ...message,
              },
              ...state.messages,
            ],
            automationEvents: [
              createAutomationEvent(
                {
                title: "Contact form routed to admin inbox",
                description: `${message.subject} was added to the SME message board.`,
                type: "message",
                },
                now
              ),
              ...state.automationEvents,
            ].slice(0, 8),
          };
        }),
      replyToMessage: (id, reply, status) =>
        set((state) => ({
          messages: state.messages.map((message) =>
            message.id === id ? { ...message, reply, status } : message
          ),
        })),
      updatePlan: (id, updates) =>
        set((state) => ({
          plans: state.plans.map((plan) => (plan.id === id ? { ...plan, ...updates } : plan)),
        })),
      updateSubscription: (id, updates) =>
        set((state) => ({
          subscriptions: state.subscriptions.map((subscription) =>
            subscription.id === id ? { ...subscription, ...updates } : subscription
          ),
        })),
      addPayment: (payment) =>
        set((state) => ({
          payments: [
            {
              id: crypto.randomUUID(),
              submittedAt: new Date().toISOString(),
              status: "pending",
              ...payment,
            },
            ...state.payments,
          ],
        })),
      updatePaymentStatus: (id, status, note) =>
        set((state) => ({
          payments: state.payments.map((payment) =>
            payment.id === id
              ? {
                  ...payment,
                  status,
                  note: note ?? payment.note,
                }
              : payment
          ),
        })),
      login: (email) =>
        set((state) => ({
          auth: {
            isAuthenticated: true,
            role: "customer",
          },
          profile: {
            ...state.profile,
            email,
          },
        })),
      logout: () =>
        set({
          auth: {
            isAuthenticated: false,
            role: "guest",
          },
        }),
      register: (profile) =>
        set((state) => ({
          auth: {
            isAuthenticated: true,
            role: "customer",
          },
          profile: {
            ...state.profile,
            ...profile,
            memberSince: new Date().toISOString().slice(0, 10),
          },
        })),
      updateProfile: (updates) =>
        set((state) => ({
          profile: {
            ...state.profile,
            ...updates,
          },
        })),
    }),
    {
      name: "aura-platform-store",
      version: 1,
    }
  )
);

export const platformAutomationRules = automationRules;
