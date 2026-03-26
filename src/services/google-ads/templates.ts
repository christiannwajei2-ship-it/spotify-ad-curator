import type { PlaylistAnalysis } from '../../types';
import type {
  GoogleSearchCreativeTemplate,
  GoogleDisplayCreativeTemplate,
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

// Truncate to maxLen, cutting at word boundary
const trunc = (str: string, maxLen: number): string =>
  str.length <= maxLen ? str : str.slice(0, maxLen - 1).replace(/\s+\S*$/, '').trimEnd();

// ===================================================
// Display Image Specs
// ===================================================

const DISPLAY_IMAGE_SPECS = [
  { width: 300, height: 250, label: 'Medium Rectangle 300×250', recommended: 'JPG/PNG, max 150KB' },
  { width: 728, height: 90,  label: 'Leaderboard 728×90',       recommended: 'JPG/PNG, max 150KB' },
  { width: 160, height: 600, label: 'Wide Skyscraper 160×600',  recommended: 'JPG/PNG, max 150KB' },
  { width: 320, height: 50,  label: 'Mobile Banner 320×50',     recommended: 'JPG/PNG, max 150KB' },
];

// ===================================================
// Search creative templates (4 variants)
// ===================================================

export const generateGoogleSearchCreatives = (
  analysis: PlaylistAnalysis
): GoogleSearchCreativeTemplate[] => {
  const { playlist, topGenre, moodProfile } = analysis;
  const genreLabel = capitalize(topGenre);
  const genreEmoji = getGenreEmoji(topGenre);
  const trackCount = playlist.trackCount;
  const moodLabel = moodProfile.label.split(' ')[0];
  const playlistName = playlist.name;
  const finalUrl = 'https://open.spotify.com/playlist/';

  return [
    // Template 1 — Discovery
    {
      id: 'gs-search-1',
      name: '🔍 Discovery Intent',
      headlines: [
        trunc(`Best ${genreLabel} Playlist`, 30),
        trunc(`${genreEmoji} ${trackCount} Curated Tracks`, 30),
        trunc(`Listen Free on Spotify`, 30),
      ],
      descriptions: [
        trunc(`Discover ${trackCount} handpicked ${genreLabel} tracks. ${moodLabel} vibes only. Stream free on Spotify now.`, 90),
        trunc(`${genreEmoji} The ultimate ${genreLabel} playlist — curated for real music fans. No skips needed.`, 90),
      ],
      finalUrl,
      displayPath: `spotify/${topGenre.toLowerCase().slice(0, 15)}`,
    },

    // Template 2 — Genre + playlist name
    {
      id: 'gs-search-2',
      name: '🎵 Playlist Name Hero',
      headlines: [
        trunc(`${playlistName}`, 30),
        trunc(`${genreLabel} Spotify Playlist`, 30),
        trunc(`Free — No Sign-Up Needed`, 30),
      ],
      descriptions: [
        trunc(`"${playlistName}" — ${trackCount} ${genreLabel} songs curated for ${moodLabel} moments. Play on Spotify.`, 90),
        trunc(`New ${genreLabel} music, added weekly. Join thousands streaming ${playlistName} today.`, 90),
      ],
      finalUrl,
      displayPath: 'spotify/playlist',
    },

    // Template 3 — New music angle
    {
      id: 'gs-search-3',
      name: '🆕 New Music Angle',
      headlines: [
        trunc(`New ${genreLabel} Songs 2024`, 30),
        trunc(`${genreEmoji} Fresh Tracks Weekly`, 30),
        trunc(`Stream Free on Spotify`, 30),
      ],
      descriptions: [
        trunc(`Stay ahead — new ${genreLabel} tracks added every week. ${trackCount} songs and counting. Free on Spotify.`, 90),
        trunc(`${moodLabel} ${genreLabel} playlist updated with the freshest drops. Hit play — no cost.`, 90),
      ],
      finalUrl,
      displayPath: 'spotify/new',
    },

    // Template 4 — Mood/vibe focus
    {
      id: 'gs-search-4',
      name: `${moodLabel} Vibe`,
      headlines: [
        trunc(`${moodLabel} ${genreLabel} Music`, 30),
        trunc(`${trackCount} Songs for Every Mood`, 30),
        trunc(`Play Now — It\'s Free`, 30),
      ],
      descriptions: [
        trunc(`Feeling ${moodLabel.toLowerCase()}? ${trackCount} ${genreLabel} tracks curated to match your energy. Free on Spotify.`, 90),
        trunc(`${genreEmoji} Pure ${moodLabel.toLowerCase()} ${genreLabel} — no filler, no skips. "${playlistName}" on Spotify.`, 90),
      ],
      finalUrl,
      displayPath: 'spotify/vibes',
    },
  ];
};

// ===================================================
// Display creative templates (4 variants)
// ===================================================

export const generateGoogleDisplayCreatives = (
  analysis: PlaylistAnalysis
): GoogleDisplayCreativeTemplate[] => {
  const { playlist, topGenre, moodProfile } = analysis;
  const genreLabel = capitalize(topGenre);
  const genreEmoji = getGenreEmoji(topGenre);
  const trackCount = playlist.trackCount;
  const moodLabel = moodProfile.label.split(' ')[0];
  const playlistName = playlist.name;

  return [
    // Template 1 — Music Lovers audience
    {
      id: 'gs-display-1',
      name: '🎵 Music Lovers',
      headlines: [
        trunc(`${genreLabel} Playlist`, 30),
        trunc(`${trackCount} Curated Tracks`, 30),
        trunc(`Free on Spotify`, 30),
      ],
      longHeadline: trunc(`🎵 ${playlistName} — ${trackCount} ${genreLabel} tracks, zero cost`, 90),
      descriptions: [
        trunc(`Stream ${trackCount} handpicked ${genreLabel} songs free on Spotify. ${moodLabel} vibes all day.`, 90),
        trunc(`${genreEmoji} Real music, curated by fans — discover "${playlistName}" on Spotify now.`, 90),
      ],
      businessName: trunc('Spotify Ad Curator', 25),
      imageSpecs: DISPLAY_IMAGE_SPECS,
      callToAction: 'Listen Now',
    },

    // Template 2 — In-Market streaming audience
    {
      id: 'gs-display-2',
      name: '📱 Streaming In-Market',
      headlines: [
        trunc(`Stream ${genreLabel} Free`, 30),
        trunc(`No Subscription Needed`, 30),
        trunc(`${genreEmoji} Spotify Playlist`, 30),
      ],
      longHeadline: trunc(`Stream "${playlistName}" — ${trackCount} ${genreLabel} songs, free on Spotify`, 90),
      descriptions: [
        trunc(`Switch to the best ${genreLabel} playlist on Spotify. ${trackCount} tracks, always updating.`, 90),
        trunc(`${moodLabel} ${genreLabel} music on demand — no sign-up needed. Hit play on Spotify.`, 90),
      ],
      businessName: trunc('Spotify Ad Curator', 25),
      imageSpecs: DISPLAY_IMAGE_SPECS,
      callToAction: 'Play Free',
    },

    // Template 3 — Entertainment sites placement
    {
      id: 'gs-display-3',
      name: '🌐 Entertainment Sites',
      headlines: [
        trunc(`Your ${moodLabel} Soundtrack`, 30),
        trunc(`${genreLabel} — ${trackCount} Tracks`, 30),
        trunc(`Listen on Spotify`, 30),
      ],
      longHeadline: trunc(`${genreEmoji} ${moodLabel} ${genreLabel} vibes — "${playlistName}" is waiting for you`, 90),
      descriptions: [
        trunc(`Set the mood with ${trackCount} ${genreLabel} tracks. "${playlistName}" — free on Spotify.`, 90),
        trunc(`The ${genreLabel} playlist music lovers are talking about. Stream free, no account required.`, 90),
      ],
      businessName: trunc('Spotify Ad Curator', 25),
      imageSpecs: DISPLAY_IMAGE_SPECS,
      callToAction: 'Discover Now',
    },

    // Template 4 — Music blog placements
    {
      id: 'gs-display-4',
      name: '📰 Music Blog Placement',
      headlines: [
        trunc(`New ${genreLabel} Playlist`, 30),
        trunc(`${trackCount} Songs, Zero Cost`, 30),
        trunc(`Stream on Spotify`, 30),
      ],
      longHeadline: trunc(`New ${genreLabel} playlist: "${playlistName}" — ${trackCount} curated tracks on Spotify`, 90),
      descriptions: [
        trunc(`Discover "${playlistName}" — ${trackCount} curated ${genreLabel} tracks updated weekly. Free on Spotify.`, 90),
        trunc(`${genreEmoji} The essential ${genreLabel} listening guide. Stream "${playlistName}" for free.`, 90),
      ],
      businessName: trunc('Spotify Ad Curator', 25),
      imageSpecs: DISPLAY_IMAGE_SPECS,
      callToAction: 'Listen Free',
    },
  ];
};
