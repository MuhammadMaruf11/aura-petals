import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@aurapetals.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
const CUSTOMER_EMAIL = "jamie@example.com";
const CUSTOMER_PASSWORD = "Password123!";

async function main() {
  console.log("🌱 Seeding Aura & Petals...");

  // ---- Store settings ----
  await prisma.storeSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      storeName: "Aura & Petals",
      storeEmail: "hello@aurapetals.com",
      storePhone: "+1 555 010 2020",
      storeAddress: "123 Maker's Lane, Austin, TX",
      currencyCode: "USD",
      currencySymbol: "$",
      shippingFlatRate: 6.99,
      freeShippingThreshold: 75,
      taxRatePercent: 0,
    },
  });

  // ---- Users ----
  const adminPasswordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      name: "Store Admin",
      email: ADMIN_EMAIL,
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  const customerPasswordHash = await bcrypt.hash(CUSTOMER_PASSWORD, 12);
  const customer = await prisma.user.upsert({
    where: { email: CUSTOMER_EMAIL },
    update: {},
    create: {
      name: "Jamie Rivera",
      email: CUSTOMER_EMAIL,
      phone: "+1 555 019 4433",
      passwordHash: customerPasswordHash,
      role: "CUSTOMER",
      cart: { create: {} },
      wishlist: { create: {} },
    },
  });

  console.log(`  admin: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  console.log(`  customer: ${CUSTOMER_EMAIL} / ${CUSTOMER_PASSWORD}`);

  // ---- Categories ----
  const categoryDefs = [
    { name: "Clay Crafts", slug: "clay-crafts", description: "Hand-shaped clay art and decor.", isFeatured: true, sortOrder: 1 },
    { name: "Personalized Gifts", slug: "personalized-gifts", description: "Keepsakes made with a name, date, or message.", isFeatured: true, sortOrder: 2 },
    { name: "Gift Boxes", slug: "gift-boxes", description: "Ready-to-give curated gift sets.", isFeatured: true, sortOrder: 3 },
    { name: "Combo Packs", slug: "combo-packs", description: "Paired favorites at a better price.", isFeatured: true, sortOrder: 4 },
    { name: "Home Decor", slug: "home-decor", description: "Handmade pieces for the home.", isFeatured: true, sortOrder: 5 },
    { name: "Seasonal Collection", slug: "seasonal-collection", description: "Limited-time seasonal favorites.", isFeatured: true, sortOrder: 6 },
  ];

  const categories: Record<string, string> = {};
  for (const def of categoryDefs) {
    const category = await prisma.category.upsert({
      where: { slug: def.slug },
      update: {},
      create: {
        ...def,
        image: `https://picsum.photos/seed/${def.slug}/600/600`,
      },
    });
    categories[def.slug] = category.id;
  }

  // ---- Standard product ----
  const vase = await prisma.product.upsert({
    where: { slug: "handmade-clay-flower-vase" },
    update: {},
    create: {
      name: "Handmade Clay Flower Vase",
      slug: "handmade-clay-flower-vase",
      shortDescription: "A hand-thrown stoneware vase in a warm terracotta glaze.",
      description:
        "Each vase is thrown on the wheel and finished with a food-safe terracotta glaze. No two are exactly alike — expect gentle variation in tone and texture, which is part of the handmade charm. Holds water; suitable for fresh or dried arrangements.",
      sku: "APV-001",
      type: "STANDARD",
      status: "ACTIVE",
      badges: ["HANDMADE", "BEST_SELLER"],
      categoryId: categories["clay-crafts"],
      price: 38,
      compareAtPrice: 45,
      stock: 24,
      lowStockThreshold: 5,
      isFeatured: true,
      images: {
        create: [
          { url: "https://picsum.photos/seed/vase1/900/1100", isMain: true, sortOrder: 0 },
          { url: "https://picsum.photos/seed/vase2/900/1100", sortOrder: 1 },
        ],
      },
    },
  });

  // ---- Variant product ----
  const mug = await prisma.product.upsert({
    where: { slug: "artisan-clay-mug" },
    update: {},
    create: {
      name: "Artisan Clay Mug",
      slug: "artisan-clay-mug",
      shortDescription: "A cozy, hand-glazed mug available in three colors.",
      description:
        "Microwave and dishwasher safe stoneware mug, glazed by hand. Choose the color that matches your morning mood.",
      sku: "APM-001",
      type: "VARIANT",
      status: "ACTIVE",
      badges: ["HANDMADE", "NEW"],
      categoryId: categories["clay-crafts"],
      price: 22,
      stock: 0,
      trackInventory: false,
      isFeatured: true,
      images: {
        create: [{ url: "https://picsum.photos/seed/mug1/900/1100", isMain: true, sortOrder: 0 }],
      },
      variants: {
        create: [
          { name: "Terracotta", sku: "APM-001-TER", price: 22, options: { Color: "Terracotta" }, stock: 15, isDefault: true },
          { name: "Sage", sku: "APM-001-SAG", price: 22, options: { Color: "Sage" }, stock: 12 },
          { name: "Cream", sku: "APM-001-CRM", price: 24, options: { Color: "Cream" }, stock: 8 },
        ],
      },
    },
  });

  // ---- Personalized product ----
  const frame = await prisma.product.upsert({
    where: { slug: "custom-clay-couple-frame" },
    update: {},
    create: {
      name: "Custom Clay Couple Frame",
      slug: "custom-clay-couple-frame",
      shortDescription: "A personalized clay frame with your names and a special date.",
      description:
        "Hand-sculpted and engraved with the names and date of your choosing — a lasting keepsake for anniversaries, engagements, or any date worth remembering.",
      sku: "APF-001",
      type: "PERSONALIZED",
      status: "ACTIVE",
      badges: ["PERSONALIZED", "BEST_SELLER"],
      categoryId: categories["personalized-gifts"],
      price: 54,
      stock: 40,
      isFeatured: true,
      images: {
        create: [{ url: "https://picsum.photos/seed/frame1/900/1100", isMain: true, sortOrder: 0 }],
      },
      customizationFields: {
        create: [
          { label: "Your Name", fieldKey: "customerName", type: "TEXT", isRequired: true, maxLength: 40, sortOrder: 0 },
          { label: "Partner's Name", fieldKey: "partnerName", type: "TEXT", isRequired: true, maxLength: 40, sortOrder: 1 },
          { label: "Special Date", fieldKey: "specialDate", type: "DATE", isRequired: true, sortOrder: 2 },
          { label: "Message (optional)", fieldKey: "message", type: "TEXTAREA", isRequired: false, maxLength: 120, sortOrder: 3 },
        ],
      },
    },
  });

  const decorSet = await prisma.product.upsert({
    where: { slug: "mini-clay-decor-set" },
    update: {},
    create: {
      name: "Mini Clay Decor Set",
      slug: "mini-clay-decor-set",
      shortDescription: "A set of three tiny clay figures for shelves and desks.",
      description: "Three miniature hand-formed clay pieces, glazed in complementary tones — perfect for a bookshelf or windowsill.",
      sku: "APD-001",
      type: "STANDARD",
      status: "ACTIVE",
      badges: ["HANDMADE"],
      categoryId: categories["home-decor"],
      price: 28,
      stock: 30,
      images: { create: [{ url: "https://picsum.photos/seed/decor1/900/1100", isMain: true, sortOrder: 0 }] },
    },
  });

  const greetingCard = await prisma.product.upsert({
    where: { slug: "handmade-greeting-card" },
    update: {},
    create: {
      name: "Handmade Greeting Card",
      slug: "handmade-greeting-card",
      shortDescription: "A blank, hand-illustrated card for any occasion.",
      description: "Printed on textured cardstock with a hand-painted illustration. Comes with a kraft envelope.",
      sku: "APC-001",
      type: "STANDARD",
      status: "ACTIVE",
      badges: ["HANDMADE"],
      categoryId: categories["personalized-gifts"],
      price: 6,
      stock: 100,
      images: { create: [{ url: "https://picsum.photos/seed/card1/900/1100", isMain: true, sortOrder: 0 }] },
    },
  });

  // ---- Bundle product ----
  await prisma.product.upsert({
    where: { slug: "birthday-gift-box" },
    update: {},
    create: {
      name: "Birthday Gift Box",
      slug: "birthday-gift-box",
      shortDescription: "A curated birthday box: vase, mug, decor set, and a card.",
      description:
        "Everything you need for a thoughtful birthday gift, packaged together and ready to give: a clay flower vase, an artisan mug, a mini decor set, and a handmade greeting card.",
      sku: "APB-001",
      type: "BUNDLE",
      status: "ACTIVE",
      badges: ["LIMITED_EDITION"],
      categoryId: categories["gift-boxes"],
      price: 89,
      compareAtPrice: 104,
      stock: 15,
      isFeatured: true,
      images: { create: [{ url: "https://picsum.photos/seed/giftbox1/900/1100", isMain: true, sortOrder: 0 }] },
      bundleItems: {
        create: [
          { componentId: vase.id, quantity: 1 },
          { componentId: mug.id, quantity: 1 },
          { componentId: decorSet.id, quantity: 1 },
          { componentId: greetingCard.id, quantity: 1 },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "anniversary-combo-pack" },
    update: {},
    create: {
      name: "Anniversary Combo Pack",
      slug: "anniversary-combo-pack",
      shortDescription: "The couple frame paired with two artisan mugs.",
      description: "A personalized couple frame alongside two artisan mugs — a complete anniversary gift.",
      sku: "APB-002",
      type: "BUNDLE",
      status: "ACTIVE",
      badges: ["PERSONALIZED", "LIMITED_EDITION"],
      categoryId: categories["combo-packs"],
      price: 92,
      compareAtPrice: 98,
      stock: 10,
      images: { create: [{ url: "https://picsum.photos/seed/combo1/900/1100", isMain: true, sortOrder: 0 }] },
      bundleItems: {
        create: [
          { componentId: frame.id, quantity: 1 },
          { componentId: mug.id, quantity: 2 },
        ],
      },
    },
  });

  // ---- Coupon ----
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      type: "PERCENTAGE",
      value: 10,
      minPurchase: 25,
      maxDiscount: 20,
      usageLimit: 500,
      perUserLimit: 1,
      isActive: true,
    },
  });

  // ---- Banner ----
  await prisma.banner.create({
    data: {
      title: "Gifts shaped by hand",
      subtitle: "New seasonal collection, now live",
      imageUrl: "https://picsum.photos/seed/herobanner/1600/900",
      ctaLabel: "Shop the collection",
      ctaHref: "/shop",
      placement: "HERO",
      sortOrder: 0,
      isActive: true,
    },
  });

  // ---- A sample delivered order for the demo customer, so /account/orders isn't empty ----
  const existingOrder = await prisma.order.findFirst({ where: { userId: customer.id } });
  if (!existingOrder) {
    const shippingSnapshot = {
      fullName: customer.name,
      phone: "+1 555 019 4433",
      line1: "42 Blossom Ave",
      city: "Austin",
      state: "TX",
      postalCode: "78701",
      country: "US",
    };

    await prisma.order.create({
      data: {
        orderNumber: "AP-000001",
        userId: customer.id,
        email: customer.email,
        phone: "+1 555 019 4433",
        status: "DELIVERED",
        paymentStatus: "PAID",
        paymentMethod: "COD",
        shippingSnapshot,
        billingSnapshot: shippingSnapshot,
        subtotal: 38,
        discountTotal: 0,
        shippingTotal: 6.99,
        taxTotal: 0,
        total: 44.99,
        items: {
          create: [
            {
              productId: vase.id,
              productName: vase.name,
              unitPrice: 38,
              quantity: 1,
              lineTotal: 38,
            },
          ],
        },
        trackingEvents: {
          create: [
            { status: "PENDING", note: "Order placed" },
            { status: "CONFIRMED" },
            { status: "PROCESSING" },
            { status: "SHIPPED" },
            { status: "DELIVERED" },
          ],
        },
      },
    });
  }

  console.log(`✅ Seed complete. Admin: ${admin.email}. Customer: ${customer.email}.`);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
