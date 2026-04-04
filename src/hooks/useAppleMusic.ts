// ===================================================
// useAppleMusic — Custom hook for Apple Music integration
// ===================================================

import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from '../store';
import { parseAppleMusicUrl, detectPlatform } from '../services/apple-music/parser';
import { fetchPlaylist, fetchPlaylistTracks, fetchAlbum } from '../services/apple-music/api';
import { analyzeAppleMusicPlaylist } from '../services/apple-music/analyzer';
import type { PlaylistAnalysis } from '../types';
import type { AppleMusicPlaylist, AppleMusicTrack } from '../services/apple-music/types';

// ---- Demo data ----

const DEMO_APPLE_PLAYLIST: AppleMusicPlaylist = {
  id: 'pl.f4d106fed2bd41149aaacabb233eb5eb',
  name: "Today's Hits 🎵",
  description: 'The biggest songs right now, updated every Friday.',
  curatorName: 'Apple Music',
  artworkUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop',
  trackCount: 25,
  playlistUrl: 'https://music.apple.com/us/playlist/todays-hits/pl.f4d106fed2bd41149aaacabb233eb5eb',
};

const DEMO_APPLE_TRACKS: AppleMusicTrack[] = [
  { id: 'am-1', title: 'Essence', artist: 'Wizkid', album: 'Made in Lagos', durationMs: 204000, genre: 'Afrobeats', previewUrl: undefined },
  { id: 'am-2', title: 'Love Nwantiti', artist: 'CKay', album: 'CKay the First', durationMs: 198000, genre: 'Afropop', previewUrl: undefined },
  { id: 'am-3', title: 'Jerusalema', artist: 'Master KG', album: 'Jerusalema', durationMs: 218000, genre: 'Afrobeats', previewUrl: undefined },
  { id: 'am-4', title: 'Calm Down', artist: 'Rema', album: 'Rave & Roses', durationMs: 239000, genre: 'Afropop', previewUrl: undefined },
  { id: 'am-5', title: 'Last Last', artist: 'Burna Boy', album: 'Love, Damini', durationMs: 212000, genre: 'Afrobeats', previewUrl: undefined },
  { id: 'am-6', title: 'Sungba', artist: 'Asake', album: 'Mr. Money With the Vibe', durationMs: 189000, genre: 'Afrobeats', previewUrl: undefined },
  { id: 'am-7', title: 'Doja', artist: 'Asake', album: 'Mr. Money With the Vibe', durationMs: 196000, genre: 'Afrobeats', previewUrl: undefined },
  { id: 'am-8', title: "Rush", artist: 'Ayra Starr', album: 'Year of the Rush', durationMs: 203000, genre: 'Afropop', previewUrl: undefined },
  { id: 'am-9', title: 'Kizz Daniel — Buga', artist: 'Kizz Daniel', album: 'Barnabas', durationMs: 211000, genre: 'Afropop', previewUrl: undefined },
  { id: 'am-10', title: 'Kwaku The Traveller', artist: 'Black Sherif', album: 'The Villain I Never Was', durationMs: 186000, genre: 'Afropop', previewUrl: undefined },
];

export const useAppleMusic = () => {
  const { isDemoMode, setLoading, setError, setAnalysis, setStep } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setLocalError] = useState<string | null>(null);

  const analyzeLink = useCallback(
    async (url: string): Promise<PlaylistAnalysis | null> => {
      if (!url.trim()) {
        toast.error('Please paste an Apple Music URL first');
        return null;
      }

      const platform = detectPlatform(url);
      if (platform !== 'apple-music') {
        toast.error('Not a valid Apple Music URL');
        return null;
      }

      setIsLoading(true);
      setLoading(true);
      setLocalError(null);
      setError(null);

      try {
        if (isDemoMode) {
          await new Promise((r) => setTimeout(r, 2000));
          const analysis = analyzeAppleMusicPlaylist(DEMO_APPLE_PLAYLIST, DEMO_APPLE_TRACKS);
          setAnalysis(analysis);
          setStep('dashboard');
          toast.success('Apple Music analysis complete! 🍎');
          return analysis;
        }

        const parsed = parseAppleMusicUrl(url);
        if (!parsed) {
          throw new Error('Invalid Apple Music URL. Supported: playlist and album links.');
        }

        toast.loading('Fetching Apple Music data…', { id: 'am-analyzing' });

        let playlist: AppleMusicPlaylist;
        let tracks: AppleMusicTrack[];

        if (parsed.type === 'playlist') {
          [playlist, tracks] = await Promise.all([
            fetchPlaylist(parsed.id, parsed.region),
            fetchPlaylistTracks(parsed.id, parsed.region),
          ]);
        } else if (parsed.type === 'album') {
          playlist = await fetchAlbum(parsed.id, parsed.region);
          // Album tracks are included in fetchAlbum via the same endpoint
          tracks = [];
        } else {
          throw new Error(`Apple Music link type "${parsed.type}" is not yet supported. Please use a playlist or album link.`);
        }

        const analysis = analyzeAppleMusicPlaylist(playlist, tracks);
        setAnalysis(analysis);

        toast.dismiss('am-analyzing');
        toast.success('Apple Music analysis complete! 🍎');
        setStep('dashboard');
        return analysis;

      } catch (err) {
        const message = err instanceof Error ? err.message : 'Apple Music analysis failed. Please try again.';
        toast.dismiss('am-analyzing');
        toast.error(message);
        setLocalError(message);
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
        setLoading(false);
      }
    },
    [isDemoMode, setLoading, setError, setAnalysis, setStep]
  );

  return { analyzeLink, isLoading, error };
};
