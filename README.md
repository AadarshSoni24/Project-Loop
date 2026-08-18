# Project LOOP — Voice of Customer AI Intelligence Platform

**Project LOOP** is a multi-tenant Voice-of-Customer (VoC) analytics platform built with Next.js, Prisma, TypeScript, and AI integrations (Anthropic Claude 3.5 Sonnet with intelligent local fallbacks).

---

## 🌟 Core Features & AI Intelligence System

### 1. 🏷️ AI1: Auto-Classification Engine (`lib/ai/classifier.ts`)
- Automatically categorizes raw feedback into sentiment classes (`POS`, `NEU`, `NEG`) and computes sentiment scores (-1.0 to 1.0).
- Identifies feature areas (e.g., *Billing & Payments*, *Team Onboarding*, *Security & SSO*, *Performance*).
- Tag feedback with standard themes and provides classification rationales.

### 2. 📈 AI2: Theme Clustering & Spike Trend Detection (`lib/ai/clustering.ts`)
- Computes period-over-period volume growth for themes across configurable time windows (e.g., 7 days).
- Detects rapidly spiking customer friction points to highlight emerging issues before they escalate.

### 3. 🔍 AI3: Grounded RAG Q&A System ("Ask LOOP") (`lib/ai/rag.ts`)
- Generates 64-dimensional vector embeddings and performs cosine similarity matching combined with keyword relevance ranking.
- Synthesizes grounded answers citing specific customer feedback entries to prevent AI hallucinations.

### 4. 📰 AI4: Voice-of-Customer Digest Generator (`lib/ai/reports.ts`)
- Auto-generates executive VoC digests summarizing feedback volume, sentiment breakdown, positive/negative ratios, top themes, and recommended product actions.

---

## 🚀 REST API Reference

| Endpoint | Method | Role / Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/feedback` | `GET` | Authenticated | List workspace feedback with filtering (channel, sentiment, status, theme, search, date) and pagination |
| `/api/feedback` | `POST` | ADMIN, ANALYST | Create new feedback entry with automatic AI classification and vector embedding |
| `/api/feedback/[id]` | `GET` | Authenticated | Fetch single feedback entry with linked themes and embedding metadata |
| `/api/feedback/[id]` | `PATCH` | ADMIN, ANALYST | Update feedback status (`NEW`, `REVIEWED`, `ACTIONED`) or trigger re-classification |
| `/api/feedback/[id]` | `DELETE` | ADMIN, ANALYST | Delete a feedback record |
| `/api/feedback/bulk` | `POST` | ADMIN, ANALYST | Bulk ingest feedback via JSON array or CSV text |
| `/api/feedback/simulate` | `POST` | ADMIN, ANALYST | Simulate streaming customer feedback from various channels |
| `/api/insights/ask` | `POST` | Authenticated | Ask LOOP a natural language question grounded in workspace feedback |
| `/api/reports` | `GET` | Authenticated | List all generated VoC executive digest reports |
| `/api/reports` | `POST` | ADMIN, ANALYST | Trigger Voice-of-Customer report generation |
| `/api/themes` | `GET` | Authenticated | Fetch themes with trend analytics and spike flags |
| `/api/themes` | `POST` | ADMIN, ANALYST | Create a custom workspace theme |

---

## 🛠️ Setup & Running Locally

### 1. Installation & Database Setup
```bash
# Install dependencies
npm install

# Push database schema to SQLite
npm run db:push

# Seed demo workspace data & sample feedback
npm run db:seed
```

### 2. Integration Testing
```bash
# Run 100% clean automated backend test suite
npx tsx test_backend.ts
```

### 3. Environment Variables (`.env`)
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-super-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
ANTHROPIC_API_KEY="optional-claude-api-key"
```

---

## 🧪 Testing & Code Quality

- **Type Check**: `npx tsc --noEmit`
- **Lint**: `npm run lint`
- **Backend Test Suite**: `npx tsx test_backend.ts`
