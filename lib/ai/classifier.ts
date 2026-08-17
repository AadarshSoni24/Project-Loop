import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

export const ClassificationResultSchema = z.object({
  sentiment: z.enum(['POS', 'NEU', 'NEG']),
  sentimentScore: z.number().min(-1).max(1),
  featureArea: z.string(),
  themes: z.array(z.string()),
  rationale: z.string().optional(),
});

export type ClassificationResult = z.infer<typeof ClassificationResultSchema>;

/**
 * AI1: Auto-Classification Service
 * Uses Anthropic Claude API if key exists, otherwise falls back to intelligent local keyword/rule engine.
 */
export async function classifyFeedback(
  content: string,
  existingThemes: string[] = []
): Promise<ClassificationResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (apiKey && apiKey.trim().length > 10) {
    try {
      const anthropic = new Anthropic({ apiKey });
      const prompt = `You are an expert customer feedback classifier for SaaS applications.
Classify the following customer feedback text.

Available standard themes: ${existingThemes.length ? existingThemes.join(', ') : 'Onboarding, Performance, Billing, Mobile, UI/UX, Feature Request, SSO, Integrations, Bugs/Errors'}

Return ONLY a valid JSON object matching this exact schema:
{
  "sentiment": "POS" | "NEU" | "NEG",
  "sentimentScore": number between -1.0 (extremely negative) and 1.0 (extremely positive),
  "featureArea": string (e.g. "Billing", "Dashboard", "Authentication", "Mobile App", "Onboarding", "Export", "Performance"),
  "themes": string[] (array of 1-3 concise theme names, matching existing themes if applicable),
  "rationale": string (1 short sentence explaining why)
}

Feedback: "${content.replace(/"/g, '\\"')}"`;

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      });

      const firstBlock = response.content[0];
      if (firstBlock && firstBlock.type === 'text') {
        const jsonMatch = firstBlock.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const validated = ClassificationResultSchema.safeParse(parsed);
          if (validated.success) {
            return validated.data;
          }
        }
      }
    } catch (error) {
      console.warn('Claude API call failed or misformatted, using smart fallback engine:', error);
    }
  }

  // Smart Local Fallback Classification Engine
  return classifyFeedbackLocally(content, existingThemes);
}

function classifyFeedbackLocally(content: string, existingThemes: string[] = []): ClassificationResult {
  const lower = content.toLowerCase();

  // Keyword dictionary for sentiment
  const posKeywords = ['love', 'gorgeous', 'fast', 'improvement', 'saved', 'great', 'awesome', 'excellent', 'useful', 'happy', 'fantastic', 'easy', 'seamless'];
  const negKeywords = ['forever', 'couldn\'t', 'timing out', 'broken', 'slow', 'fail', 'bug', 'error', 'frustrated', 'terrible', 'worst', 'issue', 'hard', 'cannot', 'stuck', 'crash'];

  let posCount = 0;
  let negCount = 0;

  for (const w of posKeywords) {
    if (lower.includes(w)) posCount++;
  }
  for (const w of negKeywords) {
    if (lower.includes(w)) negCount++;
  }

  let sentiment: 'POS' | 'NEU' | 'NEG' = 'NEU';
  let sentimentScore = 0.0;

  if (posCount > negCount) {
    sentiment = 'POS';
    sentimentScore = Math.min(1.0, 0.4 + posCount * 0.25);
  } else if (negCount > posCount) {
    sentiment = 'NEG';
    sentimentScore = Math.max(-1.0, -0.4 - negCount * 0.25);
  } else {
    sentiment = 'NEU';
    sentimentScore = 0.0;
  }

  // Feature Area detection
  let featureArea = 'General / Other';
  if (lower.includes('onboard') || lower.includes('invite') || lower.includes('signup') || lower.includes('getting started')) featureArea = 'Onboarding';
  else if (lower.includes('bill') || lower.includes('invoice') || lower.includes('price') || lower.includes('payment') || lower.includes('charge')) featureArea = 'Billing & Payments';
  else if (lower.includes('dash') || lower.includes('chart') || lower.includes('analytics') || lower.includes('view')) featureArea = 'Dashboard & UI';
  else if (lower.includes('sso') || lower.includes('login') || lower.includes('auth') || lower.includes('password') || lower.includes('security')) featureArea = 'Security & SSO';
  else if (lower.includes('mobile') || lower.includes('ios') || lower.includes('android') || lower.includes('app store')) featureArea = 'Mobile Experience';
  else if (lower.includes('export') || lower.includes('csv') || lower.includes('pdf') || lower.includes('download')) featureArea = 'Data Export';
  else if (lower.includes('fast') || lower.includes('slow') || lower.includes('time out') || lower.includes('performance') || lower.includes('latency')) featureArea = 'Performance & Speed';

  // Theme matching
  const matchedThemes: string[] = [];
  if (featureArea !== 'General / Other') {
    matchedThemes.push(featureArea);
  }

  if (lower.includes('onboard') || lower.includes('invite')) matchedThemes.push('Team Onboarding');
  if (lower.includes('bill') || lower.includes('invoice')) matchedThemes.push('Billing & Invoicing');
  if (lower.includes('sso') || lower.includes('security')) matchedThemes.push('Enterprise SSO');
  if (lower.includes('mobile') || lower.includes('app')) matchedThemes.push('Mobile Experience');
  if (lower.includes('dash') || lower.includes('fast') || lower.includes('gorgeous')) matchedThemes.push('Dashboard UX');
  if (lower.includes('export') || lower.includes('download')) matchedThemes.push('Data Exporting');

  const finalThemes = Array.from(new Set(matchedThemes)).slice(0, 2);
  if (finalThemes.length === 0) {
    finalThemes.push('General Product Experience');
  }

  return {
    sentiment,
    sentimentScore: Math.round(sentimentScore * 100) / 100,
    featureArea,
    themes: finalThemes,
    rationale: `Automated sentiment detection (${sentiment}) based on keyword analysis and feature mapping.`,
  };
}
