# 🚀 Vercel Deployment & Environment Variables Guide

This guide walks you through deploying **Project LOOP** to Vercel with a production PostgreSQL database in 3 minutes.

---

## 1. Environment Variables for Vercel

When deploying on Vercel, navigate to **Project Settings $\to$ Environment Variables** and add the following:

| Variable Name | Required | Example / Description |
| :--- | :---: | :--- |
| `DATABASE_URL` | **Yes** | `postgresql://user:password@ep-cool-night-123456.us-east-2.aws.neon.tech/neondb?sslmode=require` *(From Neon or Supabase)* |
| `DIRECT_URL` | **Yes** | Direct connection URL *(Same as `DATABASE_URL` for Neon; port 5432 direct for Supabase)* |
| `NEXTAUTH_SECRET` | **Yes** | `project_loop_super_secret_session_key_2026_zidio` *(Any random 32+ character string)* |
| `NEXTAUTH_URL` | **Yes** | `https://your-project-name.vercel.app` *(Your Vercel live domain URL)* |
| `ANTHROPIC_API_KEY` | Optional | `sk-ant-api03-...` *(Optional: If omitted, built-in smart heuristic engine is used)* |

---

## 2. Step-by-Step Deployment Instructions

### Step 1: Set up Free Hosted PostgreSQL (Neon.tech or Supabase)

#### Option A: Neon.tech (Recommended — 30 seconds setup)
1. Go to [neon.tech](https://neon.tech) and create a free account.
2. Create a new project named `project-loop`.
3. Copy the **Connection String** provided on your dashboard:
   ```text
   postgresql://alex:password@ep-cool-night-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

#### Option B: Supabase
1. Go to [supabase.com](https://supabase.com) and create or unpause your project.
2. Go to **Project Settings $\to$ Database $\to$ Connection String**.
3. Copy the **Transaction Pooler URL** (Port `6543`) for `DATABASE_URL` and **Direct Connection** (Port `5432`) for `DIRECT_URL`.

---

### Step 2: Push Schema & Seed the Hosted Database

Before your app goes live, push the tables and seed 125+ customer feedback items, embeddings, and accounts to your hosted database:

1. In your local terminal, update `.env` with your new hosted `DATABASE_URL`.
2. Run:
   ```powershell
   # 1. Push Prisma schema to hosted PostgreSQL
   npx prisma db push

   # 2. Seed the 125+ records, themes, embeddings & demo accounts
   npx tsx prisma/seed.ts
   ```

---

### Step 3: Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import your GitHub repository: **`AadarshSoni24/Project-Loop`**.
3. Under **Environment Variables**, paste:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (e.g. `https://project-loop.vercel.app`)
4. Click **Deploy**.

Vercel will automatically run `npm install`, execute `prisma generate` via the `postinstall` hook, and compile the Next.js production build cleanly!

---

## 3. Demo Credentials for Testing & Grading

Once deployed, log into your live site at `/login` with any of these pre-seeded accounts:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **👑 Admin** | `admin@acme.com` | `admin123` | Full workspace management, invite members, settings |
| **🔬 Analyst** | `analyst@acme.com` | `admin123` | Ingest feedback, CSV bulk import, AI re-classification, VoC reports |
| **👀 Viewer** | `viewer@acme.com` | `admin123` | Read-only view for dashboard, charts, trends, and reports |
