// ===================================================
// AI Copy Generator — Orchestrator
// ===================================================
// Handles:
//   - Calling the OpenAI API (when key available)
//   - Fallback to smart template-based copy (demo mode)
//   - Caching to avoid re-generating identical requests
// ===================================================

import type { AICopyRequest, AICopyVariant, AICopyResponse, AdPlatformType, CopyTone } from './types';
import { PLATFORM_CHAR_LIMITS } from './types';
import { generateAdCopy } from './api';
import type { PlaylistAnalysis, TargetingRecommendation } from '../../types';
import { generateId } from '../../utils/helpers';
import { capitalize } from '../../utils/formatters';

// ===================================================
// Cache (keyed by request fingerprint)
// ===================================================

const cache = new Map<string, AICopyResponse>();

const cacheKey = (req: AICopyRequest): string =>
  `${req.platform}|${req.genre}|${req.mood}|${req.playlistName}|${req.trackCount}|${req.tone}`;

// ===================================================
// Template-based demo copy (no API key needed)
// ===================================================

const EMOJI_MAP: Record<string, string> = {
  afrobeats: '🌍', afropop: '🌍', 'k-pop': '🇰🇷', kpop: '🇰🇷',
  'hip-hop': '🎤', hiphop: '🎤', rap: '🎤', edm: '🎛️', house: '🎛️',
  dance: '🎛️', 'r&b': '🎷', soul: '🎷', rock: '🎸', metal: '🎸',
  jazz: '🎺', country: '🤠', folk: '🤠', classical: '🎻',
  latin: '💃', reggaeton: '💃', indie: '🎵', alternative: '🎵', pop: '🎵',
};

const getEmoji = (genre: string): string =>
  EMOJI_MAP[genre.toLowerCase()] ?? '🎵';

// Platform-specific demo variant factories
type DemoFactory = (req: AICopyRequest, index: number) => Omit<AICopyVariant, 'id' | 'charCounts' | 'generatedAt'>;

const META_TEMPLATES: DemoFactory[] = [
  (req) => ({
    platform: req.platform, tone: req.tone,
    primaryText: `${getEmoji(req.genre)} Discover ${capitalize(req.genre)} vibes you'll absolutely love ❤️\n\nHandpicked tracks, curated with soul. "${req.playlistName}" doesn't miss — every song hits different.\n\n🎧 ${req.trackCount} tracks of pure ${capitalize(req.genre)} perfection\n✨ Follow the playlist, change your mood instantly`,
    headline: `Your New Fave ${capitalize(req.genre)} Playlist ❤️`,
    description: `${req.trackCount} handpicked tracks`,
    cta: 'Listen Now',
  }),
  (req) => ({
    platform: req.platform, tone: req.tone,
    primaryText: `🔥 ${req.trackCount} tracks handpicked for ${req.mood} lovers\n\nEveryone's been streaming "${req.playlistName}" on repeat. You're missing out if you haven't heard it yet.\n\n❤️ Curated for real ${capitalize(req.genre)} fans\n🎵 New tracks added regularly`,
    headline: `${req.trackCount} ${capitalize(req.genre)} Tracks You Need`,
    description: `Don't sleep on this playlist`,
    cta: 'Listen Now',
  }),
  (req) => ({
    platform: req.platform, tone: req.tone,
    primaryText: `Your next favourite playlist is here 💜\n\n${getEmoji(req.genre)} ${capitalize(req.genre)} • ${req.trackCount} songs\n\n"Finally a playlist that gets it right!" — real listeners\n\nFollow "${req.playlistName}" and never skip a track again.`,
    headline: `"${req.playlistName.length > 35 ? req.playlistName.slice(0, 35) + '…' : req.playlistName}"`,
    description: `${capitalize(req.genre)} • ${req.trackCount} tracks`,
    cta: 'Follow Now',
  }),
  (req) => ({
    platform: req.platform, tone: req.tone,
    primaryText: `❤️‍🔥 Not algorithmically generated. Every. Single. Track. is chosen with intention.\n\n${getEmoji(req.genre)} Pure ${capitalize(req.genre)} energy\n🎵 ${req.trackCount} songs • Updated regularly\n\nIf you know, you know. Follow and stream.`,
    headline: `Real ${capitalize(req.genre)} Hits Only ❤️‍🔥`,
    description: `Hand-curated, no fillers`,
    cta: 'Stream Free',
  }),
  (req) => ({
    platform: req.platform, tone: req.tone,
    primaryText: `🎧 The ${req.mood} ${capitalize(req.genre)} playlist you didn't know you needed.\n\n${req.trackCount} perfectly curated tracks that match exactly how you feel right now.\n\nHit play on "${req.playlistName}" — free on Spotify 🎵`,
    headline: `${req.mood} ${capitalize(req.genre)} Vibes 🎧`,
    description: `${req.trackCount} tracks • Free on Spotify`,
    cta: 'Play Free',
  }),
];

const TIKTOK_TEMPLATES: DemoFactory[] = [
  (req) => ({
    platform: req.platform, tone: req.tone,
    primaryText: `POV: you just found the ${capitalize(req.genre)} playlist that actually slaps 🔥\n\n${req.trackCount} tracks, zero skips. "${req.playlistName}" is living in my head rent-free rn #${req.genre.replace(/\s+/g, '')} #spotify #newmusic`,
    headline: `This ${capitalize(req.genre)} Playlist Hits Different`,
    description: `${req.trackCount} tracks — stream free on Spotify`,
    cta: 'Listen Now',
  }),
  (req) => ({
    platform: req.platform, tone: req.tone,
    primaryText: `no cap this ${capitalize(req.genre)} playlist is unmatched fr fr 🌟\n\n"${req.playlistName}" has been on repeat for days and I can't stop, won't stop\n\nlink in bio 🎵 #${req.genre.replace(/\s+/g, '')}playlist #spotify`,
    headline: `No Skip ${capitalize(req.genre)} Playlist 🌟`,
    description: `${req.trackCount} handpicked tracks, it's giving`,
    cta: 'Stream Free',
  }),
  (req) => ({
    platform: req.platform, tone: req.tone,
    primaryText: `it's giving ${req.mood} ${capitalize(req.genre)} and I'm OBSESSED 💜\n\n${req.trackCount} tracks curated for people who actually have taste. "${req.playlistName}" on Spotify rn #${req.genre.replace(/\s+/g, '')} #fyp`,
    headline: `It's Giving ${capitalize(req.genre)} 💜`,
    description: `${req.trackCount} curated tracks — zero skips`,
    cta: 'Open Spotify',
  }),
  (req) => ({
    platform: req.platform, tone: req.tone,
    primaryText: `the algorithm keeps putting ${capitalize(req.genre)} on my fyp and honestly? valid 🎤\n\nthis playlist "${req.playlistName}" is the reason I'm late to everything\n\n#spotify #${req.genre.replace(/\s+/g, '')} #musiclovers`,
    headline: `Blame This ${capitalize(req.genre)} Playlist 🎤`,
    description: `The playlist that ruined your schedule`,
    cta: 'Play Now',
  }),
  (req) => ({
    platform: req.platform, tone: req.tone,
    primaryText: `${req.mood} szn is here and "${req.playlistName}" is the official soundtrack 🔥\n\n${req.trackCount} ${capitalize(req.genre)} tracks that hit different when the vibes are right\n\nfree on Spotify 🎵 #${req.genre.replace(/\s+/g, '')} #playlist`,
    headline: `${req.mood} Season Playlist 🔥`,
    description: `Official soundtrack for ${req.mood} moods`,
    cta: 'Listen Free',
  }),
];

const YOUTUBE_TEMPLATES: DemoFactory[] = [
  (req) => ({
    platform: req.platform, tone: req.tone,
    primaryText: `Stop scrolling. ${req.trackCount} ${capitalize(req.genre)} tracks guaranteed to elevate your day — no skips, no filler. Free on Spotify.`,
    headline: `Best ${capitalize(req.genre)} Playlist`,
    description: `${req.trackCount} curated ${capitalize(req.genre)} tracks — free`,
    cta: 'Listen Now',
  }),
  (req) => ({
    platform: req.platform, tone: req.tone,
    primaryText: `This is "${req.playlistName}" — ${req.trackCount} ${capitalize(req.genre)} songs handpicked for ${req.mood} moments. Available free on Spotify right now.`,
    headline: `${capitalize(req.genre)} Hits Playlist`,
    description: `${req.trackCount} tracks • Curated weekly • Free`,
    cta: 'Stream Free',
  }),
  (req) => ({
    platform: req.platform, tone: req.tone,
    primaryText: `${req.trackCount} ${capitalize(req.genre)} tracks. Zero skips. Pure ${req.mood} energy. Stream "${req.playlistName}" free on Spotify — skip this ad if you don't love good music.`,
    headline: `${capitalize(req.genre)} — Zero Skips`,
    description: `${req.trackCount} ${req.mood} tracks • Spotify`,
    cta: 'Open Spotify',
  }),
  (req) => ({
    platform: req.platform, tone: req.tone,
    primaryText: `Real ${capitalize(req.genre)} fans, this one's for you. "${req.playlistName}" — ${req.trackCount} handpicked tracks, updated weekly. Free on Spotify.`,
    headline: `For Real ${capitalize(req.genre)} Fans`,
    description: `Updated weekly • ${req.trackCount} tracks • Free`,
    cta: 'Follow Now',
  }),
  (req) => ({
    platform: req.platform, tone: req.tone,
    primaryText: `The ${req.mood} ${capitalize(req.genre)} playlist your day has been missing. ${req.trackCount} tracks, no ads when you follow on Spotify. Hit play.`,
    headline: `${req.mood} ${capitalize(req.genre)} Vibes`,
    description: `${req.trackCount} curated tracks — free on Spotify`,
    cta: 'Play Free',
  }),
];

const GOOGLE_SEARCH_TEMPLATES: DemoFactory[] = [
  (req) => ({
    platform: req.platform, tone: req.tone,
    primaryText: `Best ${capitalize(req.genre)} playlist on Spotify. ${req.trackCount} tracks.`,
    headline: `Best ${capitalize(req.genre)} Playlist`,
    description: `${req.trackCount} handpicked tracks. Free on Spotify. Updated weekly.`,
    cta: 'Listen Free',
  }),
  (req) => ({
    platform: req.platform, tone: req.tone,
    primaryText: `${capitalize(req.genre)} music playlist. ${req.trackCount} curated songs.`,
    headline: `${capitalize(req.genre)} Spotify Playlist`,
    description: `Stream ${req.trackCount} ${capitalize(req.genre)} songs free. No sign-up required.`,
    cta: 'Play Now',
  }),
  (req) => ({
    platform: req.platform, tone: req.tone,
    primaryText: `New ${capitalize(req.genre)} songs. ${req.trackCount} tracks, added weekly.`,
    headline: `New ${capitalize(req.genre)} Songs 2024`,
    description: `Fresh ${capitalize(req.genre)} tracks curated weekly. Free on Spotify.`,
    cta: 'Stream Today',
  }),
  (req) => ({
    platform: req.platform, tone: req.tone,
    primaryText: `${req.mood} ${capitalize(req.genre)} playlist. ${req.trackCount} tracks free.`,
    headline: `${req.mood} ${capitalize(req.genre)} Music`,
    description: `${req.trackCount} songs for every ${req.mood} moment. Free on Spotify.`,
    cta: 'Listen Now',
  }),
  (req) => ({
    platform: req.platform, tone: req.tone,
    primaryText: `"${req.playlistName}" — top ${capitalize(req.genre)} tracks. Stream free.`,
    headline: `${req.playlistName.slice(0, 28)}`,
    description: `"${req.playlistName}" — ${req.trackCount} ${capitalize(req.genre)} songs on Spotify.`,
    cta: 'Open Spotify',
  }),
];

const GOOGLE_DISPLAY_TEMPLATES: DemoFactory[] = [
  (req) => ({
    platform: req.platform, tone: req.tone,
    primaryText: `${req.trackCount} ${capitalize(req.genre)} tracks. All vibes. All free.`,
    headline: `${capitalize(req.genre)} Playlist`,
    description: `Discover "${req.playlistName}" — ${req.trackCount} curated tracks, free on Spotify.`,
    cta: 'Discover Now',
  }),
  (req) => ({
    platform: req.platform, tone: req.tone,
    primaryText: `Your ${req.mood} soundtrack is waiting. Stream free.`,
    headline: `Stream ${capitalize(req.genre)} Free`,
    description: `${req.trackCount} ${capitalize(req.genre)} hits curated for you. No subscription needed.`,
    cta: 'Listen Free',
  }),
  (req) => ({
    platform: req.platform, tone: req.tone,
    primaryText: `Music that gets you. ${capitalize(req.genre)} • ${req.trackCount} tracks.`,
    headline: `${req.trackCount} ${capitalize(req.genre)} Tracks`,
    description: `"${req.playlistName}" — the playlist you didn't know you needed.`,
    cta: 'Play on Spotify',
  }),
  (req) => ({
    platform: req.platform, tone: req.tone,
    primaryText: `The ${capitalize(req.genre)} playlist everyone's talking about.`,
    headline: `Trending ${capitalize(req.genre)} Hits`,
    description: `${req.trackCount} ${req.mood} ${capitalize(req.genre)} tracks. Free on Spotify now.`,
    cta: 'Stream Now',
  }),
  (req) => ({
    platform: req.platform, tone: req.tone,
    primaryText: `Not all playlists hit. This one does. ${req.trackCount} tracks.`,
    headline: `${capitalize(req.genre)} That Hits`,
    description: `"${req.playlistName}" — ${req.trackCount} handpicked ${capitalize(req.genre)} songs. Free.`,
    cta: 'Listen Now',
  }),
];

const TEMPLATE_MAP: Record<AdPlatformType, DemoFactory[]> = {
  'meta':           META_TEMPLATES,
  'tiktok':         TIKTOK_TEMPLATES,
  'youtube':        YOUTUBE_TEMPLATES,
  'google-search':  GOOGLE_SEARCH_TEMPLATES,
  'google-display': GOOGLE_DISPLAY_TEMPLATES,
};

const truncate = (text: string, max: number): string =>
  text.length > max ? text.slice(0, max - 1) + '…' : text;

const buildDemoVariants = (req: AICopyRequest): AICopyVariant[] => {
  const templates = TEMPLATE_MAP[req.platform];
  const limits = PLATFORM_CHAR_LIMITS[req.platform];

  return templates.map((factory, i) => {
    const raw = factory(req, i);
    const primaryText  = truncate(raw.primaryText,  limits.primaryText);
    const headline     = truncate(raw.headline,     limits.headline);
    const description  = truncate(raw.description,  limits.description);
    const cta          = truncate(raw.cta,          limits.cta);
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
  });
};

// ===================================================
// Public API
// ===================================================

export const generateCopyForPlatform = async (
  platform: AdPlatformType,
  analysis: PlaylistAnalysis,
  _targeting: TargetingRecommendation,
  tone: CopyTone
): Promise<AICopyResponse> => {
  const req: AICopyRequest = {
    platform,
    genre:        analysis.topGenre,
    mood:         analysis.moodProfile.label.split(' ')[0] ?? 'Energetic',
    playlistName: analysis.playlist.name,
    trackCount:   analysis.playlist.trackCount,
    tone,
  };

  const key = cacheKey(req);
  if (cache.has(key)) {
    return cache.get(key)!;
  }

  const hasApiKey = Boolean(import.meta.env.VITE_OPENAI_API_KEY);
  let variants: AICopyVariant[];
  let isDemo = false;

  if (hasApiKey) {
    variants = await generateAdCopy(req);
  } else {
    variants = buildDemoVariants(req);
    isDemo = true;
  }

  const response: AICopyResponse = {
    variants,
    platform,
    tone,
    generatedAt: new Date().toISOString(),
    isDemo,
  };

  cache.set(key, response);
  return response;
};

export const generateCopyForAllPlatforms = async (
  analysis: PlaylistAnalysis,
  targeting: TargetingRecommendation,
  tone: CopyTone
): Promise<Record<AdPlatformType, AICopyResponse>> => {
  const platforms: AdPlatformType[] = [
    'meta', 'tiktok', 'youtube', 'google-search', 'google-display',
  ];

  const results = await Promise.all(
    platforms.map((p) => generateCopyForPlatform(p, analysis, targeting, tone))
  );

  return Object.fromEntries(
    platforms.map((p, i) => [p, results[i]])
  ) as Record<AdPlatformType, AICopyResponse>;
};

/** Invalidate cache for a specific request (for "Regenerate" button) */
export const invalidateCache = (req: AICopyRequest): void => {
  cache.delete(cacheKey(req));
};
