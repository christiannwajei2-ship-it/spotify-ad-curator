// ===================================================
// Apple Music Service — API Client
// ===================================================

import type { AppleMusicPlaylist, AppleMusicTrack } from './types';

const APPLE_MUSIC_BASE = 'https://api.music.apple.com/v1';

const getDeveloperToken = (): string => {
  const token = import.meta.env.VITE_APPLE_MUSIC_TOKEN as string | undefined;
  if (!token) {
    throw new Error(
      'Apple Music API token not configured. Please set VITE_APPLE_MUSIC_TOKEN in your .env file.'
    );
  }
  return token;
};

const appleMusicFetch = async <T>(endpoint: string, region = 'us'): Promise<T> => {
  const token = getDeveloperToken();

  const response = await fetch(`${APPLE_MUSIC_BASE}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Music-User-Token': '',
    },
  });

  if (response.status === 403) {
    throw new Error('Apple Music: Access denied. The content may be region-restricted or private.');
  }
  if (response.status === 404) {
    throw new Error('Apple Music: Playlist not found. It may be private or deleted.');
  }
  if (!response.ok) {
    throw new Error(`Apple Music API error: ${response.status} ${response.statusText}`);
  }

  // Suppress unused variable warning — region is available for future localised requests
  void region;

  return response.json() as Promise<T>;
};

// ---- Raw API shapes ----

interface RawArtwork {
  url: string;
  width: number;
  height: number;
}

interface RawPlaylistAttributes {
  name: string;
  description?: { standard?: string };
  curatorName?: string;
  artwork?: RawArtwork;
  lastModifiedDate?: string;
  trackTypes?: string[];
  url: string;
}

interface RawTrackAttributes {
  name: string;
  artistName: string;
  albumName?: string;
  durationInMillis?: number;
  genreNames?: string[];
  previews?: { url: string }[];
  artwork?: RawArtwork;
  releaseDate?: string;
  trackNumber?: number;
}

interface RawRelationshipData {
  id: string;
  type: string;
  attributes?: RawTrackAttributes;
}

interface RawPlaylistResponse {
  data: {
    id: string;
    attributes: RawPlaylistAttributes;
    relationships?: {
      tracks?: {
        data: RawRelationshipData[];
        next?: string;
      };
    };
  }[];
}

// ---- Helper ----

const artworkUrl = (artwork: RawArtwork | undefined, size = 400): string | undefined => {
  if (!artwork) return undefined;
  return artwork.url.replace('{w}', String(size)).replace('{h}', String(size));
};

// ---- Public API ----

export const fetchPlaylist = async (
  id: string,
  region = 'us'
): Promise<AppleMusicPlaylist> => {
  const data = await appleMusicFetch<RawPlaylistResponse>(
    `/catalog/${region}/playlists/${id}?include=tracks`,
    region
  );

  const item = data.data[0];
  if (!item) throw new Error('Apple Music: No playlist data returned.');

  const attr = item.attributes;
  const trackCount = item.relationships?.tracks?.data.length ?? 0;

  return {
    id: item.id,
    name: attr.name,
    description: attr.description?.standard ?? '',
    curatorName: attr.curatorName ?? 'Apple Music',
    artworkUrl: artworkUrl(attr.artwork),
    trackCount,
    lastModifiedDate: attr.lastModifiedDate,
    playlistUrl: attr.url,
  };
};

export const fetchPlaylistTracks = async (
  id: string,
  region = 'us'
): Promise<AppleMusicTrack[]> => {
  const data = await appleMusicFetch<RawPlaylistResponse>(
    `/catalog/${region}/playlists/${id}?include=tracks`,
    region
  );

  const item = data.data[0];
  if (!item) throw new Error('Apple Music: No playlist data returned.');

  const rawTracks = item.relationships?.tracks?.data ?? [];

  return rawTracks
    .filter((t) => t.attributes)
    .map((t): AppleMusicTrack => {
      const a = t.attributes!;
      return {
        id: t.id,
        title: a.name,
        artist: a.artistName,
        album: a.albumName ?? '',
        durationMs: a.durationInMillis ?? 0,
        genre: a.genreNames?.[0] ?? 'Pop',
        previewUrl: a.previews?.[0]?.url,
        artworkUrl: artworkUrl(a.artwork),
        releaseDate: a.releaseDate,
        trackNumber: a.trackNumber,
      };
    });
};

interface RawAlbumResponse {
  data: {
    id: string;
    attributes: {
      name: string;
      artistName: string;
      artwork?: RawArtwork;
      genreNames?: string[];
      url: string;
      trackCount?: number;
    };
    relationships?: {
      tracks?: { data: RawRelationshipData[] };
    };
  }[];
}

export const fetchAlbum = async (id: string, region = 'us'): Promise<AppleMusicPlaylist> => {
  const data = await appleMusicFetch<RawAlbumResponse>(
    `/catalog/${region}/albums/${id}?include=tracks`,
    region
  );

  const item = data.data[0];
  if (!item) throw new Error('Apple Music: No album data returned.');

  const attr = item.attributes;
  const trackCount = item.relationships?.tracks?.data.length ?? attr.trackCount ?? 0;

  return {
    id: item.id,
    name: attr.name,
    description: `Album by ${attr.artistName}`,
    curatorName: attr.artistName,
    artworkUrl: artworkUrl(attr.artwork),
    trackCount,
    playlistUrl: attr.url,
  };
};
