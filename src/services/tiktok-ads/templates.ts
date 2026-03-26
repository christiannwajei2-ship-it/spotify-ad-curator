import type { PlaylistAnalysis, MoodProfile } from '../../types';
import type { TikTokCreativeTemplate, TikTokCallToAction, TikTokPlacement } from './types';
import { capitalize } from '../../utils/formatters';

const getGenreEmoji = (genre: string): string => {
  const lower = genre.toLowerCase();
  if (lower.includes('afro')) return '🌍';
  if (lower.includes('k-pop') || lower.includes('kpop')) return '🇰🇷';
  if (lower.includes('hip') || lower.includes('rap')) return '🎤';
  if (lower.includes('edm') || lower.includes('dance') || lower.includes('house')) return '🎛️';
  if (lower.includes('r&b') || lower.includes('soul')) return '🎷';
  if (lower.includes('rock') || lower.includes('metal')) return '🎸';
  if (lower.includes('jazz')) return '🎺';
  if (lower.includes('country') || lower.includes('folk')) return '🤠';
  if (lower.includes('classical')) return '🎻';
  if (lower.includes('latin') || lower.includes('reggaeton')) return '💃';
  if (lower.includes('indie') || lower.includes('alternative')) return '🎵';
  return '🎵';
};

const getMoodLabel = (mood: MoodProfile): string => mood.label.split(' ')[0];

const buildHashtags = (genre: string, mood: MoodProfile): string[] => {
  const genreSlug = genre.toLowerCase().replace(/[^a-z0-9]/g, '');
  const moodSlug = getMoodLabel(mood).toLowerCase();
  return [
    `#${genreSlug}playlist`,
    '#MusicVibes',
    `#${moodSlug}`,
    '#SpotifyPlaylist',
    '#NewMusic',
    '#PlaylistCurator',
  ];
};

const VIDEO_SPECS: TikTokCreativeTemplate['videoSpecs'] = {
  aspectRatio: '9:16',
  orientation: 'vertical',
  minDurationSec: 15,
  maxDurationSec: 60,
  recommended: '9:16 vertical, 1080×1920px, 15–60 seconds, MP4/MOV',
};

const ALL_PLACEMENTS: TikTokPlacement[] = [
  'PLACEMENT_TIKTOK',
  'PLACEMENT_TIKTOK_STORY',
];

const CTA: TikTokCallToAction = 'LISTEN_NOW';

export const generateTikTokCreatives = (analysis: PlaylistAnalysis): TikTokCreativeTemplate[] => {
  const { playlist, topGenre, moodProfile, genres } = analysis;
  const genreEmoji = getGenreEmoji(topGenre);
  const genreLabel = capitalize(topGenre);
  const trackCount = playlist.trackCount;
  const moodLabel = getMoodLabel(moodProfile);
  const hashtags = buildHashtags(topGenre, moodProfile);

  const templates: TikTokCreativeTemplate[] = [
    {
      id: 'tiktok-template-1',
      name: '👀 POV Hook',
      primaryText: `POV: You just found the perfect ${genreLabel} playlist 🎵🔥\n\n${genreEmoji} ${trackCount} handpicked tracks — every single one goes hard. Follow the playlist and thank me later 🙏`,
      headline: `The ${genreLabel} Playlist You've Been Looking For 🎵`,
      callToAction: CTA,
      hashtags,
      videoSpecs: VIDEO_SPECS,
      placements: ALL_PLACEMENTS,
    },
    {
      id: 'tiktok-template-2',
      name: '💜 Hits Different',
      primaryText: `This playlist hits different 💜 ${trackCount} songs of pure ${moodLabel} vibes\n\n${genreEmoji} Curated for real ${genreLabel} lovers — not algorithmically generated, just pure feel ❤️`,
      headline: `${trackCount} Songs That Hit Different 💜`,
      callToAction: CTA,
      hashtags,
      videoSpecs: VIDEO_SPECS,
      placements: ALL_PLACEMENTS,
    },
    {
      id: 'tiktok-template-3',
      name: '🎧 Drop Everything',
      primaryText: `Drop everything and listen to this 🎧❤️\n\n${genreEmoji} ${trackCount} ${genreLabel} tracks that go crazy\n\nTrust me on this one 🙏 #${genreLabel.replace(/\s+/g, '')}Playlist #MusicVibes`,
      headline: `Drop Everything — Listen to This 🎧`,
      callToAction: CTA,
      hashtags,
      videoSpecs: VIDEO_SPECS,
      placements: ALL_PLACEMENTS,
    },
    {
      id: 'tiktok-template-4',
      name: '❤️‍🔥 Genre Is Life',
      primaryText: `When ${genreLabel} is life 🎶 Follow for daily curated playlists ❤️‍🔥\n\n${genreEmoji} ${trackCount} tracks of the best ${genreLabel} you'll ever hear. New drops every week ✨`,
      headline: `For People Who Live & Breathe ${genreLabel} ❤️‍🔥`,
      callToAction: CTA,
      hashtags,
      videoSpecs: VIDEO_SPECS,
      placements: ALL_PLACEMENTS,
    },
  ];

  // Genre-mix variant when a secondary genre exists
  const secondaryGenre = genres[1]?.genre ?? '';
  if (secondaryGenre) {
    const secondaryLabel = capitalize(secondaryGenre);
    templates.push({
      id: 'tiktok-template-5',
      name: `🎵 ${genreLabel} + ${secondaryLabel} Mix`,
      primaryText: `${genreLabel} meets ${secondaryLabel} and we're not okay 😭🎵\n\n${genreEmoji} ${trackCount} tracks bridging both worlds — the collab you didn't know you needed ❤️`,
      headline: `${genreLabel} × ${secondaryLabel} — The Ultimate Blend 🎵`,
      callToAction: CTA,
      hashtags: [
        ...hashtags,
        `#${secondaryGenre.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      ],
      videoSpecs: VIDEO_SPECS,
      placements: ALL_PLACEMENTS,
    });
  }

  return templates;
};
