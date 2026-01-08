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
  - `DATABASE_URL`: Your database connection string.
  - `NEXTAUTH_SECRET`: A random string for authentication.
  - `NEXTAUTH_URL`: The URL where this app will be deployed.

## 2. Merchant App (`merchant-app`)
- **Root Directory**: `apps/merchant-app`
- **Framework Preset**: Next.js
- **Environment Variables**:
  - `DATABASE_URL`: Same as above.
  - `NEXTAUTH_SECRET`: Same as above.

## 3. Bank Webhook (`bank-webhook`)
- **Root Directory**: `apps/bank-webhook`
- **Framework Preset**: Other (it will detect `vercel.json`)
- **Environment Variables**:
  - `DATABASE_URL`: Same as above.

---

> [!IMPORTANT]
> **Monorepo Settings**: Vercel should automatically detect that this is a Turborepo. If it asks, ensure the "Root Directory" is set correctly for each project as listed above.
