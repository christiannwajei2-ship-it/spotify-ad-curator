export const APP_NAME = 'Spotify Ad Curator';
export const DEMO_PLAYLIST_URL = 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M';

export const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-read-collaborative',
].join(' ');

export const MOOD_LABELS = {
  energetic: { label: 'Energetic 🔥', minEnergy: 0.7, minValence: 0.5 },
  happy: { label: 'Happy 😊', minValence: 0.65 },
  chill: { label: 'Chill 😌', maxEnergy: 0.4, minValence: 0.4 },
  sad: { label: 'Melancholy 😔', maxValence: 0.35 },
  dark: { label: 'Dark & Intense 🖤', maxValence: 0.35, minEnergy: 0.6 },
  groovy: { label: 'Groovy 🕺', minDanceability: 0.7 },
  acoustic: { label: 'Acoustic & Raw 🎸', minAcousticness: 0.6 },
  instrumental: { label: 'Instrumental 🎶', minInstrumentalness: 0.5 },
} as const;

export const COLOR_PALETTE = [
  '#a855f7', '#7c3aed', '#6d28d9', '#5b21b6',
  '#c084fc', '#d8b4fe', '#e9d5ff', '#f3e8ff',
  '#ec4899', '#f97316', '#eab308', '#22c55e',
];

export const MAX_TRACKS_FOR_ANALYSIS = 50;
export const MAX_ARTISTS_DISPLAY = 10;
export const MAX_GENRES_DISPLAY = 8;
