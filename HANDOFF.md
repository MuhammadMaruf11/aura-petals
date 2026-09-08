# HANDOFF.md — Aura & Petals

**Snapshot date:** This backup follows a stabilization pass that fixed real
bugs found when the user *actually ran `pnpm dev` for the first time*
against the prior session's "৳20,000 scope completion" backup: a Cart
`P2003` foreign-key crash, a guest-cart-merge feature that was written but
never wired up, and a CSS regression (the whole site's stylesheet wasn't
loading). See "0. This Pass: Stabilization" below for the full story, and
`CHANGELOG.md`'s top entry for the technical detail. Read this whole
document before changing anything — the "Verification Status" section (§9)
is the most important part: **static analysis and code reading are as far
as verification has gone in every session so far; no session has run this
app against a live server.**

---

## 0. This Pass: Stabilization (not new features)

This pass was explicitly scoped as *debugging only* — no new features, no
redesign. Three real bugs were found and fixed by reading the actual
authentication/cart/CSS code paths, not by guessing:

1. **Cart `P2003` FK crash** — `getSession()` verified a JWT's signature but
   never checked the user it names still exists in the database. A stale
   cookie (dev DB reset, deleted/deactivated account) crashed cart (and
   would have crashed wishlist and order creation too — same unguarded
   pattern existed in both). Fixed by moving the "session names a real,
   active user" guarantee into `getSession()` itself. See `CHANGELOG.md`.
2. **Guest cart silently lost on login** — `mergeGuestCartIntoUserCart()`
   existed, worked, and was never called from anywhere. Wired it into
   `loginUser`/`registerUser`.
3. **Whole-site CSS not loading** — `src/app/layout.tsx` had its
   `globals.css` import and real font loading replaced with placeholder
   `// DIAG: ... stripped for plain-node test` stubs, apparently left over
   from some earlier offline test and never reverted. This alone explains
   both the "badly broken design" report and the `Image fill` position
   warnings (Tailwind classes like `relative` produced no CSS at all, so
   the browser computed `static` regardless of what the class said).

**None of this was caught by any prior session**, because no prior session
had a running dev server available — every "verification" up to this point
was `tsc`/reading code, which cannot catch a stale-session runtime
condition or a missing CSS import. This is the clearest evidence yet for
the standing recommendation in every one of these HANDOFF docs: **run the
real dev server before trusting anything.**

---

## 1. Project Overview

**Aura & Petals** is a premium handmade-gift/craft e-commerce platform built
for a Bangladesh client on a practical, budget-conscious scope (not an
enterprise platform — explicitly "do not over-engineer").

**Stack:**
- Next.js 16.3.3 (App Router, Turbopack), React 19.2.8, TypeScript (strict)
- Tailwind CSS v4 (CSS-first config, no `tailwind.config.js`)
- PostgreSQL + **Prisma 6.19.3** (deliberately NOT Prisma 7 — see §10)
- React Hook Form + Zod (validation)
- TanStack Query (client server-state), Zustand (minimal client UI state — cart drawer open/close only)
- Custom auth (bcrypt + signed JWT session cookies via `jose`) — not NextAuth/Auth.js
- Cloudinary (image uploads — required, not optional; see `.env.example`)
- A hand-built shadcn/ui-style component kit on Radix primitives

## 2. Current Architecture

```
src/
  app/
    (auth)/              # login, register, password reset — no site chrome
    (shop)/               # public storefront
      contact/            # NEW — Contact Us page
      about/              # NEW — Our Story page
      shipping-returns/   # NEW — Shipping & Returns page
      shop/[[...category]]/ # rebuilt with sidebar filters + grid/list toggle
    account/              # customer dashboard (auth required)
      settings/           # merged Profile+Addresses+Security page (only settings page now)
      orders/[orderNumber]/invoice/ # NEW — customer invoice route
    admin/
      login/
      (dashboard)/
        contacts/          # NEW — contact message inbox (list + detail)
        orders/[id]/invoice/ # NEW — admin invoice route
    sitemap.ts / robots.ts
  components/
    ui/                   # hand-built shadcn-style primitives
    layout/                # Navbar, Footer (both print:hidden now), MobileNav
    shared/                 # Pagination, EmptyState
  config/site.ts
  features/
    auth/ cart/ wishlist/ checkout/ home/
    account/               # profile/password/address forms — feeds the merged settings page
    admin/                  # NEW: contact-message-controls.tsx; admin-sidebar.tsx has a Messages nav entry
    contact/                # NEW — ContactForm
    orders/                 # order-detail-view.tsx (now takes invoiceHref prop), NEW invoice-view.tsx
    products/                # product-card, NEW: card-add-to-cart-button, quick-view-button,
                              #   product-list-item, shop-filter-sidebar, shop-results-grid,
                              #   use-shop-view-mode
  lib/
    validations/            # NEW: contact.ts
    cloudinary/
    delivery-zones.ts
    db/prisma.ts
    env.ts
  server/
    services/                    # NEW: contact.service.ts, admin-contact.service.ts
      delivery.service.ts
    actions/                       # NEW: contact.actions.ts, admin-contact.actions.ts
prisma/
  schema.prisma   # unchanged this session — ContactMessage model was already present
  seed.ts
```

## 3. Completed Features

Everything from the original build plus the prior session's mid-scope work
(nested categories, Cloudinary integration, order status enum, product/
banner/settings Cloudinary wiring, centralized delivery charges, BDT
currency) — see `CHANGELOG.md` for full history.

**Completed this session** (finishing the remaining ৳20,000-scope items):

- **Account settings merge**: `/account/settings` is now the only account
  nav entry; the three old separate pages are deleted; `account.actions.ts`
  revalidates `/account/settings` instead of the removed routes.
- **Contact Us**: public `/contact` page with a working form
  (`ContactForm` → `submitContactMessageAction` → `ContactMessage` table),
  plus an admin inbox at `/admin/contacts` (unread badge, mark read/unread,
  delete, detail view that auto-marks read on open).
- **Our Story**: static `/about` page.
- **Shipping & Returns**: `/shipping-returns`, showing the *live*
  per-zone delivery charges and free-shipping threshold from
  `getAllDeliveryCharges()`/`getStoreSettings()` — not hardcoded text.
- **Invoice view**: shared `InvoiceView` component (print-friendly, has its
  own "Print / Save as PDF" button) rendered at both
  `/account/orders/[orderNumber]/invoice` (customer) and
  `/admin/orders/[id]/invoice` (admin). `OrderDetailView` now takes an
  explicit `invoiceHref` prop — **all three of its callers** (customer order
  detail, admin order detail, checkout confirmation) pass it. If you add a
  fourth caller, don't forget this prop; there's no default because the
  correct URL depends on whether you have an order id or order number.
- **Shop filter sidebar + grid/list toggle**: `/shop` now has a real sidebar
  (`ShopFilterSidebar`) with a hierarchical category tree (uses the
  existing `getCategoryTree()`), price range, in-stock, Featured, and
  NEW/BEST_SELLER checkboxes, and a "Clear filters" button. A grid/list
  toggle (`useShopViewMode`, localStorage-persisted) switches between the
  existing `ProductCard` grid and a new `ProductListItem` row layout.
- **Product card actions + Quick View**: STANDARD products (no
  variant/customization choices) get a one-click "Add to Bag" button
  directly on the card (`CardAddToCartButton`). Products that need option
  selection first (VARIANT/PERSONALIZED/BUNDLE) get a "Quick View" button
  instead (`QuickViewButton`) that opens a modal, fetches the full
  `ProductDetailData` via a new `getProductForQuickView` action, and
  renders the *existing* `ProductGallery` + `AddToCartForm` inside a
  `Dialog` — no duplicated add-to-cart/customization logic, per the
  approach the prior session had already recommended.
- **PDP top-section redesign**: breadcrumb trail (via the existing
  `getCategoryBreadcrumb()`), a sticky right-column info panel on desktop,
  badge pills, an average-rating summary line, the wishlist button moved
  next to the title, and a SKU line. Purely presentational — `AddToCartForm`
  itself was not touched.
- **`.env.example` / README**: Cloudinary is now documented as required
  (`UPLOAD_PROVIDER` default changed from `"local"` to `"cloudinary"`);
  previously said "reserved for future use," which was no longer accurate
  once Cloudinary upload/delete actually shipped.

## 4. Nothing Partially Completed

Unlike the prior backup, there is no known half-wired feature at the time of
this backup. Everything listed in §3 is a complete, internally consistent
change (component + service/action + page + nav entry, where applicable).

## 5. Database

**No schema changes this session.** `ContactMessage` was already in
`prisma/schema.prisma` from the prior session (schema only, unused) — this
session wrote the first code that actually uses it. No new migration is
needed beyond whatever the prior session's schema changes already required
(see §9 — migrations still haven't been run in any sandbox yet).

## 6. Authentication, Product System, Admin, Customer Panel

Unchanged this session except: `account-sidebar.tsx` nav (see §3),
`admin-sidebar.tsx` gained a "Messages" nav entry for `/admin/contacts`.
See prior `CHANGELOG.md` entries for everything else — auth, Cloudinary,
variants, categories, etc. all still work exactly as previously documented.

## 7. New Files This Session

```
src/lib/validations/contact.ts
src/server/services/contact.service.ts
src/server/services/admin-contact.service.ts
src/server/actions/contact.actions.ts
src/server/actions/admin-contact.actions.ts
src/features/contact/contact-form.tsx
src/app/(shop)/contact/page.tsx
src/app/admin/(dashboard)/contacts/page.tsx
src/app/admin/(dashboard)/contacts/[id]/page.tsx
src/features/admin/contact-message-controls.tsx
src/app/(shop)/about/page.tsx
src/app/(shop)/shipping-returns/page.tsx
src/features/orders/invoice-view.tsx
src/app/account/orders/[orderNumber]/invoice/page.tsx
src/app/admin/(dashboard)/orders/[id]/invoice/page.tsx
src/features/products/quick-view-button.tsx
src/features/products/card-add-to-cart-button.tsx
src/features/products/product-list-item.tsx
src/features/products/shop-results-grid.tsx
src/features/products/shop-filter-sidebar.tsx
src/features/products/use-shop-view-mode.ts
```

Deleted: `src/app/account/profile/`, `src/app/account/addresses/`,
`src/app/account/security/` (all three fully superseded by
`src/app/account/settings/page.tsx`).

## 8. Important Rules — do not change these without a strong reason

All rules from the prior session's HANDOFF.md still apply:

- **Do not revert the `CartSheetTrigger` fix.** Do not reintroduce
  `React.cloneElement()` targeting a composite component anywhere in the
  cart/nav code.
- **Do not change Prisma major version.** Stay on Prisma 6.19.3.
- **`src/proxy.ts`, not `middleware.ts`.**
- **Currency is BDT/৳ throughout.** `formatPrice()` uses a manual
  symbol-prefix format, not `Intl`'s currency style.
- **Delivery charge calculation is centralized** in
  `src/server/services/delivery.service.ts`. The new Shipping & Returns page
  reads from `getAllDeliveryCharges()` — don't hardcode ৳70/100/150
  anywhere, including in that page.
- **Don't delete a Cloudinary asset without checking
  `isImageUrlReferencedByOrders()` first.**
- **Keep the "explicit per-action callback" pattern in
  `GalleryImageUploader`.**
- **`OrderDetailView` requires an `invoiceHref` prop** (see §3) — there is
  no default, by design, since the customer and admin invoice routes key by
  different identifiers.
- **Quick View reuses `AddToCartForm`/`ProductGallery`** — if you change
  either of those, Quick View picks up the change automatically. Don't build
  a parallel simplified add-to-cart flow just for the modal.
- **`getSession()` is the only place that should decide "is this a real,
  active user."** It already does the DB existence/active check — don't
  add a second one elsewhere, and don't bypass it by reading
  `session.sub`/JWT payloads directly in a new service. If you add a new
  service that needs the current user's id for a DB write, call
  `getSession()` (or `getCurrentUser()`/`requireUser()`) — never
  `verifySessionToken()` directly outside of `src/proxy.ts`.
- **`src/proxy.ts` intentionally still uses raw `verifySessionToken()`**,
  not `getSession()` — it runs on the Edge runtime, which can't reach
  Prisma here. This means a stale-but-signature-valid cookie can still
  pass the proxy's route gate; the page underneath then correctly treats
  the user as logged out rather than crashing, but surfaces Next.js's
  generic error page instead of a clean redirect (no `error.tsx` boundary
  exists yet). Known, narrow, pre-existing edge case — see `CHANGELOG.md`.
  Don't try to fully close this without either an Edge-compatible Prisma
  driver or an `error.tsx`/redirect boundary; that's a real architecture
  decision, not a quick patch.
- **Never replace a real import with a placeholder/stub "for testing"
  without reverting it in the same session.** This is exactly how the CSS
  regression happened — a `// DIAG: ... stripped for plain-node test`
  comment in `layout.tsx` silently killed the entire site's styling and
  sat there undetected until someone finally ran a real dev server.
- This is a **budget-conscious, practical project** — no enterprise
  features, payment gateway integrations, SMS, PDF generation, or complex
  automation beyond what's already built (the invoice's "Print / Save as
  PDF" button uses the browser's native print-to-PDF, not a PDF library —
  keep it that way).

## 9. Verification Status — read this before assuming anything works

**This sandbox still has no `node_modules` and no network access.**
Nothing in any session so far — including this stabilization pass — has
been run against a real dev server, a real database, or real Cloudinary
credentials. Every fix below was found and made by **reading the actual
code paths end-to-end** (auth → session → user → cart, and the layout →
CSS import chain), not by guessing or by pattern-matching to a likely
cause.

### VERIFIED BY REAL RUNTIME
Nothing. This sandbox cannot run `pnpm install`/`pnpm dev`. This is the
single most important line in this document — do not treat anything below
as proven until it's actually been clicked through on a running server.

### VERIFIED BY STATIC CHECK
- Ran a global `tsc` binary (`--skipLibCheck`, no `node_modules`) before
  and after this pass's changes and diffed the error-code tallies: zero new
  error codes, and the two counts that moved by exactly 1 were both in the
  pre-existing `@types/node`/`@types/react`-missing noise class (confirmed
  by the same error classes appearing in files this pass never touched) —
  not something introduced by the auth/layout changes.
- Grepped the entire project for the `DIAG`/"stripped for"/"temporarily
  disabled" pattern that caused the CSS bug — confirmed `layout.tsx` was
  the only file affected.
- Manually traced every `getSession()`/`session.sub` call site in the
  codebase (cart, wishlist, order, checkout, navbar, current-user) to
  confirm the fix in `getSession()` actually closes the gap for all of
  them, not just cart.
- Manually audited all 11 `next/image ... fill` usages in the project and
  confirmed each has a correctly `relative`/`absolute`-classed parent
  already in the JSX.
- No `eslint` (not runnable — no `node_modules`), no `pnpm build`, no
  `pnpm prisma validate` (needs a real Prisma Client generated from the
  actual database).

### NOT VERIFIED
- **The Cart P2003 fix itself.** Reasoned through and structurally sound,
  but not exercised against a real stale-session scenario on a running
  server.
- **The guest-cart-merge wiring.** Same — written and reasoned through,
  never actually run.
- **The CSS fix.** Not seen rendered in a browser. If `pnpm dev` still
  shows broken styling after this fix, something else is also wrong and
  this HANDOFF's diagnosis was incomplete — don't assume it's fixed until
  you've actually loaded a page.
- **The Image `fill` warnings resolving on their own.** Reasoned to be a
  symptom of the CSS bug, not confirmed live. If they persist after the
  CSS fix is verified, that points to a real, separate, not-yet-found
  cause.
- Every item in the original ৳20,000-scope completion pass (§3) — still
  exactly as unverified as previously documented; this pass did not
  re-check that work beyond the specific bugs described here.
- ESLint, `pnpm build`, `pnpm prisma validate`/`migrate dev` against the
  real database — none of these tools are runnable in any sandbox so far.

**The very first thing to do in the next real environment (unchanged
advice, now more urgent given what this pass found):**
```
pnpm install
pnpm prisma generate
pnpm prisma validate
```
Check for migration drift before running `pnpm prisma migrate dev` — do
**not** reset the database blindly. Then:
```
pnpm dev
```
Test, in this order (because each depends on the last actually working):
1. **CSS**: load `/` and confirm the site actually looks styled. If not,
   stop here — the CSS diagnosis in this document was wrong or incomplete.
2. **Cart FK fix**: fresh guest visit → add to cart → register a new
   account → confirm no P2003 crash and the cart still has the item you
   added as a guest (this also tests the merge fix) → log out → log back
   in → confirm the cart is still correct.
3. **Image fill warnings**: check the browser console on `/` for the
   specific warning quoted in the original bug report — confirm it's gone.
4. Then work through the full route list from the original stabilization
   request: `/`, `/shop`, `/search`, `/products/[slug]`, `/cart`,
   `/checkout`, `/login`, `/register`, `/account` + subpages, `/wishlist`,
   `/about`, `/shipping-returns`, `/contact`, and the admin routes
   (products CRUD, categories, banners, orders, customers, coupons,
   contacts, settings, invoices).
5. Run `pnpm eslint .`, `pnpm exec tsc --noEmit`, `pnpm prisma validate`,
   and `pnpm build` for real, and actually read their output rather than
   assuming success.

## 10. Prisma Version Note

Unchanged from the prior session — see `CHANGELOG.md`'s "Prisma 7 → 6
downgrade" section. Still deliberately on Prisma 6.19.3.
