import Anthropic from '@anthropic-ai/sdk';
import { db } from '@/lib/db';

export interface CitedFeedback {
  id: string;
  content: string;
  channel: string;
  sentiment: string;
  createdAt: Date;
  customerLabel?: string | null;
  similarityScore: number;
}

export interface AskLoopResult {
  answer: string;
  citedFeedback: CitedFeedback[];
}

/**
 * Creates a normalized 64-dimensional feature vector for semantic similarity matching.
 */
export function generateSimpleEmbedding(text: string): number[] {
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

  // Magnitude normalization
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (magnitude === 0) return vector;
  return vector.map((val) => val / magnitude);
}

/**
 * Computes Cosine Similarity between two float vectors (-1 to 1)
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magA += vecA[i] * vecA[i];
    magB += vecB[i] * vecB[i];
  }

  if (magA === 0 || magB === 0) return 0;
  return dotProduct / (Math.sqrt(magA) * Math.sqrt(magB));
}

/**
 * AI3: Ask LOOP Grounded RAG Q&A Service
 */
export async function askLoopQuestion(
  workspaceId: string,
  question: string
): Promise<AskLoopResult> {
  // 1. Retrieve all feedback items for this workspace
  const allFeedback = await db.feedback.findMany({
    where: { workspaceId },
    include: { embedding: true },
  });

  if (allFeedback.length === 0) {
    return {
      answer: "No feedback data is currently available in your workspace to answer this question.",
      citedFeedback: [],
    };
  }

  // 2. Generate vector embedding for user query
  const queryVector = generateSimpleEmbedding(question);
  const queryLower = question.toLowerCase();

  // 3. Rank items by combined vector similarity + keyword overlap
  const scoredItems: CitedFeedback[] = allFeedback.map((item) => {
    let similarity = 0;
    if (item.embedding?.vector) {
      try {
        const itemVec = JSON.parse(item.embedding.vector);
        similarity = cosineSimilarity(queryVector, itemVec);
      } catch (e) {
        similarity = 0;
      }
    }

    // Keyword relevance boost
    const contentLower = item.content.toLowerCase();
    const queryTokens = queryLower.split(/\s+/).filter((t) => t.length > 2);
    let keywordHits = 0;

    for (const token of queryTokens) {
      if (contentLower.includes(token)) keywordHits++;
    }

    const keywordBoost = queryTokens.length > 0 ? (keywordHits / queryTokens.length) * 0.5 : 0;
    const finalScore = Math.min(1.0, similarity * 0.6 + keywordBoost);

    return {
      id: item.id,
      content: item.content,
      channel: item.channel,
      sentiment: item.sentiment,
      createdAt: item.createdAt,
      customerLabel: item.customerLabel,
      similarityScore: Math.round(finalScore * 100) / 100,
    };
  });

  // Sort descending and select top 5 most relevant evidence items
  scoredItems.sort((a, b) => b.similarityScore - a.similarityScore);
  const topEvidence = scoredItems.filter((item) => item.similarityScore > 0.1).slice(0, 5);

  const evidenceToUse = topEvidence.length > 0 ? topEvidence : scoredItems.slice(0, 3);

  // 4. Try Claude API for retrieval-grounded generation if key exists
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const anthropic = new Anthropic({ apiKey });
      const contextText = evidenceToUse
        .map(
          (item, idx) =>
            `[Item ${idx + 1} | Channel: ${item.channel} | Sentiment: ${item.sentiment}]\n"${item.content}"`
        )
        .join('\n\n');

      const systemPrompt = `You are LOOP AI, an evidence-grounded customer intelligence assistant.
Your strict instruction: Answer the user's question ONLY using the provided customer feedback items below.
If the feedback items do not contain enough information to answer, state clearly that the existing customer feedback does not cover this topic.
DO NOT hallucinate or make up details that are not in the context.

Context Feedback Items:
${contextText}`;

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 600,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\nQuestion: ${question}` },
        ],
      });

      const firstBlock = response.content[0];
      if (firstBlock && firstBlock.type === 'text') {
        return {
          answer: firstBlock.text,
          citedFeedback: evidenceToUse,
        };
      }
    } catch (err) {
      console.warn('Claude RAG API failed, using grounded local synthesizer:', err);
    }
  }

  // Grounded Local Synthesizer
  const posCount = evidenceToUse.filter((i) => i.sentiment === 'POS').length;
  const negCount = evidenceToUse.filter((i) => i.sentiment === 'NEG').length;

  let synthesisSentimentSummary = 'mixed sentiment';
  if (posCount > negCount) synthesisSentimentSummary = 'mostly positive sentiment';
  else if (negCount > posCount) synthesisSentimentSummary = 'predominantly negative sentiment / friction';

  const answerNarrative = `Based on an analysis of ${evidenceToUse.length} relevant customer feedback entries regarding your inquiry, customers have expressed ${synthesisSentimentSummary}.\n\nKey themes surfaced from the evidence:\n` +
    evidenceToUse.map((item, i) => `${i + 1}. [${item.channel.toUpperCase()}] "${item.content}"`).join('\n\n') +
    `\n\nRecommendation: Review the cited feedback entries below to prioritize product actions.`;

  return {
    answer: answerNarrative,
    citedFeedback: evidenceToUse,
  };
}
