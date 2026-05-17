# Aura & Petals - Advanced Engineering Edge-Cases (CAVEATS)

This file contains critical structural constraints to prevent serverless timeouts, data corruption, and infrastructure cost inflation.

## 1. Concurrency & Stock Locks (Race Conditions)
- When a customer places an order, you MUST use a PostgreSQL transaction.
- Check product inventory using `SELECT ... FOR UPDATE` before updating the stock counter.
- Never allow a stock integer to drop below 0. Reject the transaction safely with a typed database error.

## 2. Serverless Execution Guardrails (Anti-Timeout)
- Vercel serverless functions have a strict execution timeout.
- The Admin Product Upload endpoint must NEVER await multiple heavy network roundtrips synchronously.
- **Workflow:** 1. Complete the Supabase DB row insertion first.
  2. Immediately return a `200 OK` response to the client.
  3. Let Supabase Native Webhooks handle the Make.com background triggering asynchronously.

## 3. Offloading Image Optimization from Vercel
- Do NOT use the default Next.js image optimization loader, as it drains Vercel serverless bandwidth.
- Implement a custom Cloudinary loader utility (`/lib/cloudinary-loader.ts`):
  ```typescript
  export default function cloudinaryLoader({ src, width, quality }: any) {
    const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`].join(',');
    return `https://res.cloudinary.com/${process.env.CLOUDINARY_URL}/image/upload/${params}/${src}`;
  }