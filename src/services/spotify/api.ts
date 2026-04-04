import type {
  SpotifyTrack,
  SpotifyAudioFeatures,
  SpotifyArtist,
  SpotifyPlaylist,
  SpotifyUserProfile,
} from '../../types';
import { chunkArray, sleep } from '../../utils/helpers';
import { MAX_TRACKS_FOR_ANALYSIS } from '../../utils/constants';

const SPOTIFY_BASE = 'https://api.spotify.com/v1';

let accessToken: string | null = null;
let tokenExpiry = 0;

const getAccessToken = async (): Promise<string> => {
  if (accessToken && Date.now() < tokenExpiry) return accessToken;

  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Spotify API credentials not configured. Please set VITE_SPOTIFY_CLIENT_ID and VITE_SPOTIFY_CLIENT_SECRET in your .env file.');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`Failed to get Spotify token: ${response.statusText}`);
  }

  const data = await response.json() as { access_token: string; expires_in: number };
  accessToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return accessToken;
};

const spotifyFetch = async <T>(endpoint: string): Promise<T> => {
  const token = await getAccessToken();
  const response = await fetch(`${SPOTIFY_BASE}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 429) {
    const retryAfter = parseInt(response.headers.get('Retry-After') ?? '5', 10);
    await sleep(retryAfter * 1000);
    return spotifyFetch<T>(endpoint);
  }

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};

export const fetchPlaylist = async (playlistId: string): Promise<SpotifyPlaylist> => {
  const playlist = await spotifyFetch<SpotifyPlaylist>(`/playlists/${playlistId}?market=US`);

  // Fetch all tracks if paginated
  const allItems = [...playlist.tracks.items];
  let nextUrl = (playlist.tracks as unknown as { next: string | null }).next;

  while (nextUrl && allItems.length < MAX_TRACKS_FOR_ANALYSIS) {
    const path = nextUrl.replace(SPOTIFY_BASE, '');
    const page = await spotifyFetch<{ items: SpotifyPlaylist['tracks']['items']; next: string | null }>(path);
    allItems.push(...page.items);
    nextUrl = page.next;
  }

  return {
    ...playlist,
    tracks: { ...playlist.tracks, items: allItems.slice(0, MAX_TRACKS_FOR_ANALYSIS) },
  };
};

export const fetchArtist = async (artistId: string): Promise<SpotifyArtist> =>
  spotifyFetch<SpotifyArtist>(`/artists/${artistId}`);

export const fetchArtistTopTracks = async (artistId: string): Promise<SpotifyTrack[]> => {
  const data = await spotifyFetch<{ tracks: SpotifyTrack[] }>(
    `/artists/${artistId}/top-tracks?market=US`
  );
  return data.tracks;
};

export const fetchArtistPlaylists = async (artistId: string): Promise<SpotifyPlaylist[]> => {
  const data = await spotifyFetch<{ items: { id: string }[] }>(
    `/artists/${artistId}/albums?include_groups=appears_on&limit=5`
  );
  return data.items as unknown as SpotifyPlaylist[];
};

export const fetchUserProfile = async (userId: string): Promise<SpotifyUserProfile> =>
  spotifyFetch<SpotifyUserProfile>(`/users/${userId}`);

export const fetchUserPlaylists = async (userId: string): Promise<SpotifyPlaylist[]> => {
  const data = await spotifyFetch<{ items: SpotifyPlaylist[] }>(
    `/users/${userId}/playlists?limit=20`
  );
  return data.items;
};

export const fetchAudioFeatures = async (trackIds: string[]): Promise<SpotifyAudioFeatures[]> => {
  const chunks = chunkArray(trackIds, 100);
  const results: SpotifyAudioFeatures[] = [];

  for (const chunk of chunks) {
    const data = await spotifyFetch<{ audio_features: SpotifyAudioFeatures[] }>(
      `/audio-features?ids=${chunk.join(',')}`
    );
    results.push(...(data.audio_features ?? []).filter(Boolean));
  }

  return results;
};

export const fetchArtists = async (artistIds: string[]): Promise<SpotifyArtist[]> => {
  const chunks = chunkArray([...new Set(artistIds)], 50);
  const results: SpotifyArtist[] = [];

  for (const chunk of chunks) {
    const data = await spotifyFetch<{ artists: SpotifyArtist[] }>(
      `/artists?ids=${chunk.join(',')}`
    );
    results.push(...(data.artists ?? []).filter(Boolean));
  }

  return results;
};
