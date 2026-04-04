import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from '../store';
import { generateTikTokCampaign } from '../services/tiktok-ads';
import type { TikTokCampaign } from '../services/tiktok-ads';

const DEMO_TIKTOK_CAMPAIGN: TikTokCampaign = {
  id: 'demo-tiktok-campaign',
  name: '🎵 Afrobeats Summer Vibes — Afrobeats TikTok Campaign',
  objective: 'TRAFFIC',
  status: 'DRAFT',
  dailyBudget: 5,
  generatedAt: new Date().toISOString(),
  playlistName: 'Afrobeats Summer Vibes',
  genre: 'afrobeats',
  adGroups: [
    {
      name: 'Afrobeats Listeners — NG, GH, KE, ZA, GB — Demo',
      dailyBudget: 5,
      bidStrategy: 'BID_TYPE_NO_BID',
      objective: 'TRAFFIC',
      startTime: new Date(Date.now() + 86400000).toISOString(),
      targeting: {
        locations: ['NG', 'GH', 'KE', 'ZA', 'GB'],
        gender: 'GENDER_UNLIMITED',
        ageGroups: [
          { minAge: 18, maxAge: 24 },
          { minAge: 25, maxAge: 34 },
        ],
        interests: ['Afrobeats', 'African Music', 'Music Streaming', 'Hip Hop', 'R&B'],
        placements: ['PLACEMENT_TIKTOK', 'PLACEMENT_TIKTOK_STORY'],
      },
      optimizationGoal: 'CLICK',
      billingEvent: 'CPC',
      ads: [
        {
          name: '👀 POV Hook — Afrobeats Summer Vibes',
          status: 'DRAFT',
          creative: {
            id: 'tiktok-template-1',
            name: '👀 POV Hook',
            primaryText:
              'POV: You just found the perfect Afrobeats playlist 🎵🔥\n\n🌍 45 handpicked tracks — every single one goes hard. Follow the playlist and thank me later 🙏',
            headline: "The Afrobeats Playlist You've Been Looking For 🎵",
            callToAction: 'LISTEN_NOW',
            hashtags: ['#afrobeatsplaylist', '#MusicVibes', '#energetic', '#SpotifyPlaylist', '#NewMusic', '#PlaylistCurator'],
            videoSpecs: {
              aspectRatio: '9:16',
              orientation: 'vertical',
              minDurationSec: 15,
              maxDurationSec: 60,
              recommended: '9:16 vertical, 1080×1920px, 15–60 seconds, MP4/MOV',
            },
            placements: ['PLACEMENT_TIKTOK', 'PLACEMENT_TIKTOK_STORY'],
          },
        },
      ],
    },
  ],
};

export const useTikTokAds = () => {
  const { analysis, targeting, isDemoMode } = useAppStore();
  const [tikTokCampaign, setTikTokCampaign] = useState<TikTokCampaign | null>(null);
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
          setTikTokCampaign({
            ...DEMO_TIKTOK_CAMPAIGN,
            dailyBudget,
            generatedAt: new Date().toISOString(),
          });
          toast.success('TikTok campaign generated! 📱');
          return;
        }

        const campaign = generateTikTokCampaign(analysis, targeting, dailyBudget);
        setTikTokCampaign(campaign);
        toast.success('TikTok campaign generated! 📱');
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to generate TikTok campaign.';
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [analysis, targeting, isDemoMode]
  );

  return { tikTokCampaign, setTikTokCampaign, generate, isLoading };
};
