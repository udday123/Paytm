# Deploying your Wallet App to Vercel

Since this is a Turborepo monorepo, you need to set up **three separate projects** on Vercel, all linked to the same GitHub repository.

## Prerequisites
- A hosted PostgreSQL database (e.g., [Neon](https://neon.tech/) or [Supabase](https://supabase.com/)).
- Your `DATABASE_URL` and `NEXTAUTH_SECRET`.

---

## 1. User App (`user-app`)
- **Root Directory**: `apps/user-app`
- **Framework Preset**: Next.js
- **Environment Variables**:
  ```env
  DATABASE_URL="your_neon_or_supabase_url_here"
  JWT_SECRET="your_random_secret_here"
  NEXTAUTH_SECRET="your_random_secret_here"
  NEXTAUTH_URL="https://your-deployment-url.vercel.app"
  ```

## 2. Merchant App (`merchant-app`)
- **Root Directory**: `apps/merchant-app`
- **Framework Preset**: Next.js
- **Environment Variables**:
  ```env
  DATABASE_URL="your_neon_or_supabase_url_here"
  JWT_SECRET="your_random_secret_here"
  NEXTAUTH_SECRET="your_random_secret_here"
  ```

## 3. Bank Webhook (`bank-webhook`)
- **Root Directory**: `apps/bank-webhook`
- **Framework Preset**: Other (it will detect `vercel.json`)
- **Environment Variables**:
  ```env
  DATABASE_URL="your_neon_or_supabase_url_here"
  ```

---

> [!IMPORTANT]
> **Monorepo Settings**: Vercel should automatically detect that this is a Turborepo. If it asks, ensure the "Root Directory" is set correctly for each project as listed above.
