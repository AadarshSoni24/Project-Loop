# Project LOOP — AI Customer-Feedback Intelligence Platform

> **"Close the loop on customer feedback."**  
> A corporate-grade, multi-tenant Voice-of-Customer (VoC) analytics platform built with **Next.js 14 (App Router), TypeScript, PostgreSQL (Supabase), Prisma ORM, NextAuth.js, and Anthropic Claude AI**.

---

## ?? Executive Overview

Modern product companies receive hundreds of customer feedback snippets weekly across support tickets, App Store reviews, NPS surveys, sales notes, and community discussions. Individually, each item is a sentence or two; collectively, they reveal what a company should build, fix, or improve next.

**Project LOOP** ingests multi-channel feedback, uses AI to classify and cluster it into trending themes, flags spiking friction points, and provides a retrieval-grounded (RAG) conversational interface to answer plain-English questions backed by real customer evidence.

---

## ? Quick Start (Get Running in Under 2 Minutes)

### 1. Prerequisites
- **Node.js 18+ LTS** and **npm**
- A **Supabase PostgreSQL** database (or local PostgreSQL)
- *(Optional)* Anthropic Claude API key (built-in intelligent local fallback engine provided)

### 2. Clone & Install Dependencies
```bash
git clone https://github.com/AadarshSoni24/Project-Loop.git
cd Project-Loop
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

NEXTAUTH_SECRET="your-super-secret-session-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Uses live Claude 3.5 Sonnet if provided; uses smart local heuristics if omitted
ANTHROPIC_API_KEY=""
```

### 4. Initialize Database & Seed Demo Data
```bash
# Push Prisma schema to Supabase PostgreSQL
npx prisma db push

# Seed 125 realistic feedback items, 7 themes, and 3 role accounts
npm run db:seed
```

### 5. Run Local Development Server
```bash
npm run dev
# App will run at http://localhost:3000
```

### 6. Run Automated Backend Test Suite
```bash
npx tsx test_backend.ts
```

---

## ?? Demo Login Credentials (For Evaluators & Mentors)

The database seed script automatically provisions three role-based accounts within the **Acme Corp** workspace for testing RBAC:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@acme.com` | `admin123` | Full access: ingest feedback, trigger reports, manage themes, delete records |
| **ANALYST** | `analyst@acme.com` | `admin123` | Feedback ingestion, bulk CSV import, theme tagging, Ask LOOP, VoC report generation |
| **VIEWER** | `viewer@acme.com` | `admin123` | Read-only access: view inbox, analytics dashboards, search, and generated reports |

---

## ??? System Architecture & Data Flow

```text
 +-------------------------------------------------------------+
 ¦               Next.js 14 Client / Dashboard                 ¦
 +-------------------------------------------------------------+
                                ¦ (HTTPS / JSON)
                                ?
 +-------------------------------------------------------------+
 ¦       Next.js App Router API Handlers (REST Layer)          ¦
 ¦  • Session Validation (NextAuth.js JWT)                     ¦
 ¦  • Role-Based Access Control (RBAC Guard: Admin/Analyst/View)¦
 ¦  • Strict Tenant Scoping (WHERE workspaceId = user.workspace)¦
 +-------------------------------------------------------------+
                ¦                              ¦
                ?                              ?
 +-----------------------------+ +-----------------------------+
 ¦ PostgreSQL / Supabase DB    ¦ ¦ Anthropic Claude AI Engine  ¦
 ¦  • Workspace & Users (RBAC) ¦ ¦  • Claude 3.5 Sonnet SDK    ¦
 ¦  • Feedback (Multi-channel) ¦ ¦  • Structured JSON Parsing  ¦
 ¦  • Themes & Join Relations  ¦ ¦  • Grounded RAG Generation  ¦
 ¦  • Vector Embeddings        ¦ ¦  • VoC Executive Synthesis  ¦
 +-----------------------------+ +-----------------------------+
```

### Non-Negotiable Security Rules:
1. **Tenant Isolation**: Every database query touching feedback, themes, reports, or users is strictly filtered by `workspaceId`. A user from Company A can never read or mutate records from Company B.
2. **Server-Side AI & Secrets**: Anthropic API keys and database credentials remain strictly on the server—never exposed to the client browser.

---

## ?? AI Intelligence Features (Modules AI1 – AI4)

### 1. AI1: Structured Auto-Classification (`lib/ai/classifier.ts`)
- Evaluates raw feedback upon ingestion and returns structured JSON.
- Extracts:
  - **Sentiment**: `POS` (Positive), `NEU` (Neutral), `NEG` (Negative)
  - **Sentiment Score**: Float between `-1.0` and `+1.0`
  - **Feature Area**: Categorization (e.g., *Billing & Payments*, *Team Onboarding*, *Security & SSO*, *Performance*, *Mobile App*)
  - **Themes**: Standardized taxonomy tags
  - **Rationale**: One-line reasoning explaining the categorization

### 2. AI2: Theme Clustering & Trend Spike Detection (`lib/ai/clustering.ts`)
- Aggregates feedback volume across customizable timeframes (e.g., 7 or 30 days).
- Computes period-over-period growth percentages:
  $$\Delta\% = \frac{\text{Current Period} - \text{Previous Period}}{\text{Previous Period}} \times 100$$
- Automatically flags emerging customer friction points (`isSpiking: true`) when growth exceeds critical thresholds.

### 3. AI3: Ask LOOP — Retrieval-Augmented Generation (RAG) (`lib/ai/rag.ts`)
- **Semantic Retrieval**: Converts incoming queries and feedback items into 64-dimensional vector embeddings and performs cosine similarity matching.
- **Evidence Grounding**: Feeds top-$K$ matching customer quotes to Claude with strict system prompts: *"Answer solely using the provided feedback excerpts; cite specific customer items and do not hallucinate facts."*

### 4. AI4: Voice-of-Customer (VoC) Executive Digest (`lib/ai/reports.ts`)
- Pre-computes key statistics in code (total volume, sentiment breakdown, positive/negative ratios, theme distribution).
- Directs Claude to synthesize an executive-ready narrative detailing key friction themes, customer quotes, and actionable product recommendations.

---

## ??? Database Data Model (`prisma/schema.prisma`)

```text
 +---------------+
 ¦   Workspace   ¦?--------+
 +---------------+         ¦ (workspaceId)
         ¦ 1:N             ¦
         +-----------------+------------------+
         ?                 ?                  ?
  +-------------+   +-------------+    +-------------+
  ¦    User     ¦   ¦  Feedback   ¦    ¦    Theme    ¦
  +-------------+   +-------------+    +-------------+
                           ¦ 1:N              ¦ 1:N
                           ?                  ?
                    +--------------------------------+
                    ¦ FeedbackTheme (Join Table)     ¦
                    ¦   • feedbackId, themeId        ¦
                    ¦   • confidence (0..1)          ¦
                    +--------------------------------+
```

- **`Workspace`**: Tenant boundary (`id`, `name`, `createdAt`).
- **`User`**: Account identity (`id`, `name`, `email`, `passwordHash`, `role`, `workspaceId`).
- **`Feedback`**: Customer voice record (`id`, `content`, `channel`, `sourceRef`, `customerLabel`, `sentiment`, `sentimentScore`, `featureArea`, `status`, `workspaceId`).
- **`Theme`**: Tag category (`id`, `name`, `description`, `color`, `workspaceId`).
- **`FeedbackTheme`**: Composite join table (`feedbackId`, `themeId`, `confidence`).
- **`Embedding`**: Vector representation (`id`, `feedbackId`, `vector`).
- **`Report`**: Generated VoC digest (`id`, `title`, `periodStart`, `periodEnd`, `contentJson`, `workspaceId`, `generatedBy`).

---

## ?? REST API Reference

| Endpoint | Method | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/[...nextauth]` | `POST/GET` | Public | NextAuth credentials authentication & session management |
| `/api/feedback` | `GET` | Authenticated | Fetch paginated, filtered feedback list (by channel, sentiment, status, theme, search, date) |
| `/api/feedback` | `POST` | ADMIN, ANALYST | Create new feedback with automated AI classification and vector embedding |
| `/api/feedback/bulk` | `POST` | ADMIN, ANALYST | Bulk ingest feedback from JSON arrays or CSV uploads |
| `/api/feedback/simulate` | `POST` | ADMIN, ANALYST | Ingest simulated streaming feedback from support tickets, app reviews, and sales notes |
| `/api/feedback/[id]` | `GET` | Authenticated | Fetch single feedback item with linked themes and embedding metadata |
| `/api/feedback/[id]` | `PATCH` | ADMIN, ANALYST | Update feedback status (`NEW` ? `REVIEWED` ? `ACTIONED`) or trigger re-classification |
| `/api/feedback/[id]` | `DELETE` | ADMIN, ANALYST | Delete a feedback entry |
| `/api/insights/ask` | `POST` | Authenticated | Ask LOOP natural language questions grounded in customer feedback |
| `/api/themes` | `GET` | Authenticated | Retrieve workspace themes with trend growth metrics and spike flags |
| `/api/themes` | `POST` | ADMIN, ANALYST | Create a new custom workspace theme |
| `/api/reports` | `GET` | Authenticated | List all generated VoC executive digests |
| `/api/reports` | `POST` | ADMIN, ANALYST | Generate a new Voice-of-Customer executive digest report |

---

## ??? Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 14.2 (App Router) + TypeScript | Full-stack serverless architecture & typed API endpoints |
| **Database** | PostgreSQL (Supabase) | Relational integrity and multi-tenant data storage |
| **ORM** | Prisma ORM 5.22 | Type-safe schema definitions, relationships, and queries |
| **Authentication** | NextAuth.js (Auth.js) + bcryptjs | Secure JWT session management and RBAC guards |
| **AI Intelligence** | Anthropic Claude 3.5 Sonnet (`@anthropic-ai/sdk`) | Structured classification, grounded RAG Q&A, and report generation |
| **Data Validation** | Zod 3.23 | Strict schema validation across all API boundaries |
| **Visualizations** | Recharts | Trend graphs, sentiment breakdowns, and volume charts |
| **Styling** | Tailwind CSS + clsx | Modern responsive design system |

---

## ?? Testing & Verification

The project includes an automated end-to-end backend integration test suite verifying workspace isolation, RBAC permissions, and all 4 AI modules:

```bash
npx tsx test_backend.ts
```

**Expected Test Output:**
```text
?? Starting Project LOOP Backend Automated Integration Tests...

? 1. Multi-Tenant Workspace Verified: "Acme Corp"
? 2. RBAC Users Verified: 3 users present (ADMIN, ANALYST, VIEWER)
? 3. Feedback Inbox Verified: 125 records in workspace
? 3b. Single Feedback Record Lookup Verified

--- Testing AI1: Auto-Classification Engine --- Passed
--- Testing AI2: Theme Clustering & Spike Trend Detection --- Passed
--- Testing AI3: Ask LOOP Grounded RAG Q&A --- Passed
--- Testing AI4: Voice-of-Customer Digest Report Generator --- Passed

?? ALL BACKEND INTEGRATION TESTS PASSED 100% CLEANLY!
```

---

## ?? License & Academic Integrity

Built as part of the **Zidio Development Web Development Internship Program** (Corporate Track).  
All architecture, schema designs, and AI implementations are original and compliant with the Project LOOP Specification & Rubric.
