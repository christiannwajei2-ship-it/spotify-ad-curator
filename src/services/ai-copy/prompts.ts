// ===================================================
// AI Copy Prompt Templates (per platform + tone)
// ===================================================

import type { AICopyRequest, CopyTone, AdPlatformType } from './types';

// ===================================================
// Tone style guides injected into each prompt
// ===================================================

const TONE_GUIDES: Record<CopyTone, string> = {
  professional: `Use clean, authoritative language. No slang or contractions. Focus on credibility, curation quality, and brand value. Tone should feel like a premium music service.`,
  casual: `Use friendly, conversational language. Contractions OK. Speak directly to the listener like a friend sharing a playlist recommendation. Relatable and warm.`,
  'gen-z': `Use trendy Gen-Z language: POV hooks ("POV: you just found your new playlist"), em dashes for aesthetic, lowercase where it fits, internet slang (no cap, it's giving, fr fr). Include 2-3 relevant hashtags in primaryText.`,
  emotional: `Write heart-tugging, story-driven copy. Focus on emotions, memories, and feelings the music creates. Use sensory language and vulnerability. Make the listener feel something.`,
  hype: `Go FULL HYPE. Use ALL CAPS for emphasis, exclamation marks, FOMO triggers ("everyone's listening"), urgency ("don't sleep on this"), energetic verbs. Create excitement and urgency.`,
  minimal: `Less is more. Short sentences. No fluff. Every word earns its place. Punchy and direct. Use line breaks for impact.`,
};

// ===================================================
// Platform-specific prompt builders
// ===================================================

const buildMetaPrompt = (req: AICopyRequest): string => `
You are a Meta Ads copywriter for Spotify playlists. Generate ONE ad copy variant for Facebook/Instagram feed ads.

Playlist details:
- Name: "${req.playlistName}"
- Genre: ${req.genre}
- Mood: ${req.mood}
- Track count: ${req.trackCount}

Tone guide: ${TONE_GUIDES[req.tone]}

Platform rules:
- primaryText: emotional, story-driven, up to 500 characters. Can use emojis. 2-4 paragraphs.
- headline: max 40 characters. Grab attention instantly.
- description: max 30 characters. One punchy supporting line.
- cta: max 20 characters (e.g. "Listen Now", "Follow Playlist", "Play Free")

Return ONLY valid JSON in this exact shape (no markdown, no explanation):
{"primaryText":"...","headline":"...","description":"...","cta":"..."}
`;

const buildTikTokPrompt = (req: AICopyRequest): string => `
You are a TikTok Ads copywriter for Spotify playlists. Generate ONE ad copy variant for TikTok video ads.

Playlist details:
- Name: "${req.playlistName}"
- Genre: ${req.genre}
- Mood: ${req.mood}
- Track count: ${req.trackCount}

Tone guide: ${TONE_GUIDES[req.tone]}

Platform rules:
- primaryText: short-form hook (max 300 chars). Start with a pattern-interrupt or POV hook. Include 2-3 hashtags at end.
- headline: max 50 characters. Trendy, scroll-stopping.
- description: max 100 characters. Amplify the hook.
- cta: max 20 characters (e.g. "Listen Now", "Stream Free", "Follow Playlist")

Return ONLY valid JSON in this exact shape (no markdown, no explanation):
{"primaryText":"...","headline":"...","description":"...","cta":"..."}
`;

const buildYouTubePrompt = (req: AICopyRequest): string => `
You are a YouTube Ads copywriter for Spotify playlists. Generate ONE ad copy variant for YouTube video ads.

Playlist details:
- Name: "${req.playlistName}"
- Genre: ${req.genre}
- Mood: ${req.mood}
- Track count: ${req.trackCount}

Tone guide: ${TONE_GUIDES[req.tone]}

Platform rules:
- primaryText: benefit-focused hook for pre-roll ad (max 200 chars). Must hook in first 5 seconds.
- headline: max 30 characters. Benefit-driven. No punctuation at end.
- description: max 90 characters. Feature + benefit.
- cta: max 20 characters (e.g. "Listen Now", "Stream Free", "Open Spotify")

Return ONLY valid JSON in this exact shape (no markdown, no explanation):
{"primaryText":"...","headline":"...","description":"...","cta":"..."}
`;

const buildGoogleSearchPrompt = (req: AICopyRequest): string => `
You are a Google Search Ads copywriter for Spotify playlists. Generate ONE responsive search ad copy variant.

Playlist details:
- Name: "${req.playlistName}"
- Genre: ${req.genre}
- Mood: ${req.mood}
- Track count: ${req.trackCount}

Tone guide: ${TONE_GUIDES[req.tone]}

STRICT character limits (Google enforces these):
- primaryText: max 90 characters. Keyword-rich body copy.
- headline: HARD LIMIT 30 characters. Must include the genre or playlist name.
- description: HARD LIMIT 90 characters. Clear benefit + CTA.
- cta: max 15 characters (e.g. "Listen Free", "Play Now", "Stream Today")

Return ONLY valid JSON in this exact shape (no markdown, no explanation):
{"primaryText":"...","headline":"...","description":"...","cta":"..."}
`;

const buildGoogleDisplayPrompt = (req: AICopyRequest): string => `
You are a Google Display Network copywriter for Spotify playlists. Generate ONE display ad copy variant.

Playlist details:
- Name: "${req.playlistName}"
- Genre: ${req.genre}
- Mood: ${req.mood}
- Track count: ${req.trackCount}

Tone guide: ${TONE_GUIDES[req.tone]}

Platform rules:
- primaryText: visual-first, curiosity-driven (max 90 chars). Works alongside an image.
- headline: max 30 characters. Short, visual-first.
- description: max 90 characters. Curiosity + benefit.
- cta: max 20 characters (e.g. "Discover Now", "Listen Free", "Play on Spotify")

Return ONLY valid JSON in this exact shape (no markdown, no explanation):
{"primaryText":"...","headline":"...","description":"...","cta":"..."}
`;

export const buildPrompt = (req: AICopyRequest): string => {
  const builders: Record<AdPlatformType, (r: AICopyRequest) => string> = {
    'meta':           buildMetaPrompt,
    'tiktok':         buildTikTokPrompt,
    'youtube':        buildYouTubePrompt,
    'google-search':  buildGoogleSearchPrompt,
    'google-display': buildGoogleDisplayPrompt,
  };
  return builders[req.platform](req);
};

export const SYSTEM_PROMPT = `You are an expert advertising copywriter specialising in music streaming promotions. You write compelling, platform-native ad copy for Spotify playlist campaigns. Always return ONLY the requested JSON — no markdown fences, no explanation, no extra text.`;
