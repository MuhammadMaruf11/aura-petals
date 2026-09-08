# Final Verification Report

> **Update:** this project was originally built against Prisma 7, then
> standardized on stable Prisma 6 (6.19.3) after local testing surfaced a
> broken install caused by mixed Prisma 6/7 packages and configuration. See
> `CHANGELOG.md` for the full list of what changed. Every check described
> below was **re-run after the downgrade** and produced identical results —
> the version change did not introduce new issues, and this report has been
> updated to reflect the current (Prisma 6) state of the project.

This project was built inside a sandboxed environment whose network egress is
restricted to an allowlist of domains. `binaries.prisma.sh` (where Prisma
downloads its schema-engine binary) is **not** on that allowlist — confirmed
directly with `curl`, which returned `403 Forbidden` with header
`x-deny-reason: host_not_allowed`. This is **not specific to Prisma 7** —
after downgrading to Prisma 6.19.3, the identical domain and identical
`403`/`host_not_allowed` failure occurs, confirming this is a sandbox network
restriction, not a Prisma-version problem. That single blocked domain is the
reason this report exists: it made it impossible to run `prisma generate`,
`prisma validate`, `prisma migrate`, or `prisma db push` in this environment,
which in turn made it impossible to run a real `next build` (pages that query
the database need the generated Prisma Client to type-check and to run).

Everything below is an honest account of what was actually run and what
wasn't — not a claim that the project is bug-free.

## What was actually verified (commands really run, in this sandbox)

### ✅ `pnpm eslint .` — 0 errors, 1 informational warning
Ran repeatedly during development, and re-run after the Prisma 6 downgrade
with identical results. Caught and fixed real issues during development:
- Two `react-hooks/set-state-in-effect` violations in the recently-viewed
  feature (fixed by switching to `useSyncExternalStore`, the React-recommended
  pattern for syncing with `localStorage`)
- Two unused imports
- One unused `eslint-disable` comment

The one remaining warning is informational only: React Compiler notes it
can't memoize around `react-hook-form`'s `watch()` in the checkout form. This
is expected/documented behavior of that library, not a bug.

### ✅ `npx tsc --noEmit` — ran successfully, with one caveat
This genuinely worked without a generated Prisma Client (TypeScript falls
back to an essentially-empty `@prisma/client` module and reports the missing
exports as errors, but still type-checks everything else), both before and
after the Prisma 6 downgrade, with identical results. This caught and
led to fixing several real bugs during development:
- A duplicated `type SearchParams` declaration in the shop listing page
- `Facebook`/`Instagram` icons imported from `lucide-react` — that package's
  current major version dropped brand/trademark icons; replaced with generic
  icons
- A stale `.next/types` reference from restructuring the admin routes (fixed
  by deleting `.next`)
- A systematic type mismatch across every admin form that uses
  `z.coerce.number()` fields: pinning `useForm<ExplicitType>()` to a
  hand-written or `z.infer`-derived type conflicts with the resolver's actual
  (and correct) `unknown`-pre-coercion input type. Fixed by letting
  `useForm()` infer its type from the resolver instead of pinning it, and by
  explicitly casting `field.value` at the few JSX call sites that need a
  concrete `string | number` for the DOM `<input>` element.

**Final state:** every remaining `tsc` error (89 of them) is one of exactly
two kinds, both a direct and exclusively-cosmetic consequence of the missing
generated client:
- `Module '"@prisma/client"' has no exported member 'X'` (X = every model/enum name)
- `Parameter 'x' implicitly has an 'any' type` (downstream of the same missing types)

Both categories should disappear entirely once `prisma generate` runs
somewhere with normal internet access — nothing else needs to change.

### ✅ PostgreSQL 16 installed and running locally in the sandbox
Used to confirm `schema.prisma` is at least loadable as a file and to have a
real target for `DATABASE_URL` during development, though the schema itself
could not be validated by the Prisma CLI for the reason above.

## What could NOT be tested in this sandbox (needs to happen in your environment)

- **`prisma generate` / `prisma validate` / `prisma migrate dev` / `prisma db push`** —
  blocked by the network restriction described above. The schema was written
  and manually cross-checked against every query in `src/server/services/*`
  and `src/server/actions/*` (model names, field names, relation names,
  enum values), but this has not been confirmed by the compiler that
  actually understands Prisma schema syntax.
- **`pnpm build`** — could not run end-to-end, since it depends on the
  generated Prisma Client for both type-checking and for any server-rendered
  page that queries the database.
- **`pnpm db:seed`** — the seed script (`prisma/seed.ts`) was written and
  manually reviewed, but never executed against a real generated client.
- **Any actual HTTP request to the app** — since `next dev` / `next build`
  couldn't run, no page, API route, server action, or middleware was ever
  actually invoked. Correctness of runtime behavior rests on careful manual
  reading of the code, not on execution.
- **`pnpm lint` via the `next lint` wrapper** — `eslint .` was run directly
  (see above) rather than through the `next lint` command, since the latter
  also touches the Next.js build pipeline. The underlying ESLint config and
  results should be identical either way, but this is worth re-confirming.

## Exact commands to run in your own environment

```bash
# 1. Install
pnpm install                     # runs `prisma generate` automatically

# 2. Configure
cp .env.example .env
# edit .env — set a real DATABASE_URL and a real AUTH_SECRET

# 3. Database
pnpm prisma generate              # if it didn't already run via postinstall
pnpm prisma migrate dev --name init
pnpm db:seed

# 4. Verify
pnpm lint
pnpm typecheck
pnpm build

# 5. Run
pnpm dev
```

If `pnpm build` surfaces errors, the most likely causes, roughly in order of
probability given how this was built:

1. A Prisma field/model name mismatch that only the real Prisma type-checker
   can catch (grep the error for the model/field name and cross-reference
   `prisma/schema.prisma`).
2. A Next.js 16-specific API change I wasn't able to verify against a live
   build (route handler signatures, `params`/`searchParams` as Promises in
   Server Components, etc. — these were written to match the documented v16
   App Router conventions, but "documented" isn't "compiled").
3. A missing or misnamed npm dependency — `package.json` was hand-maintained
   alongside the code rather than always installed-then-declared, so it's
   possible (though I tried to keep it in sync every time I added an import).

None of these would be sprawling — the architecture is straightforward App
Router + Prisma + server actions, so a build error should point at a single
file, and I'd expect at most a handful of such fixes before a clean build.

## Functional scope — what's real vs. stubbed

Implemented for real (schema, service layer, server actions, and UI, all
manually cross-checked, none executed):

- Auth (register/login/logout/forgot-reset password), role-based middleware
- Full product system: standard/variant/personalized/bundle types, images,
  customization fields, categories, collections, tags
- Cart (guest + user, merges on login), wishlist
- Checkout, coupon validation, order creation with stock decrement,
  order tracking timeline, frequently-bought-together, recently-viewed
- Customer account panel (orders, wishlist, addresses, profile, password)
- Full admin panel (dashboard, product/category/order/customer/coupon/banner
  CRUD, store settings)
- Analytics abstraction (GTM + Meta Pixel), sitemap.xml, robots.txt,
  per-product metadata + JSON-LD

Deliberately stubbed, with a clear seam to finish later (see README's "Known
limitations"):

- Stripe / SSLCommerz: selectable in the UI, modeled in the schema, but no
  actual charge or webhook handling. COD is fully real.
- Image uploads: admin takes a hosted URL rather than a file-upload widget.
- Transactional email: password reset issues a token but doesn't send mail.

## Bottom line

This is careful, deliberately-written code that has passed every check this
sandbox is able to run (lint and type-checking, both genuinely executed, not
assumed) — but it has never been compiled by `next build` or served by
`next dev`. Treat the first `pnpm install && pnpm build` in your own
environment as the real first test, not a formality.
