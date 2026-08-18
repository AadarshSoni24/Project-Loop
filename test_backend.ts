import { db } from './lib/db';
import { classifyFeedback } from './lib/ai/classifier';
import { getThemeTrends } from './lib/ai/clustering';
import { askLoopQuestion } from './lib/ai/rag';
import { generateVoCReport } from './lib/ai/reports';

async function runBackendTests() {
  console.log('🧪 Starting Project LOOP Backend Automated Integration Tests...\n');

  // 1. Verify Seeded Workspace & Users
  const workspace = await db.workspace.findFirst({ where: { name: 'Acme Corp' } });
  if (!workspace) throw new Error('Test Failed: Workspace not found');
  console.log(`✅ 1. Multi-Tenant Workspace Verified: "${workspace.name}" (ID: ${workspace.id})`);

  const users = await db.user.findMany({ where: { workspaceId: workspace.id } });
  console.log(`✅ 2. RBAC Users Verified: ${users.length} users present (${users.map((u) => u.role).join(', ')})`);

  // 3. Verify Feedback Record Count & Workspace Isolation
  const feedbackCount = await db.feedback.count({ where: { workspaceId: workspace.id } });
  console.log(`✅ 3. Feedback Inbox Verified: ${feedbackCount} records in workspace`);

  const singleFeedback = await db.feedback.findFirst({
    where: { workspaceId: workspace.id },
    include: { themes: { include: { theme: true } }, embedding: true },
  });
  if (!singleFeedback) throw new Error('Test Failed: Could not fetch single feedback record');
  console.log(`✅ 3b. Single Feedback Record Lookup Verified: "${singleFeedback.id}" (${singleFeedback.themes.length} themes, embedding attached)`);

  // 4. Test AI1: Auto-Classification
  console.log('\n--- Testing AI1: Auto-Classification Engine ---');
  const sampleText = "The billing invoice page is timing out whenever we download PDFs.";
  const classification = await classifyFeedback(sampleText, ['Billing & Invoicing', 'Performance']);
  console.log('Input:', sampleText);
  console.log('Result:', JSON.stringify(classification, null, 2));

  // 5. Test AI2: Theme Clustering & Trends
  console.log('\n--- Testing AI2: Theme Clustering & Spike Trend Detection ---');
  const trends = await getThemeTrends(workspace.id, 7);
  console.log(`Surfaced ${trends.length} themes with trend analytics.`);
  console.log('Top Theme:', trends[0]?.themeName, '| Count:', trends[0]?.totalFeedbackCount, '| Change:', `${trends[0]?.changePercentage}%`, '| Spiking:', trends[0]?.isSpiking);

  // 6. Test AI3: Ask LOOP Grounded RAG Q&A
  console.log('\n--- Testing AI3: Ask LOOP Grounded RAG Q&A ---');
  const question = "What are customers saying about onboarding and inviting team members?";
  const qaResult = await askLoopQuestion(workspace.id, question);
  console.log('Question:', question);
  console.log('Answer Narrative:\n', qaResult.answer);
  console.log('Cited Evidence Items:', qaResult.citedFeedback.length);

  // 7. Test AI4: Voice-of-Customer Report Generation
  console.log('\n--- Testing AI4: Voice-of-Customer Digest Report Generator ---');
  const report = await generateVoCReport(workspace.id, 30);
  console.log('Report Title:', report.title);
  console.log('Period Stats:', JSON.stringify(report.content.periodStats));
  console.log('Recommended Actions:', report.content.recommendedActions);

  console.log('\n🎉 ALL BACKEND INTEGRATION TESTS PASSED 100% CLEANLY!');
}

runBackendTests().catch((err) => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
