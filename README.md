# Aura & Petals

A premium e-commerce platform for handmade clay art, personalized gifts, gift
boxes, and combo packs — built from scratch with Next.js 16, React 19,
TypeScript, Prisma, and PostgreSQL.

> **Before you start:** read `FINAL_VERIFICATION.md`. It documents exactly
> what was and wasn't verified during development (this project was built in
> a sandboxed environment without access to Prisma's binary CDN) and the exact
> commands to run to verify it yourself.

---

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript (strict)
- **Styling:** Tailwind CSS v4, a hand-built shadcn/ui-style component kit (Radix primitives)
- **Data:** PostgreSQL + Prisma ORM (stable v6.19.3 — see `CHANGELOG.md` for why not v7)
- **Forms/validation:** React Hook Form + Zod
- **Client server-state:** TanStack Query
- **Client UI state:** Zustand (cart drawer open/close only — cart data itself lives server-side)
- **Auth:** Custom email/password auth — bcrypt password hashing, signed JWT session cookies (`jose`), role-based middleware. (Not NextAuth/Auth.js — see FINAL_VERIFICATION.md for why.)
- **Analytics:** Centralized abstraction (`src/lib/analytics/events.ts`) forwarding to Google Tag Manager + Meta Pixel

## Project structure

```
src/
  app/                 # Routes (App Router)
    (auth)/            # Login, register, password reset — no site chrome
    (shop)/            # Public storefront — home, shop, product, cart, checkout
    account/           # Customer dashboard (auth required)
    admin/             # Admin panel (ADMIN role required)
      login/           # Standalone admin login (no sidebar)
      (dashboard)/     # Everything else — wrapped in the admin sidebar layout
    sitemap.ts / robots.ts
  components/
    ui/                # Hand-built shadcn-style primitives (Button, Input, Dialog, ...)
    layout/            # Navbar, Footer, MobileNav
    shared/             # Pagination, EmptyState
  config/site.ts        # Site name, nav links, currency
  features/             # Feature-scoped client components, grouped by domain
    auth/ cart/ wishlist/ products/ checkout/ orders/ account/ admin/ home/
  lib/
    auth/               # password hashing, JWT session, current-user helpers
    validations/        # all Zod schemas
    analytics/          # GTM/Pixel client + server event helpers
    cart/               # guest cart token cookie helper
    db/prisma.ts         # Prisma client singleton
    env.ts               # validated environment config — import this, not process.env
  server/
    services/            # Prisma queries + business logic (server-only)
    actions/              # "use server" actions called from client components
prisma/
  schema.prisma
  seed.ts
```

## Local setup

### 1. Install dependencies

```bash
pnpm install
```

This runs `prisma generate` automatically via a `postinstall` script.

### 2. Configure environment

```bash
cp .env.example .env
```

At minimum, set `DATABASE_URL` to a real PostgreSQL connection string and
`AUTH_SECRET` to a long random value (`openssl rand -base64 32`).

### 3. Set up the database

```bash
pnpm prisma migrate dev --name init
pnpm db:seed
```

`db:seed` creates:
- An admin account (`admin@aurapetals.com` / `ChangeMe123!` by default — override with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `.env`)
- A demo customer account (`jamie@example.com` / `Password123!`) with one delivered sample order
- 6 categories, 8 products (standard, variant, personalized, and 2 bundle products), a coupon (`WELCOME10`), store settings, and a homepage banner

**Change the seeded admin password immediately in any non-local environment.**

### 4. Run it

```bash
pnpm dev
```

- Storefront: http://localhost:3000
- Customer account: http://localhost:3000/account
- Admin panel: http://localhost:3000/admin/login

### 5. Verify before deploying

```bash
pnpm lint
pnpm typecheck
pnpm build
```

See `FINAL_VERIFICATION.md` for what's already been verified vs. what you
should confirm in your own environment.

## Useful scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build |
| `pnpm start` | Run the production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm db:push` | Push schema changes without a migration (prototyping) |
| `pnpm db:migrate` | Create/apply a migration |
| `pnpm db:seed` | Seed the database |
| `pnpm db:studio` | Open Prisma Studio |

## Feature overview

**Storefront:** homepage (hero, featured categories/products, new arrivals,
gift bundles, testimonials), shop listing with category/price/stock filters
and sort, search, product detail (gallery, variant picker, personalization
fields, bundle contents, frequently-bought-together, recently-viewed, reviews
tab), cart (guest + logged-in, merges on login), checkout (address, COD /
Stripe / SSLCommerz selector, coupon codes), order confirmation.

**Customer account:** dashboard, order history + detail + tracking timeline,
wishlist, address book, profile editing, password change.

**Admin panel:** dashboard (revenue chart, order/customer/product counts, low
stock alerts), full product CRUD (images, variants, personalization fields,
bundle contents), category CRUD, order management (status, payment status,
courier/tracking info, internal notes), customer list/detail, coupon CRUD,
banner CRUD, store settings (currency, shipping, tax, analytics IDs).

**Cross-cutting:** role-based auth (customer/admin) with signed session
cookies and route-level middleware protection, centralized Zod validation,
GTM + Meta Pixel event tracking (PageView, ViewContent, Search, AddToCart,
AddToWishlist, InitiateCheckout, AddPaymentInfo, Purchase), dynamic sitemap +
robots.txt, per-product SEO metadata + Product JSON-LD.

## Known limitations

See `FINAL_VERIFICATION.md` for the full list. The short version:

- **Payments:** Cash on Delivery is fully functional end-to-end. Stripe and
  SSLCommerz are selectable in checkout and modeled in the schema
  (`Order.paymentMethod`, `Payment` model) but the actual charge/webhook
  integration is not implemented — that's real payment-gateway work that
  needs your live API keys and a webhook endpoint.
- **Image uploads:** the admin panel uploads product/banner/logo images
  directly to Cloudinary (upload + delete lifecycle, with a guard that never
  deletes an image still referenced by a past order). Requires
  `CLOUDINARY_CLOUD_NAME`/`CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET` in
  `.env` — see `.env.example`.
- **Email:** password reset generates a token but doesn't send an email — in
  development the reset link is shown directly on screen. Wire up a
  transactional email provider before production use.
