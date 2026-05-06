# Aura & Petals - Project Agent Instruction & Rules

You are an expert AI software engineer and architect specialized in Next.js (App Router), Supabase, and system automation. Follow these guidelines strictly when developing or modifying any files for the "Aura & Petals" multi-tenant e-commerce and SaaS platform.

## 1. Project Overview
Aura & Petals is a production-level E-commerce and SaaS platform for SMEs and startups. It provides a highly customizable store front, automated social media content distribution, and administrative controls.

## 2. Technology Stack & Infrastructure
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS (Palette: Sage Green `#8A9A5B`, Dusty Rose `#DCAE96`, Champagne Gold `#D4AF37`, Soft Off-White `#FAF9F6`)
- **Animations:** Framer Motion
- **Database & Auth:** Supabase (Database, Auth, and Storage)
- **Media Uploads:** Cloudinary (handles product images and video URLs)
- **Automation Engine:** Make.com Webhooks (triggered via Supabase database changes)

---

## 3. Core Modules & Architecture

### A. Frontend / Storefront (End-User Interface)
- **Home Page:** Hero section, featured collections, category navigation.
- **Shop / Products Page:** Grid layout, multi-parameter filtering, sorting, and search bar.
- **Product Detail Page:** Multi-image display, pricing, specs, and Add-to-Cart options.
- **Auth & Profile:** User registration, login, profile settings, and order history tracking.
- **Contact Page:** User contact form that links directly to the SME Admin Panel.

### B. Admin Panel (SMEs / Tenants)
- **Branding & Layout Control:** Upload logo and dynamically update primary/secondary colors using Tailwind variables.
- **Product CRUD:** Create, Read, Update, and Delete products with multi-image/video support. 
- **Message Board:** View and respond to customer queries from the contact page.
- **Image Lifecycle:** Delete/Update images automatically from Cloudinary when a product is modified or removed.

### C. Super-Admin Dashboard (SaaS Owner)
- **Subscription Management:** Activate, adjust, or deactivate client tenant instances.
- **Pricing Tiers:** Adjust limits and plan tiers for different business scales.
- **Payment Processing:** Manual recording and verification of bKash and Nagad transactions.

---

## 4. Automation & Media Rules (Make.com)

- **Rule 1 (Images):** - Send to: Facebook, Instagram, LinkedIn, and the website.
  - Exclusions: Do *not* send images to YouTube and TikTok.
  - Multi-image support: Can be added or updated via the Admin panel.

- **Rule 2 (Video Content - Reels/Shorts only):** - Send to: Facebook, Instagram, YouTube, TikTok, and LinkedIn.
  - Constraints: Video files must *not* be rendered on the website interface.

---

## 5. Coding Guidelines
- **App Router Conventions:** Keep client/server components clearly separated; use `use client` strictly where interactivity or state is required.
- **Data Fetching:** Use React Query (TanStack Query) or standard `fetch` with Next.js caching techniques for optimized performance.
- **Responsive Design:** Mobile-first layout using Tailwind classes, especially to ensure that S24 Ultra imagery is fully optimized via Next/Image components.