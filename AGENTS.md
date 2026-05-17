
## ⚠️ CRITICAL: Tailwind CSS v4 & Next.js Modern Syntax Rules
- Do NOT use `@tailwind base; @tailwind components;` syntax (V3).
- ALWAYS use Tailwind v4 CSS-first configuration syntax: `@import "tailwindcss";` in the global CSS file.
- Do NOT use arbitrary values like `bg-[#8A9A5B]` everywhere. You must map theme colors to dynamic CSS variables in the theme layer: `:root { --primary: #8A9A5B; }` and use `bg-(--primary)`.
- Use Next.js async component parameters for Dynamic Routes. `params` and `searchParams` are Promises now:
  ```typescript
  // Right Way:
  export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
  }
# This is NOT the Next.js you know
This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
# Aura & Petals - Multi-Tenant SaaS Master System Instructions

You are an expert full-stack AI engineer specializing in ultra-scalable Next.js (App Router) architectures, Supabase backend ecosystems, and dynamic caching layer optimizations. Follow these instructions flawlessly.

---

## 1. Core Architecture & Tech Stack

### Frontend & Rendering
- **Framework:** Next.js (App Router). Strictly separate Server Components (default) and Client Components (`'use client'`).
- **Styling:** TailwindCSS + `clsx` for dynamic theme injection.
- **UI Libraries:** Shadcn-style primitives. Do NOT use heavy component UI libraries (No Ant Design, No Material UI).
- **State & Fetching:** React Query (TanStack Query) for async server state. Zustand ONLY for volatile client UI states.

### Backend, Database & Cache
- **BaaS Platform:** Supabase (Auth, PostgreSQL Database, and Native Realtime).
- **ORM:** Prisma ORM (Connecting via Supabase connection pooling string).
- **High-Performance Cache:** Redis (via Upstash Redis SDK) to cache active Tenant Branding & Metadata.

### External & Automation
- **Media Engine:** Cloudinary (Direct secure frontend uploads; lifecycle API route deletions).
- **Automation Pipeline:** Supabase database triggers pulsing outbound webhooks to Make.com.

---

## 2. Multi-Tenancy & Dynamic Routing Rules

Every piece of data, user, configuration, or order belongs to a specific business user called a **Tenant**. 



### Hostname Interception (`middleware.ts`)
1. Multi-tenancy must operate on a single deployed codebase handling dynamic subdomains and mapped custom domains.
2. The middleware must capture `request.nextUrl.hostname`.
3. Check **Redis Cache** first for the hostname mapping. If empty, fall back to Supabase `tenants` table.
4. Rewrite the destination internally to `/store/[tenant_slug]`. The end-user must see their clean domain (e.g., `saffronglow.com` or `shop1.aurapetals.com`) in the address bar.

### Database Isolation (Row Level Security)
1. Every shared table (`products`, `orders`, `categories`, `messages`) MUST contain a `tenant_id: UUID` column.
2. Enable strict PostgreSQL RLS policies so no tenant can ever read, update, or cross-contaminate another tenant's rows.

---

## 3. Automation & Media Distribution Rules (Make.com)

- **Trigger:** Any `INSERT` or `UPDATE` operation on the `products` database table.
- **Rule A (Image Assests):** Uploaded via Cloudinary (Supports multiple high-res URLs). Distribute to Facebook, Instagram, LinkedIn, and render directly on the public storefront. **Exclusion:** Never sync static images to YouTube or TikTok.
- **Rule B (Short-Form Video):** Uploaded via Cloudinary (Strictly vertical Reels/Shorts format). Distribute to Facebook, Instagram, YouTube Shorts, TikTok, and LinkedIn. **Constraint:** Videos must NEVER be rendered or loaded anywhere on the consumer-facing web storefront to optimize page speeds.

---

## 4. Performance & Caching Guardrails

1. **The Redis Law:** General public storefront operations (fetching logo, theme colors, product categories) must hit the Upstash Redis cache first. Only fetch from Supabase if cache misses, then re-populate cache with a 24-hour TTL.
2. **Bandwidth Optimization:** Never pipeline raw unoptimized Cloudinary URLs directly to the user. Append Cloudinary dynamic transformation flags (`w_auto,q_auto,f_auto`) inside the Next.js `Image` wrapper.
3. **Pagination & Streaming:** Every product catalog view, admin table, and data grid must use server-side paginated queries. Avoid overfetching at all costs.

---

## 5. Security Standards

1. **Zero-Trust Frontend:** Never trust role-permissions or input payloads sent from the client side. Always re-verify JWT sub-claims and validate input shapes via Server-Side Zod schemas.
2. **Automated Cloud Cleanup:** When a product or tenant drops/deletes an image asset inside the Admin dashboard, trigger a background serverless execution to delete that file from Cloudinary immediately. No dead weight storage.