import type { PlaylistAnalysis } from '../../types';
import type {
  YouTubeCreativeTemplate,
  YouTubeCallToAction,
  YouTubeVideoSpecs,
  YouTubeAdFormat,
} from './types';
import { capitalize } from '../../utils/formatters';

// ===================================================
// Helpers
// ===================================================

const getGenreEmoji = (genre: string): string => {
  const lower = genre.toLowerCase();
  if (lower.includes('afro')) return '🌍';
  if (lower.includes('k-pop') || lower.includes('kpop')) return '🇰🇷';
  if (lower.includes('hip') || lower.includes('rap')) return '🎤';
  if (lower.includes('edm') || lower.includes('dance') || lower.includes('house')) return '🎛️';
  if (lower.includes('r&b') || lower.includes('soul')) return '🎷';
  if (lower.includes('rock') || lower.includes('metal')) return '🎸';
  if (lower.includes('jazz')) return '🎺';
  if (lower.includes('country') || lower.includes('folk')) return '🤠';
  if (lower.includes('classical')) return '🎻';
  if (lower.includes('latin') || lower.includes('reggaeton')) return '💃';
  if (lower.includes('indie') || lower.includes('alternative')) return '🎵';
  return '🎵';
};

// Truncate a string to maxLen, cutting at a word boundary
const trunc = (str: string, maxLen: number): string =>
  str.length <= maxLen ? str : str.slice(0, maxLen - 1).replace(/\s+\S*$/, '').trimEnd();

// ===================================================
// Video Specs
// ===================================================

const INSTREAM_SPECS: YouTubeVideoSpecs = {
  format: 'INSTREAM_SKIPPABLE',
  aspectRatio: '16:9',
  orientation: 'landscape',
  minDurationSec: 12,
  recommended: '16:9 landscape, 1920×1080px, 12–60 seconds, MP4/MOV — companion banner 300×60px',
  companionBanner: '300×60px companion banner recommended',
};

const INFEED_SPECS: YouTubeVideoSpecs = {
  format: 'INFEED_VIDEO',
  aspectRatio: '16:9',
  orientation: 'landscape',
  minDurationSec: 0,
  recommended: '16:9 landscape, 1920×1080px, any length, MP4/MOV',
};

const SHORTS_SPECS: YouTubeVideoSpecs = {
  format: 'SHORTS',
  aspectRatio: '9:16',
  orientation: 'vertical',
  minDurationSec: 0,
  maxDurationSec: 60,
  recommended: '9:16 vertical, 1080×1920px, up to 60 seconds, MP4/MOV',
};

const CTA: YouTubeCallToAction = 'LISTEN_NOW';

// ===================================================
// Template builder
// ===================================================

const makeTemplate = (
  id: string,
  name: string,
  headline: string,
  longHeadline: string,
  description: string,
  format: YouTubeAdFormat,
  specs: YouTubeVideoSpecs,
  callToAction: YouTubeCallToAction = CTA
): YouTubeCreativeTemplate => ({
  id,
  name,
  headline: trunc(headline, 30),
  longHeadline: trunc(longHeadline, 90),
  description: trunc(description, 90),
  callToAction,
  videoSpecs: specs,
  format,
});

// ===================================================
// Public export
// ===================================================

export const generateYouTubeCreatives = (
  analysis: PlaylistAnalysis
): YouTubeCreativeTemplate[] => {
  const { playlist, topGenre, moodProfile } = analysis;
  const genreLabel = capitalize(topGenre);
  const genreEmoji = getGenreEmoji(topGenre);
  const trackCount = playlist.trackCount;
  const moodLabel = moodProfile.label.split(' ')[0];
  const playlistName = playlist.name;

  return [
    // Template 1 — In-stream skippable
    makeTemplate(
      'yt-template-1',
      '🎵 Playlist Escape',
      `${genreEmoji} ${playlistName}`,
      `🎵 ${playlistName} — Your ${genreLabel} Escape Starts Here`,
      `Discover ${trackCount} handpicked ${genreLabel} tracks. Pure ${moodLabel} vibes. Listen free on Spotify.`,
      'INSTREAM_SKIPPABLE',
      INSTREAM_SPECS
    ),

    // Template 2 — In-feed / discovery
    makeTemplate(
      'yt-template-2',
      '🔥 Track Count Hero',
      `${trackCount} Tracks. Pure ${moodLabel}.`,
      `🔥 ${trackCount} Tracks. Pure ${moodLabel}. One Playlist. Listen Free on Spotify`,
      `${genreEmoji} ${trackCount} curated ${genreLabel} tracks. Not algorithmically generated — just pure feel.`,
      'INFEED_VIDEO',
      INFEED_SPECS
    ),

    // Template 3 — In-feed / discovery
    makeTemplate(
      'yt-template-3',
      '❤️ Real Music Lovers',
      `Curated ${genreLabel} for fans`,
      `❤️ Curated ${genreLabel} for real music lovers — Hit Subscribe & Listen`,
      `${genreEmoji} ${trackCount} tracks curated for real ${genreLabel} fans. New music added weekly.`,
      'INFEED_VIDEO',
      INFEED_SPECS,
      'SUBSCRIBE'
    ),

    // Template 4 — Shorts
    makeTemplate(
      'yt-template-4',
      '🎧 Everyone\'s Talking',
      `The ${genreLabel} playlist 🎧`,
      `The ${genreLabel} playlist everyone's talking about 🎧 Link in description`,
      `${trackCount} ${genreLabel} tracks that hit different. Follow ${playlistName} on Spotify.`,
      'SHORTS',
      SHORTS_SPECS
    ),
  ];
};
