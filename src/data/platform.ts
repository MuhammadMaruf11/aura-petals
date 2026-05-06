import type {
  AutomationEvent,
  AutomationRule,
  Category,
  ContactMessage,
  CustomerProfile,
  PaymentRecord,
  PricingPlan,
  Product,
  TenantBranding,
  TenantSubscription,
} from "@/types/platform";

const buildProduct = (
  partial: Omit<Product, "createdAt" | "updatedAt">
): Product => ({
  ...partial,
  createdAt: "2026-04-12T09:30:00.000Z",
  updatedAt: "2026-05-04T15:15:00.000Z",
});

export const defaultBranding: TenantBranding = {
  businessName: "Aura & Petals",
  tagline: "Timeless gifting, floral warmth, and crafted keepsakes.",
  logoUrl: "/images/logo/main-logo.png",
  colors: {
    primary: "#8A9A5B",
    secondary: "#DCAE96",
    accent: "#D4AF37",
    background: "#FAF9F6",
    foreground: "#2F3129",
  },
};

export const categories: Category[] = [
  {
    id: "cat-elite",
    name: "Elite Collection",
    slug: "elite",
    description: "Statement gifts designed for premium launches and milestone moments.",
    image:
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1200&auto=format&fit=crop",
    countLabel: "12 signature drops",
  },
  {
    id: "cat-petals",
    name: "Natural Petals",
    slug: "petals",
    description: "Fresh-looking blooms, preserved stems, and romantic bouquet sets.",
    image:
      "https://images.unsplash.com/photo-1496062031456-07b8f162a322?q=80&w=1200&auto=format&fit=crop",
    countLabel: "24 floral bundles",
  },
  {
    id: "cat-crafts",
    name: "Custom Crafts",
    slug: "crafts",
    description: "Personalized boxes, handmade decor, and story-led keepsakes.",
    image:
      "https://images.unsplash.com/photo-1647221598398-934ed5cb0e4f?q=80&w=1400&auto=format&fit=crop",
    countLabel: "18 bespoke builds",
  },
  {
    id: "cat-budget",
    name: "Budget Friendly",
    slug: "budget",
    description: "Accessible gifts for everyday celebrations and spontaneous surprises.",
    image:
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=1200&auto=format&fit=crop",
    countLabel: "31 ready gifts",
  },
  {
    id: "cat-wellness",
    name: "Wellness Rituals",
    slug: "wellness",
    description: "Calming bundles with candles, teas, and spa-inspired accessories.",
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1200&auto=format&fit=crop",
    countLabel: "10 slow-living kits",
  },
];

export const seedProducts: Product[] = [
  buildProduct({
    id: "prod-rose-luxe",
    slug: "rose-luxe-necklace-box",
    title: "Rose Luxe Necklace Box",
    subtitle: "Champagne gold finish with layered gift reveal",
    description:
      "A premium gift box that pairs preserved petals, a velvet insert, and a rose gold necklace for milestone gifting.",
    price: 4800,
    compareAtPrice: 5400,
    image_url:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1200&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80",
      "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=1200&q=80",
    ],
    videoUrl: "https://res.cloudinary.com/demo/video/upload/v1700000000/aura-petals/reel-rose-box.mp4",
    tier: "elite",
    category: "elite",
    featured: true,
    stock: 14,
    status: "active",
    tags: ["gift box", "bridal", "luxury"],
    specs: [
      { label: "Finish", value: "Rose gold plated" },
      { label: "Insert", value: "Velvet dual-layer tray" },
      { label: "Packaging", value: "Magnetic rigid box" },
    ],
  }),
  buildProduct({
    id: "prod-silk-petal-bundle",
    slug: "silk-petal-bundle",
    title: "Silk Petal Bundle",
    subtitle: "Soft blush bouquet for compact spaces",
    description:
      "A handcrafted bouquet with silk petals, ribbon wrap, and an elegant vase sleeve for desks and intimate corners.",
    price: 1350,
    image_url:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80",
      "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=1200&q=80",
      "https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=1200&q=80",
    ],
    tier: "average",
    category: "petals",
    featured: true,
    stock: 28,
    status: "active",
    tags: ["bouquet", "desk decor", "anniversary"],
    specs: [
      { label: "Stem count", value: "21 stems" },
      { label: "Care", value: "Dust lightly, no watering needed" },
      { label: "Palette", value: "Blush, cream, sage" },
    ],
  }),
  buildProduct({
    id: "prod-story-craft",
    slug: "story-craft-memory-box",
    title: "Story Craft Memory Box",
    subtitle: "Personalized keepsake with note cards and ribbon tray",
    description:
      "Designed for birthdays and proposal reveals, this memory box includes layered compartments and custom note inserts.",
    price: 2200,
    compareAtPrice: 2600,
    image_url:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80",
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200&q=80",
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&q=80",
    ],
    tier: "average",
    category: "crafts",
    featured: true,
    stock: 19,
    status: "active",
    tags: ["personalized", "keepsake", "proposal"],
    specs: [
      { label: "Customization", value: "Name tag and quote card" },
      { label: "Compartments", value: "3 modular dividers" },
      { label: "Build time", value: "48 hours" },
    ],
  }),
  buildProduct({
    id: "prod-everyday-earrings",
    slug: "everyday-pearl-earrings",
    title: "Everyday Pearl Earrings",
    subtitle: "Lightweight pair for daily gifting",
    description:
      "A budget-friendly jewelry staple with soft pearl detailing and anti-tarnish finishing for regular wear.",
    price: 690,
    image_url:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&q=80",
      "https://images.unsplash.com/photo-1611599537845-1c7aca0091c0?w=1200&q=80",
    ],
    tier: "average",
    category: "budget",
    featured: false,
    stock: 47,
    status: "active",
    tags: ["daily wear", "budget", "pearls"],
    specs: [
      { label: "Material", value: "Alloy with pearl accent" },
      { label: "Weight", value: "3.2 grams" },
      { label: "Closure", value: "Push-back" },
    ],
  }),
  buildProduct({
    id: "prod-diamond-studs",
    slug: "diamond-studs-signature",
    title: "Diamond Studs Signature",
    subtitle: "Minimal luxury for capsule wardrobes",
    description:
      "Premium crystal studs with a refined silhouette made for gifting ceremonies and executive styling.",
    price: 8700,
    compareAtPrice: 9100,
    image_url:
      "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=1200&q=80",
      "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=1200&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80",
    ],
    tier: "elite",
    category: "elite",
    featured: true,
    stock: 8,
    status: "active",
    tags: ["jewelry", "signature", "premium"],
    specs: [
      { label: "Stone", value: "Premium crystal cut" },
      { label: "Backing", value: "Screw-fit comfort lock" },
      { label: "Occasion", value: "Formal and bridal" },
    ],
  }),
  buildProduct({
    id: "prod-sage-spa-set",
    slug: "sage-spa-reset-set",
    title: "Sage Spa Reset Set",
    subtitle: "Candle, tea, and self-care journal in one tray",
    description:
      "A wellness bundle designed for team appreciation gifts and calm evening routines.",
    price: 1950,
    image_url:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1200&q=80",
      "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=1200&q=80",
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200&q=80",
    ],
    tier: "average",
    category: "wellness",
    featured: false,
    stock: 22,
    status: "active",
    tags: ["spa", "tea", "gift kit"],
    specs: [
      { label: "Contents", value: "Soy candle, tea jar, pocket journal" },
      { label: "Scent", value: "Sage and white musk" },
      { label: "Audience", value: "Corporate gifting, self-care" },
    ],
  }),
  buildProduct({
    id: "prod-bloom-arch",
    slug: "bloom-arch-celebration-kit",
    title: "Bloom Arch Celebration Kit",
    subtitle: "Large-format floral install for launches and events",
    description:
      "An event-ready floral composition package with detachable stems and backdrop styling guidance.",
    price: 6800,
    image_url:
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=1200&q=80",
      "https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=1200&q=80",
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1200&q=80",
    ],
    videoUrl: "https://res.cloudinary.com/demo/video/upload/v1700000000/aura-petals/bloom-arch-short.mp4",
    tier: "elite",
    category: "petals",
    featured: true,
    stock: 6,
    status: "active",
    tags: ["event decor", "arch", "launch"],
    specs: [
      { label: "Coverage", value: "7 feet modular spread" },
      { label: "Assembly", value: "Clip-on frame support" },
      { label: "Delivery", value: "Dhaka city only" },
    ],
  }),
  buildProduct({
    id: "prod-mini-love-note",
    slug: "mini-love-note-gift-set",
    title: "Mini Love Note Gift Set",
    subtitle: "Affordable keepsake with ribbon pouch and tag",
    description:
      "A compact gifting option for classroom appreciation, office swaps, and everyday thoughtful gestures.",
    price: 520,
    image_url:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&q=80",
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200&q=80",
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=1200&q=80",
    ],
    tier: "average",
    category: "budget",
    featured: false,
    stock: 65,
    status: "active",
    tags: ["small gift", "thank you", "budget"],
    specs: [
      { label: "Packaging", value: "Ribbon pouch and paper tag" },
      { label: "Lead time", value: "Same day dispatch" },
      { label: "Minimum order", value: "5 units" },
    ],
  }),
];

export const seedMessages: ContactMessage[] = [
  {
    id: "msg-1",
    customerName: "Sadia Rahman",
    email: "sadia@example.com",
    phone: "+8801711111111",
    subject: "Need a Ramadan gifting bundle",
    body:
      "We need 25 custom gift boxes with calm packaging and handwritten note inserts for our client campaign.",
    status: "new",
    receivedAt: "2026-05-05T08:40:00.000Z",
    source: "contact-page",
  },
  {
    id: "msg-2",
    customerName: "Tahmid Hasan",
    email: "tahmid@example.com",
    phone: "+8801812345678",
    subject: "Can you restock the wellness set?",
    body:
      "I want to order the Sage Spa Reset Set for a team workshop next week. Please let me know if 12 units are available.",
    status: "in_progress",
    receivedAt: "2026-05-04T14:15:00.000Z",
    source: "contact-page",
    reply: "We can prepare 12 units by Sunday. Sharing a quotation over email.",
  },
  {
    id: "msg-3",
    customerName: "Maira Sultana",
    email: "maira@example.com",
    phone: "+8801912121212",
    subject: "Logo placement on custom boxes",
    body:
      "Can your team print our studio logo on the Story Craft Memory Box for a bridal launch?",
    status: "resolved",
    receivedAt: "2026-05-02T09:50:00.000Z",
    source: "contact-page",
    reply: "Yes. We can foil-stamp your logo and send a mockup within 24 hours.",
  },
];

export const seedProfile: CustomerProfile = {
  fullName: "Nadia Ahmed",
  email: "nadia@aurapetals.dev",
  phone: "+8801700000000",
  address: "Dhanmondi, Dhaka",
  memberSince: "2025-11-14",
  orderHistory: [
    {
      id: "ord-1001",
      placedAt: "2026-04-28T11:30:00.000Z",
      status: "delivered",
      total: 6150,
      items: [
        { productId: "prod-story-craft", title: "Story Craft Memory Box", quantity: 1, price: 2200 },
        { productId: "prod-silk-petal-bundle", title: "Silk Petal Bundle", quantity: 2, price: 1350 },
        { productId: "prod-mini-love-note", title: "Mini Love Note Gift Set", quantity: 2, price: 520 },
      ],
    },
    {
      id: "ord-1002",
      placedAt: "2026-03-13T17:00:00.000Z",
      status: "shipped",
      total: 4800,
      items: [
        { productId: "prod-rose-luxe", title: "Rose Luxe Necklace Box", quantity: 1, price: 4800 },
      ],
    },
  ],
};

export const seedPlans: PricingPlan[] = [
  {
    id: "plan-starter",
    name: "Starter Bloom",
    monthlyPrice: 2500,
    productLimit: 80,
    automationQuota: 120,
    teamSeats: 2,
    features: ["Storefront", "Product CRUD", "Basic social distribution"],
  },
  {
    id: "plan-growth",
    name: "Growth Studio",
    monthlyPrice: 6500,
    productLimit: 250,
    automationQuota: 400,
    teamSeats: 6,
    features: ["Branding control", "Advanced automation", "Message board"],
  },
  {
    id: "plan-scale",
    name: "Scale Atelier",
    monthlyPrice: 12500,
    productLimit: 700,
    automationQuota: 900,
    teamSeats: 12,
    features: ["Priority support", "Expanded quotas", "Manual payment tracking"],
  },
];

export const seedSubscriptions: TenantSubscription[] = [
  {
    id: "sub-1",
    tenantName: "Petal & Paper Co.",
    ownerName: "Rifa Karim",
    planId: "plan-growth",
    status: "active",
    storefrontEnabled: true,
    renewalDate: "2026-05-20",
    productLimit: 250,
    automationQuota: 400,
  },
  {
    id: "sub-2",
    tenantName: "Noor Wedding Studio",
    ownerName: "Arif Noor",
    planId: "plan-scale",
    status: "trial",
    storefrontEnabled: true,
    renewalDate: "2026-05-12",
    productLimit: 700,
    automationQuota: 900,
  },
  {
    id: "sub-3",
    tenantName: "Craft Cart BD",
    ownerName: "Lamia Hassan",
    planId: "plan-starter",
    status: "paused",
    storefrontEnabled: false,
    renewalDate: "2026-05-08",
    productLimit: 80,
    automationQuota: 120,
  },
];

export const seedPayments: PaymentRecord[] = [
  {
    id: "pay-1",
    tenantName: "Petal & Paper Co.",
    planName: "Growth Studio",
    amount: 6500,
    method: "bKash",
    senderNumber: "01799999999",
    transactionId: "BK240501A91",
    submittedAt: "2026-05-01T10:15:00.000Z",
    status: "verified",
    note: "April renewal confirmed by accounts.",
  },
  {
    id: "pay-2",
    tenantName: "Noor Wedding Studio",
    planName: "Scale Atelier",
    amount: 12500,
    method: "Nagad",
    senderNumber: "01888888888",
    transactionId: "NG240504K22",
    submittedAt: "2026-05-04T15:30:00.000Z",
    status: "pending",
    note: "Waiting for owner confirmation screenshot.",
  },
];

export const automationRules: AutomationRule[] = [
  {
    id: "rule-image",
    title: "Image Distribution",
    trigger: "Product created or updated in Supabase",
    channels: ["Facebook", "Instagram", "LinkedIn", "Website"],
    exclusions: ["YouTube", "TikTok"],
    note: "Multiple images are supported and remain visible on the storefront.",
  },
  {
    id: "rule-video",
    title: "Short-form Video Distribution",
    trigger: "Video URL added to product record",
    channels: ["Facebook", "Instagram", "YouTube", "TikTok", "LinkedIn"],
    note: "Videos are used for Reels/Shorts only and are hidden from the website UI.",
  },
  {
    id: "rule-cloudinary",
    title: "Cloudinary Lifecycle Sync",
    trigger: "Product updated or deleted",
    channels: ["Cloudinary cleanup queue", "Make.com webhook"],
    note: "Removed media is queued for cleanup so tenant storage stays consistent.",
  },
];

export const seedAutomationEvents: AutomationEvent[] = [
  {
    id: "evt-1",
    title: "Queued social publish",
    description: "Bloom Arch Celebration Kit pushed to Facebook, Instagram, and LinkedIn.",
    createdAt: "2026-05-05T07:10:00.000Z",
    type: "publish",
  },
  {
    id: "evt-2",
    title: "Cloudinary cleanup scheduled",
    description: "Legacy banner assets marked for deletion after product image refresh.",
    createdAt: "2026-05-04T16:45:00.000Z",
    type: "cleanup",
  },
  {
    id: "evt-3",
    title: "Payment verification reminder",
    description: "Pending Nagad submission requires manual confirmation.",
    createdAt: "2026-05-04T15:32:00.000Z",
    type: "payment",
  },
  {
    id: "evt-4",
    title: "Message routed to admin board",
    description: "Ramadan gifting enquiry created from the storefront contact form.",
    createdAt: "2026-05-05T08:41:00.000Z",
    type: "message",
  },
];
