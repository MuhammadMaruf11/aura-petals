export const siteConfig = {
  name: "Aura & Petals",
  shortName: "Aura & Petals",
  description:
    "Handmade clay art, personalized gifts, and premium gift boxes crafted with care — for birthdays, anniversaries, and the moments in between.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  logoUrl: "/images/logo.jpg",
  currency: process.env.NEXT_PUBLIC_CURRENCY ?? "BDT",
  currencySymbol: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL ?? "৳",
  links: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    pinterest: "https://pinterest.com",
  },
  nav: [
    { label: "Shop All", href: "/shop" },
    { label: "Clay Crafts", href: "/shop/clay-crafts" },
    { label: "Personalized Gifts", href: "/shop/personalized-gifts" },
    { label: "Gift Boxes", href: "/shop/gift-boxes" },
    { label: "Home Decor", href: "/shop/home-decor" },
  ],
} as const;
