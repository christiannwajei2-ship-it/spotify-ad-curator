// ===================================================
// Apple Music Service — TypeScript Types
// ===================================================

export interface AppleMusicArtwork {
  url: string;
  width: number;
  height: number;
  bgColor?: string;
  textColor1?: string;
}

export interface AppleMusicPlaylist {
  id: string;
  name: string;
  description: string;
  curatorName: string;
  artworkUrl?: string;
  trackCount: number;
  lastModifiedDate?: string;
  playlistUrl: string;
}

export interface AppleMusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  durationMs: number;
  genre: string;
  previewUrl?: string;
  artworkUrl?: string;
  releaseDate?: string;
  trackNumber?: number;
}

export interface AppleMusicAnalysis {
  playlistId: string;
  playlistName: string;
  curatorName: string;
  artworkUrl?: string;
  trackCount: number;
  genres: string[];
  topGenre: string;
  tracks: AppleMusicTrack[];
}

export type AppleMusicLinkType = 'playlist' | 'album' | 'song';

export interface AppleMusicLink {
  type: AppleMusicLinkType;
  id: string;
  region: string;
  raw: string;
}

export type MusicPlatform = 'spotify' | 'apple-music' | 'unknown';

export interface DetectedLink {
  platform: MusicPlatform;
  url: string;
}
