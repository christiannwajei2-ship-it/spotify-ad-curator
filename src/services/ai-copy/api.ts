// ===================================================
// OpenAI API Integration for Ad Copy Generation
// ===================================================

import type { AICopyRequest, AICopyVariant } from './types';
import { PLATFORM_CHAR_LIMITS } from './types';
import { buildPrompt, SYSTEM_PROMPT } from './prompts';
import { generateId } from '../../utils/helpers';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const VARIANTS_COUNT = 5;

// Simple in-memory rate limiter — max 10 requests per minute
const requestTimestamps: number[] = [];
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

const checkRateLimit = (): void => {
  const now = Date.now();
  // Remove timestamps older than 1 minute
  while (requestTimestamps.length > 0 && now - requestTimestamps[0] > RATE_LIMIT_WINDOW_MS) {
    requestTimestamps.shift();
  }
  if (requestTimestamps.length >= RATE_LIMIT_MAX) {
    throw new Error('Rate limit reached. Please wait a moment before generating more copy.');
  }
  requestTimestamps.push(now);
};

// ===================================================
// Parse OpenAI JSON response
// ===================================================

interface RawCopyResponse {
  primaryText?: string;
  headline?: string;
  description?: string;
  cta?: string;
}

const parseVariantJson = (raw: string): RawCopyResponse => {
  // Strip potential markdown fences
  const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  try {
    return JSON.parse(cleaned) as RawCopyResponse;
  } catch {
    // Try to extract JSON object from string
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]) as RawCopyResponse;
    }
    throw new Error('Failed to parse AI response as JSON');
  }
};

const truncate = (text: string, max: number): string =>
  text.length > max ? text.slice(0, max - 1) + '…' : text;

// ===================================================
// Single variant call
// ===================================================

const generateSingleVariant = async (
  req: AICopyRequest,
  apiKey: string,
  model: string
): Promise<AICopyVariant> => {
  checkRateLimit();

  const prompt = buildPrompt(req);
  const limits = PLATFORM_CHAR_LIMITS[req.platform];

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: prompt },
      ],
      temperature: 0.85,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: { message: response.statusText } }));
    const msg = (err as { error?: { message?: string } }).error?.message ?? response.statusText;
    throw new Error(`OpenAI API error: ${msg}`);
  }

  const data = await response.json() as {
    choices: { message: { content: string } }[];
  };
  const content = data.choices[0]?.message?.content ?? '{}';
  const parsed = parseVariantJson(content);

  const primaryText  = truncate(parsed.primaryText  ?? '', limits.primaryText);
  const headline     = truncate(parsed.headline     ?? '', limits.headline);
  const description  = truncate(parsed.description  ?? '', limits.description);
  const cta          = truncate(parsed.cta          ?? 'Listen Now', limits.cta);

  return {
    id: generateId(),
    primaryText,
    headline,
    description,
    cta,
    platform: req.platform,
    tone: req.tone,
    charCounts: {
      primaryText:  primaryText.length,
      headline:     headline.length,
      description:  description.length,
      cta:          cta.length,
    },
    generatedAt: new Date().toISOString(),
  };
};

// ===================================================
// Public: generate 5 variants
// ===================================================

export const generateAdCopy = async (request: AICopyRequest): Promise<AICopyVariant[]> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  const model  = (import.meta.env.VITE_OPENAI_MODEL as string | undefined) ?? 'gpt-4';

  if (!apiKey) {
    throw new Error('No OpenAI API key configured. Using demo mode instead.');
  }

  // Generate variants sequentially to stay within rate limits and be cost-efficient
  const variants: AICopyVariant[] = [];
  for (let i = 0; i < VARIANTS_COUNT; i++) {
    const variant = await generateSingleVariant(request, apiKey, model);
    variants.push(variant);
  }
  return variants;
};
