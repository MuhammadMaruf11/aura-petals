# Aura & Petals - Implementation Roadmap

This file tracks the systematic, step-by-step assembly of the platform. Implement one phase cleanly before initializing the next.

- [ ] **Phase 1: Environment & Base Engine Setup**
  - [ ] Standardize Environment keys (`.env.local`).
  - [ ] Initialize Prisma client with Supabase Postgres connector.
  - [ ] Set up Upstash Redis connector client utility under `/lib/redis.ts`.

- [ ] **Phase 2: Core Database Layer**
  - [ ] Push schema to Supabase.
  - [ ] Activate RLS (Row Level Security) definitions.

- [ ] **Phase 3: Multi-Tenant Middleware Routing**
  - [ ] Implement `middleware.ts` to intercept hostnames and rewrite internal slugs to `/store/[tenant_slug]`.
  - [ ] Build the Redis caching utility to resolve hostnames within milliseconds.

- [ ] **Phase 4: Storefront & Branding Subsystems**
  - [ ] Build CSS dynamic theme provider reading variables (Primary/Secondary) from tenant settings.
  - [ ] Develop Main Catalog, Category, Filterable Grid, and Product detail views.

- [ ] **Phase 5: SME Admin Dashboard & Automation Hook**
  - [ ] Set up Cloudinary client-side upload widgets.
  - [ ] Build full Product CRUD dashboards that automatically flush caching entries on updates.
  - [ ] Hook Database tables with Make.com webhook parameters for outbound notifications.