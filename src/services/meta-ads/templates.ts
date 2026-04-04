import type { PlaylistAnalysis, AdCreativeTemplate, MoodProfile } from '../../types';
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

const getMoodEmoji = (mood: MoodProfile): string => {
  if (mood.energy > 0.7 && mood.valence > 0.6) return '🔥';
  if (mood.valence > 0.65) return '😊';
  if (mood.danceability > 0.7) return '🕺';
  if (mood.acousticness > 0.6) return '🎸';
  if (mood.energy < 0.4) return '😌';
  return '🎧';
};

export const generateAdCreatives = (analysis: PlaylistAnalysis): AdCreativeTemplate[] => {
  const { playlist, topGenre, moodProfile, genres } = analysis;
  const genreEmoji = getGenreEmoji(topGenre);
  const moodEmoji = getMoodEmoji(moodProfile);
  const genreLabel = capitalize(topGenre);
  const trackCount = playlist.trackCount;
  const playlistName = playlist.name;
  const moodLabel = moodProfile.label.split(' ')[0]; // first word like "Energetic"

  const imageSpecs = {
    recommended: '1080x1080px (square) or 1200x628px (landscape)',
    aspectRatio: '1:1 or 1.91:1',
    minWidth: 600,
    minHeight: 600,
  };

  const templates: AdCreativeTemplate[] = [
    {
      id: 'template-1',
      name: '🎵 Discovery Hook',
      primaryText: `${genreEmoji} Discover ${genreLabel} vibes you'll absolutely love ❤️\n\nHandpicked tracks, curated with soul. This playlist doesn't miss — every song hits different.\n\n🎧 ${trackCount} tracks of pure ${genreLabel} perfection\n✨ Follow the playlist, change your mood instantly`,
      headline: `Your New Favorite ${genreLabel} Playlist ❤️`,
      description: `${trackCount} handpicked ${genreLabel} tracks • Follow now`,
      callToAction: 'Listen Now',
      imageSpecs,
      placements: ['facebook_feed', 'instagram_feed', 'instagram_stories'],
    },
    {
      id: 'template-2',
      name: '🔥 FOMO / Track Count',
      primaryText: `🔥 ${trackCount} tracks handpicked for ${moodLabel} lovers ${moodEmoji}\n\nEveryone's been streaming this playlist on repeat. You're missing out if you haven't heard it yet.\n\n❤️ Curated for real ${genreLabel} fans\n🎵 New tracks added regularly\n📈 Join thousands of listeners`,
      headline: `${trackCount} ${genreLabel} Tracks You Need 🔥`,
      description: `Don't sleep on this • ${moodProfile.label}`,
      callToAction: 'Listen Now',
      imageSpecs,
      placements: ['facebook_feed', 'instagram_feed'],
    },
    {
      id: 'template-3',
      name: '💜 Belonging / Community',
      primaryText: `Your next favorite playlist is here 💜\n\n${genreEmoji} ${genreLabel} • ${trackCount} songs\n${moodEmoji} ${moodProfile.label}\n\n"Finally a playlist that gets it right!" — real listeners\n\nFollow "${playlistName}" and never skip a track again. Curated by someone who lives and breathes this music ❤️‍🔥`,
      headline: `"${playlistName.length > 30 ? playlistName.substring(0, 30) + '…' : playlistName}" 💜`,
      description: `${genreLabel} • ${trackCount} tracks • Follow free`,
      callToAction: 'Listen Now',
      imageSpecs,
      placements: ['facebook_feed', 'instagram_feed', 'instagram_stories', 'facebook_stories'],
    },
    {
      id: 'template-4',
      name: '❤️‍🔥 Real Fans Only',
      primaryText: `❤️‍🔥 ${playlistName} — curated for real ${genreLabel} fans\n\nNot algorithmically generated. Not random. Every. Single. Track. is chosen with intention.\n\n${genreEmoji} Pure ${genreLabel} energy\n${moodEmoji} ${moodProfile.description}\n🎵 ${trackCount} songs • Updated regularly\n\nIf you know, you know. Follow and stream. 🙏`,
      headline: `Real ${genreLabel} Hits Only ❤️‍🔥`,
      description: `Curated for true fans • Tap to listen`,
      callToAction: 'Listen Now',
      imageSpecs,
      placements: ['instagram_feed', 'instagram_stories', 'facebook_feed'],
    },
    {
      id: 'template-5',
      name: '🎧 Mood-Based (Instagram)',
      primaryText: `When the mood hits just right ${moodEmoji}\n\n${moodProfile.description}.\n\nThat's exactly what "${playlistName}" delivers.\n\n${genreEmoji} ${trackCount} ${genreLabel} tracks\n❤️ Follow and feel it for yourself`,
      headline: `${moodProfile.label} Vibes 🎧`,
      description: `${genreLabel} playlist • Stream now on Spotify`,
      callToAction: 'Listen Now',
      imageSpecs: {
        recommended: '1080x1920px (vertical for Stories)',
        aspectRatio: '9:16',
        minWidth: 500,
        minHeight: 889,
      },
      placements: ['instagram_stories', 'facebook_stories'],
    },
  ];

  // Add genre-specific variants based on top genres
  const secondaryGenre = genres[1]?.genre ?? '';
  if (secondaryGenre) {
    templates.push({
      id: 'template-6',
      name: `🎵 ${capitalize(topGenre)} + ${capitalize(secondaryGenre)} Mix`,
      primaryText: `The perfect blend you didn't know you needed 🎶\n\n${genreEmoji} ${capitalize(topGenre)} × ${capitalize(secondaryGenre)}\n\n${trackCount} carefully selected tracks that bridge both worlds. Real music lovers only.\n\n❤️ Follow "${playlistName}" on Spotify`,
      headline: `${capitalize(topGenre)} × ${capitalize(secondaryGenre)} Playlist ❤️`,
      description: `${trackCount} tracks • The best of both worlds`,
      callToAction: 'Listen Now',
      imageSpecs,
      placements: ['facebook_feed', 'instagram_feed'],
    });
  }

  return templates;
};
