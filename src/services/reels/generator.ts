// ===================================================
// Reels/Shorts — Template Generation Engine
// ===================================================

import type { PlaylistAnalysis } from '../../types';
import type { VideoTemplate, TemplateSection, TemplateOverrides } from './types';
import { TEMPLATE_LIBRARY } from './templates';

// ===================================================
// Token replacement helpers
// ===================================================

const TOP_GENRE_MOOD_MAP: Record<string, string> = {
  pop: 'upbeat & catchy',
  'hip-hop': 'bold & confident',
  'r&b': 'smooth & soulful',
  afrobeats: 'energetic & vibrant',
  dancehall: 'festive & rhythmic',
  electronic: 'futuristic & hypnotic',
  jazz: 'mellow & sophisticated',
  rock: 'raw & powerful',
  classical: 'elegant & timeless',
  country: 'authentic & heartfelt',
};

function getMoodLabel(topGenre: string): string {
  const lower = topGenre.toLowerCase();
  for (const [key, val] of Object.entries(TOP_GENRE_MOOD_MAP)) {
    if (lower.includes(key)) return val;
  }
  return 'fresh & exciting';
}

function replacePlaceholders(text: string, tokens: Record<string, string>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => tokens[key] ?? `[${key}]`);
}

function buildTokens(analysis: PlaylistAnalysis): Record<string, string> {
  const tracks = analysis.topArtists;
  const topTrackNames = tracks.map((a) => a.name);

  return {
    playlist_name: analysis.playlist.name,
    track_count: String(analysis.playlist.trackCount),
    total_duration: formatDuration(analysis.playlist.totalDurationMs),
    top_genre: analysis.topGenre,
    mood: getMoodLabel(analysis.topGenre),
    artist_name: tracks[0]?.name ?? 'Featured Artist',
    artist_1: tracks[0]?.name ?? 'Artist 1',
    artist_2: tracks[1]?.name ?? 'Artist 2',
    artist_3: tracks[2]?.name ?? 'Artist 3',
    track_1_name: topTrackNames[0] ?? 'Track 1',
    track_2_name: topTrackNames[1] ?? 'Track 2',
    track_3_name: topTrackNames[2] ?? 'Track 3',
    track_4_name: topTrackNames[3] ?? 'Track 4',
    album_name: `${tracks[0]?.name ?? 'Artist'}'s Latest`,
    lyric_snippet: `A ${analysis.topGenre} moment you can feel`,
    genre_tag_1: analysis.topGenre.replace(/\s+/g, ''),
    genre_tag_2: (analysis.genres[1]?.genre ?? 'music').replace(/\s+/g, ''),
    genre_tag_3: (analysis.genres[2]?.genre ?? 'vibes').replace(/\s+/g, ''),
    genre_tag_4: (analysis.genres[3]?.genre ?? 'trending').replace(/\s+/g, ''),
    event_date: 'Coming Soon',
    venue_name: 'Your City',
    tour_name: `${tracks[0]?.name ?? 'Artist'} World Tour`,
  };
}

function formatDuration(ms: number): string {
  const mins = Math.floor(ms / 60000);
  const hrs = Math.floor(mins / 60);
  if (hrs > 0) return `${hrs}h ${mins % 60}m`;
  return `${mins}m`;
}

// ===================================================
// generateFromPlaylist
// ===================================================

/**
 * Auto-fill all template placeholder tokens using playlist analysis data.
 */
export function generateFromPlaylist(
  analysis: PlaylistAnalysis,
  template: VideoTemplate
): VideoTemplate {
  const tokens = buildTokens(analysis);
  const filledSections = template.sections.map((section) => ({
    ...section,
    textOverlays: section.textOverlays.map((overlay) => ({
      ...overlay,
      content: replacePlaceholders(overlay.content, tokens),
    })),
  }));

  return { ...template, sections: filledSections };
}

// ===================================================
// customizeTemplate
// ===================================================

/**
 * Apply user overrides to a template (text, colours, timing).
 */
export function customizeTemplate(
  template: VideoTemplate,
  overrides: TemplateOverrides
): VideoTemplate {
  const merged = { ...template };

  if (overrides.colorPalette) {
    merged.colorPalette = overrides.colorPalette;
  }

  if (overrides.textStyles) {
    merged.textStyles = { ...template.textStyles, ...overrides.textStyles };
  }

  if (overrides.sections) {
    merged.sections = template.sections.map((section, idx) => {
      const sectionOverride = overrides.sections?.[idx];
      if (!sectionOverride) return section;
      return {
        ...section,
        ...sectionOverride,
        textOverlays: sectionOverride.textOverlays
          ? sectionOverride.textOverlays as typeof section.textOverlays
          : section.textOverlays,
      };
    });
  }

  return merged;
}

// ===================================================
// suggestTemplate
// ===================================================

/**
 * Recommend the best template(s) based on genre/mood/energy from playlist analysis.
 */
export function suggestTemplate(analysis: PlaylistAnalysis): VideoTemplate[] {
  const genre = analysis.topGenre.toLowerCase();
  const energy = analysis.moodProfile?.energy ?? 0.5;

  const scores: { template: VideoTemplate; score: number }[] = TEMPLATE_LIBRARY.map((t) => {
    let score = 0;

    // Genre / category matching
    if (t.category === 'new-release') score += 1;
    if (t.category === 'playlist-promo') score += 2;
    if (t.category === 'artist-spotlight' && analysis.topArtists.length > 0) score += 3;

    // Energy matching
    if (energy > 0.7 && t.tags.includes('energetic')) score += 3;
    if (energy > 0.7 && t.tags.includes('hype')) score += 2;
    if (energy < 0.4 && t.tags.includes('smooth')) score += 3;

    // Genre matching
    if ((genre.includes('pop') || genre.includes('hip-hop')) && t.tags.includes('viral')) score += 2;
    if (genre.includes('afrobeat') && t.tags.includes('energetic')) score += 2;
    if (genre.includes('r&b') && t.tags.includes('mood')) score += 2;

    // Popularity
    if (analysis.popularityStats?.average > 60 && t.tags.includes('viral')) score += 2;

    return { template: t, score };
  });

  return scores
    .sort((a, b) => b.score - a.score)
    .map((s) => s.template);
}

// ===================================================
// generateShotList
// ===================================================

export interface ShotItem {
  shotNumber: number;
  sectionLabel: string;
  startTime: string;
  endTime: string;
  durationSec: number;
  visualDescription: string;
  textOverlays: string[];
  animationStyle: string;
  notes: string;
}

/**
 * Export a shot-by-shot production guide from a template.
 */
export function generateShotList(template: VideoTemplate): ShotItem[] {
  return template.sections.map((section, idx) => {
    const startSec = section.startMs / 1000;
    const endSec = (section.startMs + section.durationMs) / 1000;
    return {
      shotNumber: idx + 1,
      sectionLabel: section.label,
      startTime: `${startSec.toFixed(1)}s`,
      endTime: `${endSec.toFixed(1)}s`,
      durationSec: section.durationMs / 1000,
      visualDescription: `${section.animationStyle} transition — bg: ${section.backgroundColorHex}`,
      textOverlays: section.textOverlays.map(
        (o) => `[${o.position}] "${o.content}" (${o.fontSize}, ${o.animation})`
      ),
      animationStyle: section.animationStyle,
      notes: section.notes ?? '',
    };
  });
}

// ===================================================
// calculateTiming
// ===================================================

/**
 * Recalculate section start times so they are contiguous,
 * and return the total duration.
 */
export function calculateTiming(sections: TemplateSection[]): {
  sections: TemplateSection[];
  totalMs: number;
} {
  let cursor = 0;
  const adjusted = sections.map((section) => {
    const updated = { ...section, startMs: cursor };
    cursor += section.durationMs;
    return updated;
  });
  return { sections: adjusted, totalMs: cursor };
}
