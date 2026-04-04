import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from '../store';
import { parseSpotifyUrl } from '../utils/helpers';
import {
  fetchPlaylist,
  fetchArtist,
  fetchAudioFeatures,
  fetchArtists,
  fetchArtistTopTracks,
  analyzePlaylist,
} from '../services/spotify';
import { DEMO_ANALYSIS } from '../utils/demoData';

export const useSpotifyAnalysis = () => {
  const {
    isDemoMode,
    isLoading,
    setLoading,
    setError,
    setAnalysis,
    setStep,
    spotifyUrl,
  } = useAppStore();

  const analyze = useCallback(async (url: string) => {
    if (!url.trim()) {
      toast.error('Please paste a Spotify URL first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isDemoMode) {
        // Simulate a delay for realism
        await new Promise((r) => setTimeout(r, 2500));
        setAnalysis({ ...DEMO_ANALYSIS, analyzedAt: new Date().toISOString() });
        setStep('dashboard');
        toast.success('Analysis complete! 🎵');
        return;
      }

      const parsed = parseSpotifyUrl(url);
      if (!parsed) {
        throw new Error('Invalid Spotify URL. Please paste a valid playlist, artist, or profile link.');
      }

      toast.loading('Analyzing your Spotify link…', { id: 'analyzing' });

      if (parsed.type === 'playlist') {
        const playlist = await fetchPlaylist(parsed.id);
        const trackArtistIds = playlist.tracks.items
          .flatMap((i) => i.track?.artists.map((a) => a.id) ?? [])
          .filter(Boolean);
        const trackIds = playlist.tracks.items
          .map((i) => i.track?.id)
          .filter(Boolean) as string[];

        const [artistsData, audioFeatures] = await Promise.all([
          fetchArtists(trackArtistIds),
          fetchAudioFeatures(trackIds),
        ]);

        const analysis = analyzePlaylist(playlist, artistsData, audioFeatures);
        setAnalysis(analysis);

      } else if (parsed.type === 'artist') {
        const [artist, topTracks] = await Promise.all([
          fetchArtist(parsed.id),
          fetchArtistTopTracks(parsed.id),
        ]);

        const trackIds = topTracks.map((t) => t.id);
        const audioFeatures = await fetchAudioFeatures(trackIds);

        // Build a synthetic playlist from artist top tracks
        const syntheticPlaylist = {
          id: artist.id,
          name: `${artist.name} — Top Tracks`,
          description: `Top tracks by ${artist.name}`,
          images: artist.images,
          followers: artist.followers,
          tracks: {
            total: topTracks.length,
            items: topTracks.map((t) => ({ track: t, added_at: new Date().toISOString() })),
          },
          owner: { id: 'artist', display_name: artist.name },
          external_urls: artist.external_urls,
        };

        const analysis = analyzePlaylist(syntheticPlaylist, [artist], audioFeatures);
        setAnalysis(analysis);

      } else {
        throw new Error(`URL type "${parsed.type}" is not yet supported. Please use a playlist or artist link.`);
      }

      toast.dismiss('analyzing');
      toast.success('Analysis complete! 🎵');
      setStep('dashboard');

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      toast.dismiss('analyzing');
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [isDemoMode, setLoading, setError, setAnalysis, setStep]);

  return { analyze, isLoading, spotifyUrl };
};
