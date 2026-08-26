import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function generateVector(text: string): number[] {
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, '');
  const tokens = normalized.split(/\s+/).filter(Boolean);
  const vector = new Array(64).fill(0);

  for (const token of tokens) {
    let hash = 0;
    for (let i = 0; i < token.length; i++) {
      hash = (hash << 5) - hash + token.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % 64;
    vector[idx] += 1;
  }

  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (magnitude === 0) return vector;
  return vector.map((val) => val / magnitude);
}

const FEEDBACK_TEMPLATES = [
  // Onboarding
  { content: "Onboarding took forever — I couldn't figure out how to invite my team members without an admin key.", channel: "support_ticket", sentiment: "NEG", score: -0.75, area: "Onboarding", themes: ["Team Onboarding"] },
  { content: "The interactive onboarding checklist was super clear! Setup took less than 5 minutes.", channel: "nps_survey", sentiment: "POS", score: 0.85, area: "Onboarding", themes: ["Team Onboarding"] },
  { content: "Getting started guide is missing steps for configuring multi-factor authentication.", channel: "community_post", sentiment: "NEU", score: -0.10, area: "Onboarding", themes: ["Team Onboarding", "Security & SSO"] },
  { content: "Onboarding wizard froze on step 3 when importing team CSV list.", channel: "support_ticket", sentiment: "NEG", score: -0.80, area: "Onboarding", themes: ["Team Onboarding"] },

  // Billing & Invoicing
  { content: "Billing page keeps timing out when I try to download invoice PDFs for last quarter.", channel: "support_ticket", sentiment: "NEG", score: -0.85, area: "Billing & Payments", themes: ["Billing & Invoicing"] },
  { content: "Would love the ability to pay annually via direct wire transfer instead of credit card.", channel: "sales_call", sentiment: "NEU", score: 0.0, area: "Billing & Payments", themes: ["Billing & Invoicing"] },
  { content: "The clear breakdown of monthly seat costs on the billing tab is much appreciated.", channel: "app_store", sentiment: "POS", score: 0.70, area: "Billing & Payments", themes: ["Billing & Invoicing"] },

  // Enterprise SSO & Security
  { content: "Prospect wants SAML 2.0 SSO before they will sign the enterprise contract — 3rd time this month.", channel: "sales_call", sentiment: "NEG", score: -0.65, area: "Security & SSO", themes: ["Enterprise SSO"] },
  { content: "Okta integration documentation was straightforward. We had single sign-on working in 1 hour.", channel: "community_post", sentiment: "POS", score: 0.90, area: "Security & SSO", themes: ["Enterprise SSO"] },
  { content: "Need granular workspace permissions so contractors can view dashboards without editing settings.", channel: "sales_call", sentiment: "NEU", score: 0.10, area: "Security & SSO", themes: ["Enterprise SSO"] },

  // Performance & Speed
  { content: "The new analytics dashboard is gorgeous and finally fast. Huge speed improvement over last release!", channel: "app_store", sentiment: "POS", score: 0.95, area: "Performance & Speed", themes: ["Dashboard UX", "Performance"] },
  { content: "Dashboard page load takes over 8 seconds when filtering across 10,000 feedback records.", channel: "support_ticket", sentiment: "NEG", score: -0.70, area: "Performance & Speed", themes: ["Performance"] },
  { content: "Search queries are returning results instantly now. Great work by the engineering team!", channel: "community_post", sentiment: "POS", score: 0.80, area: "Performance & Speed", themes: ["Performance"] },

  // Mobile App
  { content: "It does the job, but the mobile app experience needs work on smaller phone screens.", channel: "nps_survey", sentiment: "NEU", score: -0.20, area: "Mobile Experience", themes: ["Mobile App"] },
  { content: "Mobile push notifications for critical sentiment alerts are working reliably.", channel: "app_store", sentiment: "POS", score: 0.75, area: "Mobile Experience", themes: ["Mobile App"] },
  { content: "App crashes on launch on iOS 18 beta build when tapping the notification banner.", channel: "support_ticket", sentiment: "NEG", score: -0.90, area: "Mobile Experience", themes: ["Mobile App"] },

  // Data Export & Reports
  { content: "Love the new PDF report export feature! Saved me over an hour preparing for management meeting today.", channel: "community_post", sentiment: "POS", score: 0.90, area: "Data Export", themes: ["Data Exporting"] },
  { content: "Exported CSV data format changed without notice, breaking our internal Python analytics script.", channel: "support_ticket", sentiment: "NEG", score: -0.60, area: "Data Export", themes: ["Data Exporting"] },
];

async function main() {
  console.log('🌱 Starting Project LOOP database seed script...');

  // Clean old seed data if present
  await prisma.embedding.deleteMany();
  await prisma.feedbackTheme.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.theme.deleteMany();
  await prisma.report.deleteMany();
  await prisma.user.deleteMany();
  await prisma.workspace.deleteMany();

  const workspace = await prisma.workspace.create({
    data: {
      name: 'Acme Corp',
    },
  });
  console.log(`✅ Created Workspace: ${workspace.name} (${workspace.id})`);

  const passwordHash = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.user.create({
    data: {
      name: 'Alice Admin',
      email: 'admin@acme.com',
      passwordHash,
      role: 'ADMIN',
      workspaceId: workspace.id,
    },
  });

  const analystUser = await prisma.user.create({
    data: {
      name: 'Bob Analyst',
      email: 'analyst@acme.com',
      passwordHash,
      role: 'ANALYST',
      workspaceId: workspace.id,
    },
  });

  const viewerUser = await prisma.user.create({
    data: {
      name: 'Charlie Viewer',
      email: 'viewer@acme.com',
      passwordHash,
      role: 'VIEWER',
      workspaceId: workspace.id,
    },
  });

  console.log(`✅ Created Demo Accounts (Password: admin123):`);
  console.log(`   - ADMIN:   admin@acme.com`);
  console.log(`   - ANALYST: analyst@acme.com`);
  console.log(`   - VIEWER:  viewer@acme.com`);

  const themeData = [
    { name: 'Team Onboarding', description: 'Feedback regarding new user setup, team invites, and getting started.', color: '#3b82f6' },
    { name: 'Billing & Invoicing', description: 'Subscriptions, payment gateways, invoices, and wire transfers.', color: '#ef4444' },
    { name: 'Enterprise SSO', description: 'Single sign-on, SAML, Okta integration, and access security.', color: '#8b5cf6' },
    { name: 'Dashboard UX', description: 'User interface experience, charts, widgets, and navigation.', color: '#10b981' },
    { name: 'Performance', description: 'Page load latency, query speed, and app responsiveness.', color: '#f59e0b' },
    { name: 'Mobile App', description: 'iOS and Android native mobile app features and crashes.', color: '#ec4899' },
    { name: 'Data Exporting', description: 'CSV, PDF, and automated reports export functionality.', color: '#06b6d4' },
  ];

  const themeMap = new Map<string, string>();
  for (const t of themeData) {
    const createdTheme = await prisma.theme.create({
      data: {
        ...t,
        workspaceId: workspace.id,
      },
    });
    themeMap.set(t.name, createdTheme.id);
  }
  console.log(`✅ Seeded ${themeMap.size} Workspace Themes`);

  const now = new Date();
  const feedbackRecords = [];

  for (let i = 0; i < 125; i++) {
    const template = FEEDBACK_TEMPLATES[i % FEEDBACK_TEMPLATES.length];
    const daysAgo = Math.floor(Math.random() * 30);
    const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000 - Math.random() * 3600000);

    const statuses = ['NEW', 'REVIEWED', 'ACTIONED'];
    const status = statuses[i % 3];

    feedbackRecords.push({
      content: `${template.content} (Ref #${1000 + i})`,
      channel: template.channel,
      sourceRef: `REF-${2000 + i}`,
      customerLabel: `Customer #${100 + (i % 20)}`,
      sentiment: template.sentiment,
      sentimentScore: template.score,
      featureArea: template.area,
      status,
      createdAt,
      workspaceId: workspace.id,
      themes: template.themes,
    });
  }

  let seededFeedbackCount = 0;
  for (const item of feedbackRecords) {
    const { themes, ...data } = item;
    const createdFb = await prisma.feedback.create({ data });

    for (const themeName of themes) {
      const themeId = themeMap.get(themeName);
      if (themeId) {
        await prisma.feedbackTheme.create({
          data: {
            feedbackId: createdFb.id,
            themeId,
            confidence: 0.92,
          },
        });
      }
    }

    const vector = generateVector(item.content);
    await prisma.embedding.create({
      data: {
        feedbackId: createdFb.id,
        vector: JSON.stringify(vector),
      },
    });

    seededFeedbackCount++;
  }

  console.log(`✅ Seeded ${seededFeedbackCount} realistic customer feedback items with vector embeddings & themes.`);
  console.log(`🚀 Seed script execution finished successfully!`);
}

main()
  .catch((e) => {
    console.error('❌ Seed script error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
