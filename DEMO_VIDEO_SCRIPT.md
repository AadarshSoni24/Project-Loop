# 🎬 Project LOOP — Fast-Paced 2-Minute Demo Video Script

> **Target Duration:** ~2:00 – 2:20 Minutes  
> **Goal:** High-value, crisp walkthrough explaining all core features and all 4 AI modules without fluff.

---

### ⏱️ Timeline & Step-by-Step Script

| Timestamp | Screen & Action | Spoken Script (What to say) |
| :--- | :--- | :--- |
| **0:00 – 0:20** *(20s)* | **Login Screen** (`/login`)<br>• Click `Admin` quick fill.<br>• Click `Sign In`. | *"Hello everyone! This is **Project LOOP**, an AI-powered customer feedback intelligence platform. In fast-growing companies, feedback is scattered across support tickets, app reviews, and sales calls. LOOP aggregates this data and uses Claude AI to turn raw customer voices into a ranked, evidence-backed action list. Built with **Next.js 14 App Router, TypeScript, PostgreSQL via Prisma, and Anthropic Claude 3.5 Sonnet**."* |
| **0:20 – 0:40** *(20s)* | **Dashboard** (`/dashboard`)<br>• Hover over metric cards, sentiment doughnut & weekly graph. | *"The Executive Dashboard provides an instant pulse on customer health — tracking total feedback volume, positive vs. negative friction ratios, a 5-star customer satisfaction score, and weekly volume trends. Everything is protected with strict multi-tenant workspace isolation."* |
| **0:40 – 1:05** *(25s)* | **Inbox & Add Feedback** (`/inbox/new`)<br>• Type sample: *"Billing invoice download is timing out on Chrome"*<br>• Click `Submit` & point to green AI classification card. | *"LOOP supports multi-channel ingestion — manual entry, CSV bulk import, and streaming channels. When feedback enters the system, our **first AI module** classifies it in real-time — extracting exact sentiment score, categorizing the feature area into Billing, assigning standardized taxonomy themes, and generating a 64-dimensional semantic embedding."* |
| **1:05 – 1:25** *(20s)* | **Inbox & Filters** (`/inbox`)<br>• Filter by `Negative` sentiment or select `Theme` dropdown.<br>• Change row status from `NEW` to `REVIEWED`. | *"In the Feedback Inbox, product teams can filter by date ranges, channels, sentiments, or themes, and manage workflow statuses from NEW to REVIEWED and ACTIONED with optimistic UI updates."* |
| **1:25 – 1:45** *(20s)* | **Trends & Spikes** (`/trends`)<br>• Point to Recharts Area Chart & Surge badges. | *"Our **second AI module** tracks feedback velocity over 7, 30, and 90 days. It computes period-over-period growth rates and automatically flags critical volume surges — so engineering teams can catch emerging bugs before they escalate."* |
| **1:45 – 2:05** *(20s)* | **Ask LOOP** (`/ask`)<br>• Click prompt chip *"What are customers saying about onboarding?"*<br>• Show answer & cited evidence cards. | *"With **Ask LOOP**, stakeholders query customer sentiment using natural language. Powered by 64-dimensional vector similarity, Claude retrieves matching customer quotes and generates grounded answers citing specific evidence — completely eliminating hallucinations."* |
| **2:05 – 2:20** *(15s)* | **VoC Reports** (`/reports/[id]`)<br>• Click *"Open Digest →"* & scroll down stats, quotes & recommendations. | *"Finally, our **fourth AI module** synthesizes comprehensive Voice-of-Customer Executive Digests with key metrics, verbatim customer quotes, and actionable recommendations — fully exportable to PDF for executive leadership. Thank you!"* |

---

### 💡 Quick Tips for the Recording:
1. Keep local dev server running (`npm run dev` on `http://localhost:3000`).
2. Keep browser at 100% zoom and press `F11` for full screen if you want a clean window.
3. Use **Loom**, **OBS Studio**, or Windows Snipping Tool / Game Bar (`Win + G`) to record.
