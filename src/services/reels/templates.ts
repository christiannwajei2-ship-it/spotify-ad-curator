// ===================================================
// Reels/Shorts — Pre-built Template Library
// ===================================================

import type { VideoTemplate } from './types';

// ===================================================
// "Viral Hook" — 15s TikTok/Reel
// ===================================================

const viralHook: VideoTemplate = {
  id: 'viral-hook',
  name: 'Viral Hook',
  description: 'Bold hook to grab attention in 3 seconds, then a track preview with lyrics overlay, finishing with a punchy CTA.',
  category: 'viral-trend',
  formats: ['tiktok-reel', 'instagram-reel'],
  totalDurationMs: 15000,
  sections: [
    {
      id: 'vh-hook',
      type: 'hook',
      label: 'Hook',
      startMs: 0,
      durationMs: 3000,
      backgroundColorHex: '#0f0f0f',
      animationStyle: 'shake',
      textOverlays: [
        {
          id: 'vh-hook-text',
          content: '🔥 THIS TRACK HITS DIFFERENT',
          position: 'center',
          fontSize: '2xl',
          color: '#ffffff',
          animation: 'bounce',
          bold: true,
        },
      ],
    },
    {
      id: 'vh-body',
      type: 'body',
      label: 'Track Preview',
      startMs: 3000,
      durationMs: 9000,
      backgroundColorHex: '#1a0533',
      animationStyle: 'ken-burns',
      textOverlays: [
        {
          id: 'vh-artist',
          content: '{{artist_name}}',
          position: 'top-center',
          fontSize: 'sm',
          color: '#a855f7',
          animation: 'fade',
          bold: true,
        },
        {
          id: 'vh-track',
          content: '{{track_name}}',
          position: 'center',
          fontSize: 'xl',
          color: '#ffffff',
          animation: 'slide',
          animationDelay: 500,
          bold: true,
        },
        {
          id: 'vh-lyrics',
          content: '"{{lyric_snippet}}"',
          position: 'bottom-center',
          fontSize: 'md',
          color: '#e9d5ff',
          animation: 'typewriter',
          animationDelay: 1000,
          italic: true,
        },
      ],
    },
    {
      id: 'vh-cta',
      type: 'cta',
      label: 'CTA',
      startMs: 12000,
      durationMs: 3000,
      backgroundColorHex: '#7c3aed',
      animationStyle: 'pulse',
      textOverlays: [
        {
          id: 'vh-cta-text',
          content: 'Stream Now 🎧',
          position: 'center',
          fontSize: '2xl',
          color: '#ffffff',
          animation: 'bounce',
          bold: true,
        },
        {
          id: 'vh-cta-link',
          content: 'Link in bio ↓',
          position: 'bottom-center',
          fontSize: 'sm',
          color: '#e9d5ff',
          animation: 'fade',
          animationDelay: 600,
        },
      ],
    },
  ],
  musicSync: {
    energyPeaks: [3000, 12000],
    recommendedBpmRange: { min: 120, max: 160 },
  },
  colorPalette: ['#0f0f0f', '#1a0533', '#7c3aed', '#a855f7', '#e9d5ff'],
  textStyles: {
    heading: { fontSize: '2xl', color: '#ffffff', bold: true, animation: 'bounce' },
    body: { fontSize: 'md', color: '#e9d5ff', animation: 'fade' },
    cta: { fontSize: 'xl', color: '#ffffff', bold: true, animation: 'bounce' },
  },
  tags: ['viral', 'tiktok', 'hook', 'energetic'],
  isPro: false,
};

// ===================================================
// "Playlist Showcase" — 30s
// ===================================================

const playlistShowcase: VideoTemplate = {
  id: 'playlist-showcase',
  name: 'Playlist Showcase',
  description: 'Animated playlist cover intro, rapid-fire track previews with artist names, then a "Listen Now" CTA.',
  category: 'playlist-promo',
  formats: ['tiktok-reel', 'instagram-reel', 'youtube-short'],
  totalDurationMs: 30000,
  sections: [
    {
      id: 'ps-intro',
      type: 'intro',
      label: 'Playlist Intro',
      startMs: 0,
      durationMs: 5000,
      backgroundColorHex: '#0d1117',
      animationStyle: 'zoom-in',
      textOverlays: [
        {
          id: 'ps-playlist-name',
          content: '{{playlist_name}}',
          position: 'center',
          fontSize: '2xl',
          color: '#ffffff',
          animation: 'fade',
          bold: true,
        },
        {
          id: 'ps-track-count',
          content: '{{track_count}} tracks · {{total_duration}}',
          position: 'bottom-center',
          fontSize: 'sm',
          color: '#6b7280',
          animation: 'fade',
          animationDelay: 800,
        },
      ],
    },
    {
      id: 'ps-body',
      type: 'body',
      label: 'Track Previews',
      startMs: 5000,
      durationMs: 20000,
      backgroundColorHex: '#111827',
      animationStyle: 'pan',
      textOverlays: [
        {
          id: 'ps-track-1',
          content: '1. {{track_1_name}} — {{artist_1}}',
          position: 'top-center',
          fontSize: 'md',
          color: '#a855f7',
          animation: 'slide',
        },
        {
          id: 'ps-track-2',
          content: '2. {{track_2_name}} — {{artist_2}}',
          position: 'center',
          fontSize: 'md',
          color: '#ffffff',
          animation: 'slide',
          animationDelay: 4000,
        },
        {
          id: 'ps-track-3',
          content: '3. {{track_3_name}} — {{artist_3}}',
          position: 'bottom-center',
          fontSize: 'md',
          color: '#e9d5ff',
          animation: 'slide',
          animationDelay: 8000,
        },
      ],
      notes: 'Cycle through top 3 tracks with quick fades every ~4s',
    },
    {
      id: 'ps-cta',
      type: 'cta',
      label: 'Listen Now CTA',
      startMs: 25000,
      durationMs: 5000,
      backgroundColorHex: '#1db954',
      animationStyle: 'pulse',
      textOverlays: [
        {
          id: 'ps-cta-text',
          content: 'Listen Now',
          position: 'center',
          fontSize: '2xl',
          color: '#000000',
          animation: 'bounce',
          bold: true,
        },
        {
          id: 'ps-cta-sub',
          content: 'Spotify · Apple Music · YouTube Music',
          position: 'bottom-center',
          fontSize: 'xs',
          color: '#1a1a1a',
          animation: 'fade',
          animationDelay: 600,
        },
      ],
    },
  ],
  musicSync: {
    energyPeaks: [5000, 9000, 13000, 17000, 25000],
    recommendedBpmRange: { min: 100, max: 140 },
  },
  colorPalette: ['#0d1117', '#111827', '#1db954', '#a855f7', '#e9d5ff'],
  textStyles: {
    heading: { fontSize: '2xl', color: '#ffffff', bold: true, animation: 'fade' },
    body: { fontSize: 'md', color: '#a855f7', animation: 'slide' },
    cta: { fontSize: '2xl', color: '#000000', bold: true, animation: 'bounce' },
  },
  tags: ['playlist', 'showcase', 'multi-track', 'discovery'],
  isPro: false,
};

// ===================================================
// "Artist Spotlight" — 20s
// ===================================================

const artistSpotlight: VideoTemplate = {
  id: 'artist-spotlight',
  name: 'Artist Spotlight',
  description: 'Neon artist name reveal, top 3 tracks with waveform animation, then streaming link CTA.',
  category: 'artist-spotlight',
  formats: ['tiktok-reel', 'instagram-reel', 'youtube-short', 'story'],
  totalDurationMs: 20000,
  sections: [
    {
      id: 'as-intro',
      type: 'intro',
      label: 'Artist Reveal',
      startMs: 0,
      durationMs: 4000,
      backgroundColorHex: '#050510',
      animationStyle: 'neon-glow',
      textOverlays: [
        {
          id: 'as-label',
          content: 'ARTIST SPOTLIGHT',
          position: 'top-center',
          fontSize: 'xs',
          color: '#a855f7',
          animation: 'fade',
          bold: true,
        },
        {
          id: 'as-artist',
          content: '{{artist_name}}',
          position: 'center',
          fontSize: '2xl',
          color: '#ffffff',
          animation: 'typewriter',
          bold: true,
        },
        {
          id: 'as-genre',
          content: '{{top_genre}}',
          position: 'bottom-center',
          fontSize: 'sm',
          color: '#7c3aed',
          animation: 'fade',
          animationDelay: 1200,
        },
      ],
    },
    {
      id: 'as-tracks',
      type: 'body',
      label: 'Top Tracks',
      startMs: 4000,
      durationMs: 12000,
      backgroundColorHex: '#0a0a1a',
      animationStyle: 'pulse',
      textOverlays: [
        {
          id: 'as-tracks-title',
          content: 'Top Tracks',
          position: 'top-center',
          fontSize: 'sm',
          color: '#6b7280',
          animation: 'fade',
        },
        {
          id: 'as-t1',
          content: '#1  {{track_1_name}}',
          position: 'center-left',
          fontSize: 'md',
          color: '#a855f7',
          animation: 'slide',
        },
        {
          id: 'as-t2',
          content: '#2  {{track_2_name}}',
          position: 'center',
          fontSize: 'md',
          color: '#ffffff',
          animation: 'slide',
          animationDelay: 3000,
        },
        {
          id: 'as-t3',
          content: '#3  {{track_3_name}}',
          position: 'center-right',
          fontSize: 'md',
          color: '#e9d5ff',
          animation: 'slide',
          animationDelay: 6000,
        },
      ],
      notes: 'Show waveform graphic behind text (SVG overlay in CapCut)',
    },
    {
      id: 'as-cta',
      type: 'cta',
      label: 'Stream CTA',
      startMs: 16000,
      durationMs: 4000,
      backgroundColorHex: '#1a0533',
      animationStyle: 'zoom-in',
      textOverlays: [
        {
          id: 'as-cta-main',
          content: 'Stream {{artist_name}}',
          position: 'center',
          fontSize: 'xl',
          color: '#ffffff',
          animation: 'bounce',
          bold: true,
        },
        {
          id: 'as-cta-sub',
          content: 'Link in bio 🎵',
          position: 'bottom-center',
          fontSize: 'sm',
          color: '#a855f7',
          animation: 'fade',
          animationDelay: 800,
        },
      ],
    },
  ],
  musicSync: {
    energyPeaks: [4000, 7000, 10000, 16000],
    recommendedBpmRange: { min: 80, max: 130 },
  },
  colorPalette: ['#050510', '#0a0a1a', '#1a0533', '#7c3aed', '#a855f7'],
  textStyles: {
    heading: { fontSize: '2xl', color: '#ffffff', bold: true, animation: 'typewriter' },
    body: { fontSize: 'md', color: '#a855f7', animation: 'slide' },
    cta: { fontSize: 'xl', color: '#ffffff', bold: true, animation: 'bounce' },
  },
  tags: ['artist', 'spotlight', 'neon', 'music'],
  isPro: true,
};

// ===================================================
// "New Release Drop" — 10s
// ===================================================

const newReleaseDrop: VideoTemplate = {
  id: 'new-release-drop',
  name: 'New Release Drop',
  description: 'Countdown 3-2-1, album art explosion, track name + "OUT NOW", then swipe-up CTA — perfect for launch day.',
  category: 'new-release',
  formats: ['tiktok-reel', 'instagram-reel', 'story'],
  totalDurationMs: 10000,
  sections: [
    {
      id: 'nrd-countdown',
      type: 'hook',
      label: 'Countdown',
      startMs: 0,
      durationMs: 3000,
      backgroundColorHex: '#000000',
      animationStyle: 'shake',
      textOverlays: [
        {
          id: 'nrd-3',
          content: '3',
          position: 'center',
          fontSize: '2xl',
          color: '#ef4444',
          animation: 'bounce',
          bold: true,
        },
      ],
      notes: 'Flash digits 3, 2, 1 at 0s / 1s / 2s using CapCut keyframes',
    },
    {
      id: 'nrd-explosion',
      type: 'body',
      label: 'Album Art',
      startMs: 3000,
      durationMs: 2000,
      backgroundColorHex: '#0f0c29',
      animationStyle: 'zoom-in',
      textOverlays: [
        {
          id: 'nrd-album',
          content: '{{album_name}}',
          position: 'bottom-center',
          fontSize: 'sm',
          color: '#e9d5ff',
          animation: 'fade',
          animationDelay: 500,
        },
      ],
      notes: 'Place album art image in center; zoom-in from small to full-screen',
    },
    {
      id: 'nrd-out-now',
      type: 'body',
      label: 'OUT NOW',
      startMs: 5000,
      durationMs: 3000,
      backgroundColorHex: '#7c3aed',
      animationStyle: 'glitch',
      textOverlays: [
        {
          id: 'nrd-track',
          content: '{{track_name}}',
          position: 'center',
          fontSize: '2xl',
          color: '#ffffff',
          animation: 'slide',
          bold: true,
        },
        {
          id: 'nrd-outnow',
          content: 'OUT NOW 🔥',
          position: 'bottom-center',
          fontSize: 'xl',
          color: '#fbbf24',
          animation: 'bounce',
          animationDelay: 400,
          bold: true,
        },
      ],
    },
    {
      id: 'nrd-cta',
      type: 'cta',
      label: 'Swipe Up CTA',
      startMs: 8000,
      durationMs: 2000,
      backgroundColorHex: '#fbbf24',
      animationStyle: 'pulse',
      textOverlays: [
        {
          id: 'nrd-cta-text',
          content: 'Swipe Up to Stream ↑',
          position: 'center',
          fontSize: 'xl',
          color: '#000000',
          animation: 'bounce',
          bold: true,
        },
      ],
    },
  ],
  musicSync: {
    beatDropMs: 3000,
    energyPeaks: [3000, 5000, 8000],
    recommendedBpmRange: { min: 130, max: 175 },
  },
  colorPalette: ['#000000', '#0f0c29', '#7c3aed', '#ef4444', '#fbbf24'],
  textStyles: {
    heading: { fontSize: '2xl', color: '#ffffff', bold: true, animation: 'slide' },
    body: { fontSize: 'md', color: '#e9d5ff', animation: 'fade' },
    cta: { fontSize: 'xl', color: '#000000', bold: true, animation: 'bounce' },
  },
  tags: ['new-release', 'countdown', 'drop', 'hype'],
  isPro: true,
};

// ===================================================
// "Genre Vibe" — 25s
// ===================================================

const genreVibe: VideoTemplate = {
  id: 'genre-vibe',
  name: 'Genre Vibe',
  description: 'Genre mood board intro, 4 quick track snippets with genre tags, then "Your next obsession" CTA.',
  category: 'playlist-promo',
  formats: ['tiktok-reel', 'instagram-reel', 'youtube-short'],
  totalDurationMs: 25000,
  sections: [
    {
      id: 'gv-intro',
      type: 'intro',
      label: 'Genre Mood Board',
      startMs: 0,
      durationMs: 5000,
      backgroundColorHex: '#0f172a',
      animationStyle: 'pan',
      textOverlays: [
        {
          id: 'gv-genre-label',
          content: '{{top_genre}}',
          position: 'center',
          fontSize: '2xl',
          color: '#ffffff',
          animation: 'fade',
          bold: true,
        },
        {
          id: 'gv-mood',
          content: '{{mood}} vibes 🎵',
          position: 'bottom-center',
          fontSize: 'md',
          color: '#94a3b8',
          animation: 'fade',
          animationDelay: 1000,
          italic: true,
        },
      ],
    },
    {
      id: 'gv-tracks',
      type: 'body',
      label: 'Track Snippets',
      startMs: 5000,
      durationMs: 16000,
      backgroundColorHex: '#1e293b',
      animationStyle: 'ken-burns',
      textOverlays: [
        {
          id: 'gv-t1',
          content: '{{track_1_name}}  #{{genre_tag_1}}',
          position: 'top-left',
          fontSize: 'md',
          color: '#818cf8',
          animation: 'slide',
        },
        {
          id: 'gv-t2',
          content: '{{track_2_name}}  #{{genre_tag_2}}',
          position: 'top-right',
          fontSize: 'md',
          color: '#34d399',
          animation: 'slide',
          animationDelay: 4000,
        },
        {
          id: 'gv-t3',
          content: '{{track_3_name}}  #{{genre_tag_3}}',
          position: 'bottom-left',
          fontSize: 'md',
          color: '#f472b6',
          animation: 'slide',
          animationDelay: 8000,
        },
        {
          id: 'gv-t4',
          content: '{{track_4_name}}  #{{genre_tag_4}}',
          position: 'bottom-right',
          fontSize: 'md',
          color: '#fbbf24',
          animation: 'slide',
          animationDelay: 12000,
        },
      ],
    },
    {
      id: 'gv-cta',
      type: 'cta',
      label: 'Obsession CTA',
      startMs: 21000,
      durationMs: 4000,
      backgroundColorHex: '#4f46e5',
      animationStyle: 'zoom-in',
      textOverlays: [
        {
          id: 'gv-cta-main',
          content: 'Your next obsession 🎧',
          position: 'center',
          fontSize: 'xl',
          color: '#ffffff',
          animation: 'bounce',
          bold: true,
        },
        {
          id: 'gv-cta-sub',
          content: 'Link in bio ↓',
          position: 'bottom-center',
          fontSize: 'sm',
          color: '#c7d2fe',
          animation: 'fade',
          animationDelay: 700,
        },
      ],
    },
  ],
  musicSync: {
    energyPeaks: [5000, 9000, 13000, 17000, 21000],
    recommendedBpmRange: { min: 90, max: 140 },
  },
  colorPalette: ['#0f172a', '#1e293b', '#4f46e5', '#818cf8', '#c7d2fe'],
  textStyles: {
    heading: { fontSize: '2xl', color: '#ffffff', bold: true, animation: 'fade' },
    body: { fontSize: 'md', color: '#818cf8', animation: 'slide' },
    cta: { fontSize: 'xl', color: '#ffffff', bold: true, animation: 'bounce' },
  },
  tags: ['genre', 'mood', 'discovery', 'vibe'],
  isPro: true,
};

// ===================================================
// "Concert Hype" — 15s
// ===================================================

const concertHype: VideoTemplate = {
  id: 'concert-hype',
  name: 'Concert Hype',
  description: 'Date/venue flash, best live moments text overlay, then "Get Tickets" CTA.',
  category: 'concert',
  formats: ['tiktok-reel', 'instagram-reel', 'story'],
  totalDurationMs: 15000,
  sections: [
    {
      id: 'ch-date',
      type: 'hook',
      label: 'Date & Venue Flash',
      startMs: 0,
      durationMs: 3000,
      backgroundColorHex: '#18181b',
      animationStyle: 'glitch',
      textOverlays: [
        {
          id: 'ch-date-text',
          content: '{{event_date}}',
          position: 'center',
          fontSize: '2xl',
          color: '#ffffff',
          animation: 'typewriter',
          bold: true,
        },
        {
          id: 'ch-venue',
          content: '📍 {{venue_name}}',
          position: 'bottom-center',
          fontSize: 'md',
          color: '#f59e0b',
          animation: 'fade',
          animationDelay: 600,
        },
      ],
    },
    {
      id: 'ch-live',
      type: 'body',
      label: 'Live Moments',
      startMs: 3000,
      durationMs: 8000,
      backgroundColorHex: '#0c0c0c',
      animationStyle: 'shake',
      textOverlays: [
        {
          id: 'ch-artist',
          content: '{{artist_name}}',
          position: 'top-center',
          fontSize: 'xl',
          color: '#f59e0b',
          animation: 'fade',
          bold: true,
        },
        {
          id: 'ch-live-text',
          content: 'LIVE IN CONCERT',
          position: 'center',
          fontSize: '2xl',
          color: '#ffffff',
          animation: 'bounce',
          bold: true,
          animationDelay: 500,
        },
        {
          id: 'ch-tour',
          content: '{{tour_name}}',
          position: 'bottom-center',
          fontSize: 'sm',
          color: '#9ca3af',
          animation: 'slide',
          animationDelay: 1500,
          italic: true,
        },
      ],
      notes: 'Cut to best crowd footage or stage highlights on each beat',
    },
    {
      id: 'ch-cta',
      type: 'cta',
      label: 'Get Tickets CTA',
      startMs: 11000,
      durationMs: 4000,
      backgroundColorHex: '#f59e0b',
      animationStyle: 'pulse',
      textOverlays: [
        {
          id: 'ch-cta-main',
          content: 'Get Tickets 🎟️',
          position: 'center',
          fontSize: '2xl',
          color: '#000000',
          animation: 'bounce',
          bold: true,
        },
        {
          id: 'ch-cta-sub',
          content: 'Link in bio · Limited seats!',
          position: 'bottom-center',
          fontSize: 'sm',
          color: '#1c1917',
          animation: 'fade',
          animationDelay: 700,
        },
      ],
    },
  ],
  musicSync: {
    beatDropMs: 3000,
    energyPeaks: [3000, 6000, 9000, 11000],
    recommendedBpmRange: { min: 110, max: 160 },
  },
  colorPalette: ['#18181b', '#0c0c0c', '#f59e0b', '#ffffff', '#9ca3af'],
  textStyles: {
    heading: { fontSize: '2xl', color: '#ffffff', bold: true, animation: 'typewriter' },
    body: { fontSize: 'md', color: '#f59e0b', animation: 'fade' },
    cta: { fontSize: '2xl', color: '#000000', bold: true, animation: 'bounce' },
  },
  tags: ['concert', 'live', 'tickets', 'event', 'hype'],
  isPro: true,
};

// ===================================================
// Exported Library
// ===================================================

export const TEMPLATE_LIBRARY: VideoTemplate[] = [
  viralHook,
  playlistShowcase,
  artistSpotlight,
  newReleaseDrop,
  genreVibe,
  concertHype,
];

export const FREE_TEMPLATE_IDS = ['viral-hook', 'playlist-showcase'];

export {
  viralHook,
  playlistShowcase,
  artistSpotlight,
  newReleaseDrop,
  genreVibe,
  concertHype,
};
