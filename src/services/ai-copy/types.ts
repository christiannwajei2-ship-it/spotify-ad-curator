// ===================================================
// AI Copy Generator Types
// ===================================================

export type CopyTone =
  | 'professional'  // Clean, authoritative, brand-safe
  | 'casual'        // Friendly, conversational, relatable
  | 'gen-z'         // Trendy slang, memes, POV hooks
  | 'emotional'     // Heart-tugging, story-driven, sentimental
  | 'hype'          // Energetic, FOMO, urgency-driven
  | 'minimal';      // Short, punchy, less is more

export type AdPlatformType =
  | 'meta'            // Facebook & Instagram
  | 'tiktok'          // TikTok short-form video
  | 'youtube'         // YouTube video ads
  | 'google-search'   // Google Search ads
  | 'google-display'; // Google Display Network

// ===================================================
// Request
// ===================================================

export interface AICopyRequest {
  platform: AdPlatformType;
  genre: string;
  mood: string;
  playlistName: string;
  trackCount: number;
  tone: CopyTone;
}

// ===================================================
// Variant (one generated copy set)
// ===================================================

export interface AICopyVariant {
  id: string;
  primaryText: string;   // Main body copy (social post / video script hook)
  headline: string;      // Short headline — must respect platform char limits
  description: string;   // Supporting description line
  cta: string;           // Call-to-action button text
  platform: AdPlatformType;
  tone: CopyTone;
  charCounts: {
    primaryText: number;
    headline: number;
    description: number;
    cta: number;
  };
  generatedAt: string;
}

// ===================================================
// Response
// ===================================================

export interface AICopyResponse {
  variants: AICopyVariant[];
  platform: AdPlatformType;
  tone: CopyTone;
  generatedAt: string;
  isDemo: boolean;  // true when generated from templates (no API key)
}

// ===================================================
// Character limits per platform
// ===================================================

export const PLATFORM_CHAR_LIMITS: Record<AdPlatformType, { headline: number; description: number; primaryText: number; cta: number }> = {
  'meta':           { headline: 40,  description: 30,  primaryText: 500, cta: 20 },
  'tiktok':         { headline: 50,  description: 100, primaryText: 300, cta: 20 },
  'youtube':        { headline: 30,  description: 90,  primaryText: 200, cta: 20 },
  'google-search':  { headline: 30,  description: 90,  primaryText: 90,  cta: 15 },
  'google-display': { headline: 30,  description: 90,  primaryText: 90,  cta: 20 },
};

export const TONE_DESCRIPTIONS: Record<CopyTone, string> = {
  professional: 'Clean, authoritative, brand-safe',
  casual:       'Friendly, conversational, relatable',
  'gen-z':      'Trendy slang, memes, POV hooks',
  emotional:    'Heart-tugging, story-driven, sentimental',
  hype:         'Energetic, FOMO, urgency-driven',
  minimal:      'Short, punchy, less is more',
};

export const PLATFORM_LABELS: Record<AdPlatformType, string> = {
  'meta':           '📘 Meta',
  'tiktok':         '📱 TikTok',
  'youtube':        '📺 YouTube',
  'google-search':  '🔍 Google Search',
  'google-display': '🖼️ Google Display',
};
