import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from '../store';
import { generateGoogleCampaign } from '../services/google-ads';
import type { GoogleCampaign } from '../services/google-ads';

const DEMO_GOOGLE_CAMPAIGN: GoogleCampaign = {
  id: 'demo-google-campaign',
  name: '🔍 Afrobeats Summer Vibes — Afrobeats Google Campaign',
  campaignType: 'SEARCH',
  status: 'DRAFT',
  dailyBudget: 3,
  generatedAt: new Date().toISOString(),
  playlistName: 'Afrobeats Summer Vibes',
  genre: 'afrobeats',
  adGroups: [
    {
      name: 'Afrobeats — Search — Demo',
      campaignType: 'SEARCH',
      status: 'DRAFT',
      dailyBudget: 3,
      biddingStrategy: 'MAXIMIZE_CLICKS',
      targeting: {
        locations: ['NG', 'GH', 'KE', 'ZA', 'GB'],
        languages: ['en'],
        keywords: [
          { text: 'best afrobeats playlist', matchType: 'PHRASE' },
          { text: 'afrobeats spotify playlist', matchType: 'PHRASE' },
          { text: 'new afrobeats songs', matchType: 'PHRASE' },
          { text: 'afrobeats music', matchType: 'BROAD' },
          { text: 'afrobeats playlist', matchType: 'BROAD' },
          { text: 'best afrobeats songs', matchType: 'EXACT' },
          { text: 'afrobeats playlist spotify', matchType: 'EXACT' },
          { text: 'afrobeats summer vibes', matchType: 'EXACT' },
        ],
        negativeKeywords: [
          'free download',
          'mp3 download',
          'illegal',
          'torrent',
          'pirate',
          'crack',
          'how to make',
          'tutorial',
          'learn',
        ],
      },
      ads: [
        {
          name: '🔍 Discovery Intent — Afrobeats Summer Vibes',
          status: 'DRAFT',
          searchCreative: {
            id: 'gs-search-1',
            name: '🔍 Discovery Intent',
            headlines: [
              'Best Afrobeats Playlist',
              '🌍 45 Curated Tracks',
              'Listen Free on Spotify',
            ],
            descriptions: [
              'Discover 45 handpicked Afrobeats tracks. Energetic vibes only. Stream free on Spotify now.',
              '🌍 The ultimate Afrobeats playlist — curated for real music fans. No skips needed.',
            ],
            finalUrl: 'https://open.spotify.com/playlist/',
            displayPath: 'spotify/afrobeats',
          },
        },
        {
          name: '🎵 Playlist Name Hero — Afrobeats Summer Vibes',
          status: 'DRAFT',
          searchCreative: {
            id: 'gs-search-2',
            name: '🎵 Playlist Name Hero',
            headlines: [
              'Afrobeats Summer Vibes',
              'Afrobeats Spotify Playlist',
              'Free — No Sign-Up Needed',
            ],
            descriptions: [
              '"Afrobeats Summer Vibes" — 45 Afrobeats songs curated for energetic moments. Play on Spotify.',
              'New Afrobeats music, added weekly. Join thousands streaming Afrobeats Summer Vibes today.',
            ],
            finalUrl: 'https://open.spotify.com/playlist/',
            displayPath: 'spotify/playlist',
          },
        },
        {
          name: '🆕 New Music Angle — Afrobeats Summer Vibes',
          status: 'DRAFT',
          searchCreative: {
            id: 'gs-search-3',
            name: '🆕 New Music Angle',
            headlines: [
              'New Afrobeats Songs 2024',
              '🌍 Fresh Tracks Weekly',
              'Stream Free on Spotify',
            ],
            descriptions: [
              'Stay ahead — new Afrobeats tracks added every week. 45 songs and counting. Free on Spotify.',
              'Energetic Afrobeats playlist updated with the freshest drops. Hit play — no cost.',
            ],
            finalUrl: 'https://open.spotify.com/playlist/',
            displayPath: 'spotify/new',
          },
        },
        {
          name: 'Energetic Vibe — Afrobeats Summer Vibes',
          status: 'DRAFT',
          searchCreative: {
            id: 'gs-search-4',
            name: 'Energetic Vibe',
            headlines: [
              'Energetic Afrobeats Music',
              '45 Songs for Every Mood',
              "Play Now — It's Free",
            ],
            descriptions: [
              'Feeling energetic? 45 Afrobeats tracks curated to match your energy. Free on Spotify.',
              '🌍 Pure energetic Afrobeats — no filler, no skips. "Afrobeats Summer Vibes" on Spotify.',
            ],
            finalUrl: 'https://open.spotify.com/playlist/',
            displayPath: 'spotify/vibes',
          },
        },
      ],
    },
    {
      name: 'Afrobeats — Display — Demo',
      campaignType: 'DISPLAY',
      status: 'DRAFT',
      dailyBudget: 3,
      biddingStrategy: 'MAXIMIZE_CLICKS',
      targeting: {
        locations: ['NG', 'GH', 'KE', 'ZA', 'GB'],
        languages: ['en'],
        audiences: [
          { id: 'gdn-music-lovers',    name: 'Music Lovers',      type: 'AFFINITY' },
          { id: 'gdn-music-streaming', name: 'Music Streaming',   type: 'IN_MARKET' },
          { id: 'gdn-entertainment',   name: 'Entertainment',     type: 'IN_MARKET' },
          { id: 'gdn-world-music',     name: 'World Music Fans',  type: 'AFFINITY' },
        ],
        placements: [
          'pitchfork.com',
          'rollingstone.com',
          'nme.com',
          'billboard.com',
          'allmusic.com',
          'stereogum.com',
        ],
      },
      ads: [
        {
          name: '🎵 Music Lovers — Afrobeats Summer Vibes',
          status: 'DRAFT',
          displayCreative: {
            id: 'gs-display-1',
            name: '🎵 Music Lovers',
            headlines: ['Afrobeats Playlist', '45 Curated Tracks', 'Free on Spotify'],
            longHeadline: '🎵 Afrobeats Summer Vibes — 45 Afrobeats tracks, zero cost',
            descriptions: [
              'Stream 45 handpicked Afrobeats songs free on Spotify. Energetic vibes all day.',
              '🌍 Real music, curated by fans — discover "Afrobeats Summer Vibes" on Spotify now.',
            ],
            businessName: 'Spotify Ad Curator',
            imageSpecs: [
              { width: 300, height: 250, label: 'Medium Rectangle 300×250', recommended: 'JPG/PNG, max 150KB' },
              { width: 728, height: 90,  label: 'Leaderboard 728×90',       recommended: 'JPG/PNG, max 150KB' },
              { width: 160, height: 600, label: 'Wide Skyscraper 160×600',  recommended: 'JPG/PNG, max 150KB' },
              { width: 320, height: 50,  label: 'Mobile Banner 320×50',     recommended: 'JPG/PNG, max 150KB' },
            ],
            callToAction: 'Listen Now',
          },
        },
        {
          name: '📱 Streaming In-Market — Afrobeats Summer Vibes',
          status: 'DRAFT',
          displayCreative: {
            id: 'gs-display-2',
            name: '📱 Streaming In-Market',
            headlines: ['Stream Afrobeats Free', 'No Subscription Needed', '🌍 Spotify Playlist'],
            longHeadline: 'Stream "Afrobeats Summer Vibes" — 45 Afrobeats songs, free on Spotify',
            descriptions: [
              'Switch to the best Afrobeats playlist on Spotify. 45 tracks, always updating.',
              'Energetic Afrobeats music on demand — no sign-up needed. Hit play on Spotify.',
            ],
            businessName: 'Spotify Ad Curator',
            imageSpecs: [
              { width: 300, height: 250, label: 'Medium Rectangle 300×250', recommended: 'JPG/PNG, max 150KB' },
              { width: 728, height: 90,  label: 'Leaderboard 728×90',       recommended: 'JPG/PNG, max 150KB' },
              { width: 160, height: 600, label: 'Wide Skyscraper 160×600',  recommended: 'JPG/PNG, max 150KB' },
              { width: 320, height: 50,  label: 'Mobile Banner 320×50',     recommended: 'JPG/PNG, max 150KB' },
            ],
            callToAction: 'Play Free',
          },
        },
        {
          name: '🌐 Entertainment Sites — Afrobeats Summer Vibes',
          status: 'DRAFT',
          displayCreative: {
            id: 'gs-display-3',
            name: '🌐 Entertainment Sites',
            headlines: ['Your Energetic Soundtrack', 'Afrobeats — 45 Tracks', 'Listen on Spotify'],
            longHeadline: '🌍 Energetic Afrobeats vibes — "Afrobeats Summer Vibes" is waiting for you',
            descriptions: [
              'Set the mood with 45 Afrobeats tracks. "Afrobeats Summer Vibes" — free on Spotify.',
              'The Afrobeats playlist music lovers are talking about. Stream free, no account required.',
            ],
            businessName: 'Spotify Ad Curator',
            imageSpecs: [
              { width: 300, height: 250, label: 'Medium Rectangle 300×250', recommended: 'JPG/PNG, max 150KB' },
              { width: 728, height: 90,  label: 'Leaderboard 728×90',       recommended: 'JPG/PNG, max 150KB' },
              { width: 160, height: 600, label: 'Wide Skyscraper 160×600',  recommended: 'JPG/PNG, max 150KB' },
              { width: 320, height: 50,  label: 'Mobile Banner 320×50',     recommended: 'JPG/PNG, max 150KB' },
            ],
            callToAction: 'Discover Now',
          },
        },
        {
          name: '📰 Music Blog Placement — Afrobeats Summer Vibes',
          status: 'DRAFT',
          displayCreative: {
            id: 'gs-display-4',
            name: '📰 Music Blog Placement',
            headlines: ['New Afrobeats Playlist', '45 Songs, Zero Cost', 'Stream on Spotify'],
            longHeadline: 'New Afrobeats playlist: "Afrobeats Summer Vibes" — 45 curated tracks on Spotify',
            descriptions: [
              'Discover "Afrobeats Summer Vibes" — 45 curated Afrobeats tracks updated weekly. Free on Spotify.',
              '🌍 The essential Afrobeats listening guide. Stream "Afrobeats Summer Vibes" for free.',
            ],
            businessName: 'Spotify Ad Curator',
            imageSpecs: [
              { width: 300, height: 250, label: 'Medium Rectangle 300×250', recommended: 'JPG/PNG, max 150KB' },
              { width: 728, height: 90,  label: 'Leaderboard 728×90',       recommended: 'JPG/PNG, max 150KB' },
              { width: 160, height: 600, label: 'Wide Skyscraper 160×600',  recommended: 'JPG/PNG, max 150KB' },
              { width: 320, height: 50,  label: 'Mobile Banner 320×50',     recommended: 'JPG/PNG, max 150KB' },
            ],
            callToAction: 'Listen Free',
          },
        },
      ],
    },
  ],
};

export const useGoogleAds = () => {
  const { analysis, targeting, isDemoMode } = useAppStore();
  const [googleCampaign, setGoogleCampaign] = useState<GoogleCampaign | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generate = useCallback(
    async (dailyBudget = 3) => {
      if (!analysis || !targeting) {
        toast.error('Please complete analysis and targeting first');
        return;
      }

      setIsLoading(true);
      try {
        if (isDemoMode) {
          await new Promise((r) => setTimeout(r, 800));
          setGoogleCampaign({
            ...DEMO_GOOGLE_CAMPAIGN,
            dailyBudget,
            generatedAt: new Date().toISOString(),
          });
          toast.success('Google campaign generated! 🔍');
          return;
        }

        const campaign = generateGoogleCampaign(analysis, targeting, dailyBudget);
        setGoogleCampaign(campaign);
        toast.success('Google campaign generated! 🔍');
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to generate Google campaign.';
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [analysis, targeting, isDemoMode]
  );

  return { googleCampaign, setGoogleCampaign, generate, isLoading };
};
