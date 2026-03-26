// ===================================================
// Apple Music Service — Analyzer
// Maps Apple Music data → PlaylistAnalysis format
// compatible with all existing ad generators
// ===================================================

import type { PlaylistAnalysis, GenreCount, ArtistSummary, MoodProfile } from '../../types';
import type { AppleMusicPlaylist, AppleMusicTrack } from './types';

// ---- Genre normalisation ----

const GENRE_CATEGORY_MAP: Record<string, string> = {
  // Afrobeats cluster
  afrobeats: 'Afrobeats',
  afropop: 'Afropop',
  afroswing: 'Afroswing',
  afro: 'Afrobeats',

  // Hip-Hop cluster
  'hip-hop': 'Hip-Hop',
  'hip hop': 'Hip-Hop',
  rap: 'Hip-Hop',
  trap: 'Hip-Hop',
  'urban contemporary': 'Hip-Hop',

  // R&B
  'r&b': 'R&B',
  'r&b/soul': 'R&B',
  soul: 'R&B',
  'neo soul': 'R&B',

  // Pop
  pop: 'Pop',
  'teen pop': 'Pop',
  'dance pop': 'Pop',
  'synth-pop': 'Pop',
  electropop: 'Pop',

  // Electronic / Dance
  electronic: 'Electronic',
  dance: 'Electronic',
  edm: 'Electronic',
  house: 'Electronic',
  techno: 'Electronic',
  trance: 'Electronic',
  'drum and bass': 'Electronic',

  // Reggae / Dancehall
  reggae: 'Reggae',
  dancehall: 'Dancehall',
  reggaeton: 'Reggaeton',

  // Latin
  latin: 'Latin',
  salsa: 'Latin',
  bachata: 'Latin',
  cumbia: 'Latin',

  // Rock / Alternative
  rock: 'Rock',
  'alternative rock': 'Rock',
  indie: 'Indie',
  'indie pop': 'Indie',
  'indie rock': 'Indie',

  // Classical / Instrumental
  classical: 'Classical',
  instrumental: 'Instrumental',
  jazz: 'Jazz',
  blues: 'Blues',

  // Country
  country: 'Country',

  // Gospel / Christian
  gospel: 'Gospel',
  christian: 'Gospel',

  // Amapiano / Afrotech
  amapiano: 'Amapiano',
  afrotech: 'Amapiano',
};

const normaliseGenre = (raw: string): string => {
  const lower = raw.toLowerCase().trim();
  // Exact lookup first
  if (GENRE_CATEGORY_MAP[lower]) return GENRE_CATEGORY_MAP[lower];
  // Partial match
  for (const [key, val] of Object.entries(GENRE_CATEGORY_MAP)) {
    if (lower.includes(key)) return val;
  }
  // Title-case the original
  return raw
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
};

// ---- Mood estimation (no audio features — derive from genre + metadata) ----

const estimateMoodFromGenre = (topGenre: string): MoodProfile => {
  const g = topGenre.toLowerCase();

  if (['afrobeats', 'afropop', 'dancehall', 'reggaeton'].some((k) => g.includes(k))) {
    return { energy: 0.78, danceability: 0.85, valence: 0.72, acousticness: 0.12, instrumentalness: 0.03, tempo: 112, label: 'Energetic & Happy 🔥😊', description: 'High-energy, feel-good vibes that get you moving' };
  }
  if (['hip-hop', 'rap', 'trap'].some((k) => g.includes(k))) {
    return { energy: 0.72, danceability: 0.78, valence: 0.48, acousticness: 0.1, instrumentalness: 0.04, tempo: 95, label: 'Groovy & Danceable 🕺', description: 'Made for the dance floor — irresistible rhythms' };
  }
  if (['r&b', 'soul', 'neo soul'].some((k) => g.includes(k))) {
    return { energy: 0.55, danceability: 0.67, valence: 0.58, acousticness: 0.3, instrumentalness: 0.05, tempo: 88, label: 'Chill & Relaxed 😌', description: 'Easy-going, laid-back vibes' };
  }
  if (['electronic', 'edm', 'house', 'dance'].some((k) => g.includes(k))) {
    return { energy: 0.85, danceability: 0.88, valence: 0.62, acousticness: 0.05, instrumentalness: 0.35, tempo: 128, label: 'Energetic & Happy 🔥😊', description: 'High-energy, feel-good vibes that get you moving' };
  }
  if (['pop'].some((k) => g.includes(k))) {
    return { energy: 0.65, danceability: 0.7, valence: 0.65, acousticness: 0.2, instrumentalness: 0.04, tempo: 110, label: 'Happy & Uplifting 😊✨', description: 'Positive, mood-boosting energy' };
  }
  if (['rock', 'indie'].some((k) => g.includes(k))) {
    return { energy: 0.74, danceability: 0.55, valence: 0.45, acousticness: 0.25, instrumentalness: 0.1, tempo: 118, label: 'Intense & Dark 🖤🔥', description: 'Powerful, raw emotional intensity' };
  }
  if (['classical', 'instrumental', 'jazz'].some((k) => g.includes(k))) {
    return { energy: 0.35, danceability: 0.4, valence: 0.5, acousticness: 0.65, instrumentalness: 0.6, tempo: 80, label: 'Instrumental & Focus 🎶', description: 'Perfect for focus and deep work' };
  }
  if (['amapiano', 'afrotech'].some((k) => g.includes(k))) {
    return { energy: 0.7, danceability: 0.82, valence: 0.68, acousticness: 0.15, instrumentalness: 0.12, tempo: 110, label: 'Groovy & Danceable 🕺', description: 'Made for the dance floor — irresistible rhythms' };
  }

  // Fallback
  return { energy: 0.6, danceability: 0.65, valence: 0.55, acousticness: 0.2, instrumentalness: 0.05, tempo: 108, label: 'Balanced & Versatile 🎵', description: 'A well-rounded mix that appeals to many moods' };
};

// ---- Popularity estimation ----

const estimatePopularity = (trackCount: number): number => {
  // Apple Music doesn't expose raw popularity scores.
  // Use a heuristic: editorial playlists with more tracks tend to be higher profile.
  if (trackCount >= 50) return 72;
  if (trackCount >= 30) return 65;
  if (trackCount >= 15) return 58;
  return 50;
};

// ---- Main analyser ----

export const analyzeAppleMusicPlaylist = (
  playlist: AppleMusicPlaylist,
  tracks: AppleMusicTrack[]
): PlaylistAnalysis => {
  // ---- Genre counts ----
  const genreMap = new Map<string, number>();
  tracks.forEach((t) => {
    const normalised = normaliseGenre(t.genre);
    genreMap.set(normalised, (genreMap.get(normalised) ?? 0) + 1);
  });

  const total = Array.from(genreMap.values()).reduce((a, b) => a + b, 0) || 1;
  const genres: GenreCount[] = Array.from(genreMap.entries())
    .map(([genre, count]) => ({ genre, count, percentage: count / total }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  const topGenre = genres[0]?.genre ?? 'Pop';

  // ---- Popularity stats ----
  const avgPop = estimatePopularity(tracks.length || playlist.trackCount);
  const distribution = [
    { range: '0-20', count: 0 },
    { range: '21-40', count: Math.round(tracks.length * 0.05) },
    { range: '41-60', count: Math.round(tracks.length * 0.25) },
    { range: '61-80', count: Math.round(tracks.length * 0.45) },
    { range: '81-100', count: Math.round(tracks.length * 0.25) },
  ];

  // ---- Mood profile ----
  const moodProfile = estimateMoodFromGenre(topGenre);

  // ---- Top artists ----
  const artistTrackCount = new Map<string, number>();
  tracks.forEach((t) => {
    artistTrackCount.set(t.artist, (artistTrackCount.get(t.artist) ?? 0) + 1);
  });

  const topArtists: ArtistSummary[] = Array.from(artistTrackCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count], i) => ({
      id: `am-artist-${i}`,
      name,
      trackCount: count,
      popularity: avgPop + Math.round(Math.random() * 10 - 5),
    }));

  // ---- Genre diversity ----
  const genreDiversityScore = Math.min(genres.length / 10, 1);

  const totalDurationMs = tracks.reduce((sum, t) => sum + (t.durationMs ?? 0), 0);

  return {
    playlist: {
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      imageUrl: playlist.artworkUrl,
      followerCount: 0,
      trackCount: tracks.length || playlist.trackCount,
      totalDurationMs,
      spotifyUrl: playlist.playlistUrl,
    },
    genres,
    topGenre,
    popularityStats: {
      average: avgPop,
      min: Math.max(avgPop - 25, 0),
      max: Math.min(avgPop + 25, 100),
      distribution,
    },
    moodProfile,
    topArtists,
    genreDiversityScore,
    analyzedAt: new Date().toISOString(),
  };
};
