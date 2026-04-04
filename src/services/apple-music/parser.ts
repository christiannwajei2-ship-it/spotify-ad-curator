// ===================================================
// Apple Music Service — URL Parser
// ===================================================

import type { AppleMusicLink, AppleMusicLinkType, MusicPlatform, DetectedLink } from './types';

/**
 * Parse an Apple Music URL into its constituent parts.
 *
 * Examples:
 *   https://music.apple.com/us/playlist/todays-hits/pl.f4d106fed2bd41149aaacabb233eb5eb
 *   https://music.apple.com/us/album/album-name/123456789
 *   https://music.apple.com/us/song/track-name/123456789
 */
export const parseAppleMusicUrl = (url: string): AppleMusicLink | null => {
  try {
    const cleaned = url.trim();

    // Match: https://music.apple.com/<region>/<type>/<name>/<id>
    const match = cleaned.match(
      /music\.apple\.com\/([a-z]{2})\/?(playlist|album|song)\/[^/]*\/([a-zA-Z0-9.]+)/i
    );

    if (!match) return null;

    const [, region, rawType, id] = match;

    const typeMap: Record<string, AppleMusicLinkType> = {
      playlist: 'playlist',
      album: 'album',
      song: 'song',
    };

    const type = typeMap[rawType.toLowerCase()];
    if (!type) return null;

    return { type, id, region: region.toLowerCase(), raw: cleaned };
  } catch {
    return null;
  }
};

/**
 * Detect which music platform a URL belongs to.
 */
export const detectPlatform = (url: string): MusicPlatform => {
  const cleaned = url.trim().toLowerCase();
  if (cleaned.includes('open.spotify.com') || cleaned.startsWith('spotify:')) return 'spotify';
  if (cleaned.includes('music.apple.com')) return 'apple-music';
  return 'unknown';
};

/**
 * Given any music URL, return the detected platform.
 */
export const detectLink = (url: string): DetectedLink => ({
  platform: detectPlatform(url),
  url: url.trim(),
});

/**
 * Validate that a URL is a supported Apple Music link.
 */
export const isValidAppleMusicUrl = (url: string): boolean =>
  parseAppleMusicUrl(url) !== null;
