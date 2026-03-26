// ===================================================
// Demo Service — Sample Data
// ===================================================
// All sample data tells a coherent story:
//   Playlist: "Afrobeats Hits 2024 🌍"
//   Campaign runs across Meta, TikTok, YouTube, Google
//   Analytics show 30 days of campaign performance
// ===================================================

import type { PlaylistAnalysis } from '../../types';

// ── Sample playlist analyses ────────────────────────

export const SAMPLE_PLAYLISTS: PlaylistAnalysis[] = [
  {
    playlist: {
      id: 'demo-playlist-001',
      name: 'Afrobeats Hits 2024 🌍',
      description: 'The hottest Afrobeats and Afro-pop bangers, curated weekly.',
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=400&fit=crop',
      followerCount: 47823,
      trackCount: 45,
      totalDurationMs: 9450000,
      spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX3LDIBRoaCDQ',
    },
    genres: [
      { genre: 'Afrobeats', count: 28, percentage: 0.42 },
      { genre: 'Afropop', count: 18, percentage: 0.27 },
      { genre: 'Nigerian Pop', count: 10, percentage: 0.15 },
      { genre: 'Afroswing', count: 6, percentage: 0.09 },
      { genre: 'Dancehall', count: 4, percentage: 0.06 },
      { genre: 'R&B', count: 1, percentage: 0.01 },
    ],
    topGenre: 'Afrobeats',
    popularityStats: {
      average: 68,
      min: 42,
      max: 94,
      distribution: [
        { range: '0-20', count: 0 },
        { range: '21-40', count: 2 },
        { range: '41-60', count: 12 },
        { range: '61-80', count: 22 },
        { range: '81-100', count: 9 },
      ],
    },
    moodProfile: {
      energy: 0.78,
      danceability: 0.85,
      valence: 0.72,
      acousticness: 0.12,
      instrumentalness: 0.03,
      tempo: 114,
      label: 'Energetic & Happy 🔥😊',
      description: 'High-energy, feel-good vibes that get you moving',
    },
    topArtists: [
      { id: 'a1', name: 'Burna Boy', trackCount: 6, popularity: 87, imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop' },
      { id: 'a2', name: 'Wizkid', trackCount: 5, popularity: 84, imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=100&h=100&fit=crop' },
      { id: 'a3', name: 'Davido', trackCount: 4, popularity: 79, imageUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=100&h=100&fit=crop' },
      { id: 'a4', name: 'Rema', trackCount: 4, popularity: 82, imageUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=100&h=100&fit=crop' },
      { id: 'a5', name: 'Ayra Starr', trackCount: 3, popularity: 75, imageUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=100&h=100&fit=crop' },
    ],
    genreDiversityScore: 0.6,
    analyzedAt: new Date().toISOString(),
  },
  {
    playlist: {
      id: 'demo-playlist-002',
      name: 'Chill Lo-Fi Study Beats ☕',
      description: 'Relaxing lo-fi hip-hop and chill beats for deep focus.',
      imageUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=400&fit=crop',
      followerCount: 124500,
      trackCount: 60,
      totalDurationMs: 14400000,
      spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn',
    },
    genres: [
      { genre: 'Lo-Fi', count: 35, percentage: 0.58 },
      { genre: 'Chillhop', count: 15, percentage: 0.25 },
      { genre: 'Ambient', count: 7, percentage: 0.12 },
      { genre: 'Jazz', count: 3, percentage: 0.05 },
    ],
    topGenre: 'Lo-Fi',
    popularityStats: {
      average: 55,
      min: 30,
      max: 78,
      distribution: [
        { range: '0-20', count: 0 },
        { range: '21-40', count: 8 },
        { range: '41-60', count: 32 },
        { range: '61-80', count: 20 },
        { range: '81-100', count: 0 },
      ],
    },
    moodProfile: {
      energy: 0.32,
      danceability: 0.45,
      valence: 0.55,
      acousticness: 0.65,
      instrumentalness: 0.72,
      tempo: 85,
      label: 'Calm & Focused 🧘',
      description: 'Mellow instrumentals that enhance concentration',
    },
    topArtists: [
      { id: 'b1', name: 'Lofi Girl', trackCount: 8, popularity: 72, imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
      { id: 'b2', name: 'ChilledCow', trackCount: 6, popularity: 68, imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
    ],
    genreDiversityScore: 0.4,
    analyzedAt: new Date().toISOString(),
  },
  {
    playlist: {
      id: 'demo-playlist-003',
      name: 'Rap Caviar 🔥',
      description: 'The most important hip-hop playlist. Updated weekly.',
      imageUrl: 'https://images.unsplash.com/photo-1571266028243-d220c6a6f3d4?w=400&h=400&fit=crop',
      followerCount: 10200000,
      trackCount: 50,
      totalDurationMs: 11500000,
      spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd',
    },
    genres: [
      { genre: 'Hip-Hop', count: 30, percentage: 0.60 },
      { genre: 'Trap', count: 12, percentage: 0.24 },
      { genre: 'R&B', count: 6, percentage: 0.12 },
      { genre: 'Pop Rap', count: 2, percentage: 0.04 },
    ],
    topGenre: 'Hip-Hop',
    popularityStats: {
      average: 82,
      min: 65,
      max: 99,
      distribution: [
        { range: '0-20', count: 0 },
        { range: '21-40', count: 0 },
        { range: '41-60', count: 0 },
        { range: '61-80', count: 18 },
        { range: '81-100', count: 32 },
      ],
    },
    moodProfile: {
      energy: 0.88,
      danceability: 0.79,
      valence: 0.48,
      acousticness: 0.05,
      instrumentalness: 0.02,
      tempo: 128,
      label: 'Hype & Intense 💥',
      description: 'Hard-hitting beats for maximum energy',
    },
    topArtists: [
      { id: 'c1', name: 'Drake', trackCount: 5, popularity: 98, imageUrl: 'https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=100&h=100&fit=crop' },
      { id: 'c2', name: 'Kendrick Lamar', trackCount: 4, popularity: 96, imageUrl: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop' },
      { id: 'c3', name: 'Travis Scott', trackCount: 4, popularity: 94, imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop' },
    ],
    genreDiversityScore: 0.3,
    analyzedAt: new Date().toISOString(),
  },
];

// ── Sample analytics data (30-day campaign) ─────────

export interface DailyMetric {
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  platform: string;
}

export const SAMPLE_ANALYTICS: DailyMetric[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const baseImpressions = 4200 + Math.round(Math.sin(i * 0.4) * 800 + i * 120);
  const ctr = 0.025 + Math.sin(i * 0.3) * 0.008;
  const clicks = Math.round(baseImpressions * ctr);
  const cvr = 0.04 + Math.sin(i * 0.5) * 0.012;
  const conversions = Math.round(clicks * cvr);
  const cpc = 0.38 + Math.sin(i * 0.2) * 0.06;
  const spend = parseFloat((clicks * cpc).toFixed(2));
  return {
    date: date.toISOString().split('T')[0],
    impressions: baseImpressions,
    clicks,
    conversions,
    spend,
    platform: ['Meta', 'TikTok', 'YouTube', 'Google'][i % 4],
  };
});

// ── Feature list used by FeatureShowcase ────────────

export interface FeatureItem {
  id: string;
  label: string;
  icon: string;
  description: string;
  navigateTo: string;
  tier: 'free' | 'pro' | 'agency';
}

export const ALL_FEATURES: FeatureItem[] = [
  { id: 'analysis', label: 'Playlist Analysis', icon: '🔍', description: 'Deep genre, mood, and popularity analysis from any Spotify link.', navigateTo: 'dashboard', tier: 'free' },
  { id: 'targeting', label: 'Smart Targeting', icon: '🎯', description: 'AI-matched countries, age ranges, and interest categories.', navigateTo: 'targeting', tier: 'free' },
  { id: 'meta-ads', label: 'Meta Ads', icon: '📘', description: 'Facebook & Instagram campaigns with carousel and video formats.', navigateTo: 'ad-generator', tier: 'free' },
  { id: 'tiktok-ads', label: 'TikTok Ads', icon: '🎵', description: 'In-Feed and TopView ads with music-sync templates.', navigateTo: 'ad-generator', tier: 'pro' },
  { id: 'youtube-ads', label: 'YouTube Ads', icon: '▶️', description: 'Pre-roll and bumper ads targeting music genre affinities.', navigateTo: 'ad-generator', tier: 'pro' },
  { id: 'google-ads', label: 'Google Search & Display', icon: '🔎', description: 'Search campaigns with genre-based keyword clusters.', navigateTo: 'ad-generator', tier: 'pro' },
  { id: 'ai-copy', label: 'AI Copy Generator', icon: '🤖', description: 'Unlimited ad copy variations powered by GPT.', navigateTo: 'ad-generator', tier: 'pro' },
  { id: 'analytics', label: 'Analytics Dashboard', icon: '📊', description: '30-day campaign performance across all platforms.', navigateTo: 'analytics', tier: 'free' },
  { id: 'scheduler', label: 'Auto-Refresh Scheduler', icon: '⏰', description: 'Auto-pause losers, boost winners on a configurable schedule.', navigateTo: 'scheduler', tier: 'agency' },
  { id: 'reels', label: 'Reels/Shorts Studio', icon: '🎬', description: 'Shot lists and storyboards for Reels, TikTok, and Shorts.', navigateTo: 'reels-studio', tier: 'pro' },
];
