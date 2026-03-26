import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from '../store';
import { generateYouTubeCampaign } from '../services/youtube-ads';
import type { YouTubeCampaign } from '../services/youtube-ads';

const DEMO_YOUTUBE_CAMPAIGN: YouTubeCampaign = {
  id: 'demo-youtube-campaign',
  name: '🎵 Afrobeats Summer Vibes — Afrobeats YouTube Campaign',
  campaignType: 'VIDEO_VIEWS',
  status: 'DRAFT',
  dailyBudget: 5,
  generatedAt: new Date().toISOString(),
  playlistName: 'Afrobeats Summer Vibes',
  genre: 'afrobeats',
  adGroups: [
    {
      name: 'Afrobeats — INSTREAM SKIPPABLE — Demo',
      adFormat: 'INSTREAM_SKIPPABLE',
      dailyBudget: 5,
      biddingStrategy: 'TARGET_CPV',
      targetCpvMicros: 50000,
      startDate: new Date().toISOString().split('T')[0],
      targeting: {
        locations: ['NG', 'GH', 'KE', 'ZA', 'GB'],
        ageGroups: ['AGE_RANGE_18_24', 'AGE_RANGE_25_34'],
        genders: ['GENDER_MALE', 'GENDER_FEMALE', 'GENDER_UNDETERMINED'],
        topics: {
          topicIds: ['/m/04rlf', '/m/0g293'],
          topicLabels: ['Music', 'African Music'],
        },
        audiences: [
          { id: 'yt-music-lovers', name: 'Music lovers' },
          { id: 'yt-streaming-users', name: 'Music streaming app users' },
          { id: 'yt-african-music', name: 'African music fans' },
        ],
        placementChannels: ['https://www.youtube.com/channel/UCsvqVGtbbyHaMoevxljACtg'],
        keywords: ['afrobeats playlist', 'afrobeats music', 'best afrobeats songs'],
      },
      ads: [
        {
          name: '🎵 Playlist Escape — Afrobeats Summer Vibes',
          status: 'DRAFT',
          creative: {
            id: 'yt-template-1',
            name: '🎵 Playlist Escape',
            headline: '🌍 Afrobeats Summer Vibes',
            longHeadline: '🎵 Afrobeats Summer Vibes — Your Afrobeats Escape Starts Here',
            description: 'Discover 45 handpicked Afrobeats tracks. Pure energetic vibes. Listen free on Spotify.',
            callToAction: 'LISTEN_NOW',
            format: 'INSTREAM_SKIPPABLE',
            videoSpecs: {
              format: 'INSTREAM_SKIPPABLE',
              aspectRatio: '16:9',
              orientation: 'landscape',
              minDurationSec: 12,
              recommended: '16:9 landscape, 1920×1080px, 12–60 seconds, MP4/MOV — companion banner 300×60px',
              companionBanner: '300×60px companion banner recommended',
            },
          },
        },
      ],
    },
    {
      name: 'Afrobeats — INFEED VIDEO — Demo',
      adFormat: 'INFEED_VIDEO',
      dailyBudget: 5,
      biddingStrategy: 'TARGET_CPV',
      targetCpvMicros: 50000,
      startDate: new Date().toISOString().split('T')[0],
      targeting: {
        locations: ['NG', 'GH', 'KE', 'ZA', 'GB'],
        ageGroups: ['AGE_RANGE_18_24', 'AGE_RANGE_25_34'],
        genders: ['GENDER_MALE', 'GENDER_FEMALE', 'GENDER_UNDETERMINED'],
        topics: {
          topicIds: ['/m/04rlf', '/m/0g293'],
          topicLabels: ['Music', 'African Music'],
        },
        audiences: [
          { id: 'yt-music-lovers', name: 'Music lovers' },
          { id: 'yt-streaming-users', name: 'Music streaming app users' },
        ],
        placementChannels: ['https://www.youtube.com/channel/UCsvqVGtbbyHaMoevxljACtg'],
        keywords: ['afrobeats playlist', 'afrobeats music', 'best afrobeats songs'],
      },
      ads: [
        {
          name: '🔥 Track Count Hero — Afrobeats Summer Vibes',
          status: 'DRAFT',
          creative: {
            id: 'yt-template-2',
            name: '🔥 Track Count Hero',
            headline: '45 Tracks. Pure Energetic.',
            longHeadline: '🔥 45 Tracks. Pure Energetic. One Playlist. Listen Free on Spotify',
            description: '🌍 45 curated Afrobeats tracks. Not algorithmically generated — just pure feel.',
            callToAction: 'LISTEN_NOW',
            format: 'INFEED_VIDEO',
            videoSpecs: {
              format: 'INFEED_VIDEO',
              aspectRatio: '16:9',
              orientation: 'landscape',
              minDurationSec: 0,
              recommended: '16:9 landscape, 1920×1080px, any length, MP4/MOV',
            },
          },
        },
        {
          name: '❤️ Real Music Lovers — Afrobeats Summer Vibes',
          status: 'DRAFT',
          creative: {
            id: 'yt-template-3',
            name: '❤️ Real Music Lovers',
            headline: 'Curated Afrobeats for fans',
            longHeadline: '❤️ Curated Afrobeats for real music lovers — Hit Subscribe & Listen',
            description: '🌍 45 tracks curated for real Afrobeats fans. New music added weekly.',
            callToAction: 'SUBSCRIBE',
            format: 'INFEED_VIDEO',
            videoSpecs: {
              format: 'INFEED_VIDEO',
              aspectRatio: '16:9',
              orientation: 'landscape',
              minDurationSec: 0,
              recommended: '16:9 landscape, 1920×1080px, any length, MP4/MOV',
            },
          },
        },
      ],
    },
    {
      name: 'Afrobeats — SHORTS — Demo',
      adFormat: 'SHORTS',
      dailyBudget: 5,
      biddingStrategy: 'TARGET_CPV',
      targetCpvMicros: 50000,
      startDate: new Date().toISOString().split('T')[0],
      targeting: {
        locations: ['NG', 'GH', 'KE', 'ZA', 'GB'],
        ageGroups: ['AGE_RANGE_18_24', 'AGE_RANGE_25_34'],
        genders: ['GENDER_MALE', 'GENDER_FEMALE', 'GENDER_UNDETERMINED'],
        topics: {
          topicIds: ['/m/04rlf', '/m/0g293'],
          topicLabels: ['Music', 'African Music'],
        },
        audiences: [
          { id: 'yt-music-lovers', name: 'Music lovers' },
          { id: 'yt-streaming-users', name: 'Music streaming app users' },
        ],
        placementChannels: ['https://www.youtube.com/channel/UCsvqVGtbbyHaMoevxljACtg'],
        keywords: ['afrobeats playlist', 'afrobeats music', 'best afrobeats songs'],
      },
      ads: [
        {
          name: "🎧 Everyone's Talking — Afrobeats Summer Vibes",
          status: 'DRAFT',
          creative: {
            id: 'yt-template-4',
            name: "🎧 Everyone's Talking",
            headline: 'The Afrobeats playlist 🎧',
            longHeadline: "The Afrobeats playlist everyone's talking about 🎧 Link in description",
            description: '45 Afrobeats tracks that hit different. Follow Afrobeats Summer Vibes on Spotify.',
            callToAction: 'LISTEN_NOW',
            format: 'SHORTS',
            videoSpecs: {
              format: 'SHORTS',
              aspectRatio: '9:16',
              orientation: 'vertical',
              minDurationSec: 0,
              maxDurationSec: 60,
              recommended: '9:16 vertical, 1080×1920px, up to 60 seconds, MP4/MOV',
            },
          },
        },
      ],
    },
  ],
};

export const useYouTubeAds = () => {
  const { analysis, targeting, isDemoMode } = useAppStore();
  const [youtubeCampaign, setYouTubeCampaign] = useState<YouTubeCampaign | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generate = useCallback(
    async (dailyBudget = 5) => {
      if (!analysis || !targeting) {
        toast.error('Please complete analysis and targeting first');
        return;
      }

      setIsLoading(true);
      try {
        if (isDemoMode) {
          await new Promise((r) => setTimeout(r, 800));
          setYouTubeCampaign({
            ...DEMO_YOUTUBE_CAMPAIGN,
            dailyBudget,
            generatedAt: new Date().toISOString(),
          });
          toast.success('YouTube campaign generated! 📺');
          return;
        }

        const campaign = generateYouTubeCampaign(analysis, targeting, dailyBudget);
        setYouTubeCampaign(campaign);
        toast.success('YouTube campaign generated! 📺');
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to generate YouTube campaign.';
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [analysis, targeting, isDemoMode]
  );

  return { youtubeCampaign, setYouTubeCampaign, generate, isLoading };
};
