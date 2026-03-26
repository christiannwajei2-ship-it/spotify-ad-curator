import type { ParsedSpotifyUrl, SpotifyUrlType } from '../types';

export const parseSpotifyUrl = (url: string): ParsedSpotifyUrl | null => {
  try {
    const cleaned = url.trim();

    // Handle Spotify URIs like spotify:playlist:37i9dQZF1DX...
    const uriMatch = cleaned.match(/^spotify:(playlist|artist|user|album|track):([a-zA-Z0-9]+)$/);
    if (uriMatch) {
      return { type: uriMatch[1] as SpotifyUrlType, id: uriMatch[2], raw: cleaned };
    }

    // Handle full URLs like https://open.spotify.com/playlist/37i9dQZF1DX...
    const urlMatch = cleaned.match(
      /open\.spotify\.com\/(playlist|artist|user|album|track)\/([a-zA-Z0-9]+)/
    );
    if (urlMatch) {
      return { type: urlMatch[1] as SpotifyUrlType, id: urlMatch[2], raw: cleaned };
    }

    return null;
  } catch {
    return null;
  }
};

export const buildSpotifyUrl = (type: SpotifyUrlType, id: string): string =>
  `https://open.spotify.com/${type}/${id}`;

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const chunkArray = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const generateId = (): string =>
  Math.random().toString(36).substring(2, 11);

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export const downloadJson = (data: unknown, filename: string): void => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
