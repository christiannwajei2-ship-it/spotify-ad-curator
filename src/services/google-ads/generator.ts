import type { PlaylistAnalysis, TargetingRecommendation } from '../../types';
import type {
  GoogleCampaign,
  GoogleAdGroup,
  GoogleKeyword,
  GoogleAudienceSegment,
  GoogleAdGroupTargeting,
} from './types';
import { generateGoogleSearchCreatives, generateGoogleDisplayCreatives } from './templates';
import { generateId } from '../../utils/helpers';
import { capitalize } from '../../utils/formatters';

const GOOGLE_MIN_DAILY_BUDGET = 1; // USD

// ===================================================
// Genre → Search keywords
// ===================================================

const buildSearchKeywords = (genre: string, playlistName: string): GoogleKeyword[] => {
  const g = genre.toLowerCase();
  return [
    // Phrase match — discovery intent
    { text: `best ${g} playlist`,          matchType: 'PHRASE' },
    { text: `${g} spotify playlist`,       matchType: 'PHRASE' },
    { text: `new ${g} songs`,              matchType: 'PHRASE' },
    // Broad match — wide reach
    { text: `${g} music`,                  matchType: 'BROAD' },
    { text: `${g} playlist`,               matchType: 'BROAD' },
    // Exact match — high intent
    { text: `best ${g} songs`,             matchType: 'EXACT' },
    { text: `${g} playlist spotify`,       matchType: 'EXACT' },
    // Playlist name
    { text: playlistName.toLowerCase(),    matchType: 'EXACT' },
  ];
};

const NEGATIVE_KEYWORDS = [
  'free download',
  'mp3 download',
  'illegal',
  'torrent',
  'pirate',
  'crack',
  'how to make',
  'tutorial',
  'learn',
];

// ===================================================
// Genre → Display audience segments
// ===================================================

const getDisplayAudiences = (genre: string): GoogleAudienceSegment[] => {
  const base: GoogleAudienceSegment[] = [
    { id: 'gdn-music-lovers',    name: 'Music Lovers',      type: 'AFFINITY' },
    { id: 'gdn-music-streaming', name: 'Music Streaming',   type: 'IN_MARKET' },
    { id: 'gdn-entertainment',   name: 'Entertainment',     type: 'IN_MARKET' },
  ];

  const lower = genre.toLowerCase();
  if (lower.includes('afro')) {
    base.push({ id: 'gdn-world-music', name: 'World Music Fans', type: 'AFFINITY' });
  } else if (lower.includes('hip') || lower.includes('rap')) {
    base.push({ id: 'gdn-urban-music', name: 'Urban & Hip-Hop Fans', type: 'AFFINITY' });
  } else if (lower.includes('edm') || lower.includes('dance') || lower.includes('house')) {
    base.push({ id: 'gdn-electronic', name: 'Electronic Music Fans', type: 'AFFINITY' });
  } else if (lower.includes('rock') || lower.includes('metal')) {
    base.push({ id: 'gdn-rock', name: 'Rock Music Fans', type: 'AFFINITY' });
  } else if (lower.includes('pop')) {
    base.push({ id: 'gdn-pop', name: 'Pop Music Fans', type: 'AFFINITY' });
  } else if (lower.includes('latin') || lower.includes('reggaeton')) {
    base.push({ id: 'gdn-latin', name: 'Latin Music Fans', type: 'AFFINITY' });
  } else if (lower.includes('kpop') || lower.includes('k-pop')) {
    base.push({ id: 'gdn-kpop', name: 'K-Pop Fans', type: 'AFFINITY' });
  }

  return base;
};

// ===================================================
// Display placement sites (music/entertainment)
// ===================================================

const DISPLAY_PLACEMENTS = [
  'pitchfork.com',
  'rollingstone.com',
  'nme.com',
  'billboard.com',
  'allmusic.com',
  'stereogum.com',
];

// ===================================================
// API payload builder
// ===================================================

const buildGoogleAdsApiPayload = (
  campaign: Omit<GoogleCampaign, 'id' | 'googleAdsApiPayload'>,
  adGroups: GoogleAdGroup[]
): Record<string, unknown> => ({
  campaign: {
    name: campaign.name,
    advertisingChannelType: campaign.campaignType,
    status: 'PAUSED',
    campaignBudget: {
      amountMicros: campaign.dailyBudget * 1_000_000,
      deliveryMethod: 'STANDARD',
    },
    biddingStrategyType: 'MAXIMIZE_CLICKS',
  },
  adGroups: adGroups.map((ag) => ({
    name: ag.name,
    type: ag.campaignType === 'DISPLAY' ? 'DISPLAY_STANDARD' : 'SEARCH_STANDARD',
    targeting: {
      geoTargets: ag.targeting.locations,
      languages: ag.targeting.languages,
      keywords: ag.targeting.keywords?.map((kw) => ({
        text: kw.text,
        matchType: kw.matchType,
      })),
      negativeKeywords: ag.targeting.negativeKeywords,
      audiences: ag.targeting.audiences?.map((a) => ({ id: a.id, name: a.name, type: a.type })),
      placements: ag.targeting.placements,
    },
    ads: ag.ads.map((ad) =>
      ad.searchCreative
        ? {
            name: ad.name,
            type: 'RESPONSIVE_SEARCH_AD',
            headlines: ad.searchCreative.headlines,
            descriptions: ad.searchCreative.descriptions,
            finalUrl: ad.searchCreative.finalUrl,
          }
        : {
            name: ad.name,
            type: 'RESPONSIVE_DISPLAY_AD',
            headlines: ad.displayCreative!.headlines,
            longHeadline: ad.displayCreative!.longHeadline,
            descriptions: ad.displayCreative!.descriptions,
            businessName: ad.displayCreative!.businessName,
            callToAction: ad.displayCreative!.callToAction,
          }
    ),
  })),
});

// ===================================================
// Main generator
// ===================================================

export const generateGoogleCampaign = (
  analysis: PlaylistAnalysis,
  targeting: TargetingRecommendation,
  dailyBudget = 3
): GoogleCampaign => {
  const searchCreatives = generateGoogleSearchCreatives(analysis);
  const displayCreatives = generateGoogleDisplayCreatives(analysis);
  const { countries } = targeting;

  const budget = Math.max(dailyBudget, GOOGLE_MIN_DAILY_BUDGET);
  const topCountries = countries.slice(0, 5).map((c) => c.code);
  const genreLabel = capitalize(analysis.topGenre);
  const today = new Date().toISOString().split('T')[0];

  const keywords = buildSearchKeywords(analysis.topGenre, analysis.playlist.name);
  const audiences = getDisplayAudiences(analysis.topGenre);

  const searchTargeting: GoogleAdGroupTargeting = {
    locations: topCountries,
    languages: ['en'],
    keywords,
    negativeKeywords: NEGATIVE_KEYWORDS,
  };

  const displayTargeting: GoogleAdGroupTargeting = {
    locations: topCountries,
    languages: ['en'],
    audiences,
    placements: DISPLAY_PLACEMENTS,
  };

  // Search ad group
  const searchAdGroup: GoogleAdGroup = {
    name: `${genreLabel} — Search — ${today}`,
    campaignType: 'SEARCH',
    status: 'DRAFT',
    dailyBudget: budget,
    biddingStrategy: 'MAXIMIZE_CLICKS',
    targeting: searchTargeting,
    ads: searchCreatives.map((creative) => ({
      name: `${creative.name} — ${analysis.playlist.name}`,
      status: 'DRAFT' as const,
      searchCreative: creative,
    })),
  };

  // Display ad group
  const displayAdGroup: GoogleAdGroup = {
    name: `${genreLabel} — Display — ${today}`,
    campaignType: 'DISPLAY',
    status: 'DRAFT',
    dailyBudget: budget,
    biddingStrategy: 'MAXIMIZE_CLICKS',
    targeting: displayTargeting,
    ads: displayCreatives.map((creative) => ({
      name: `${creative.name} — ${analysis.playlist.name}`,
      status: 'DRAFT' as const,
      displayCreative: creative,
    })),
  };

  // We produce two campaigns — one Search, one Display
  // Return a combined wrapper that contains both as adGroups
  const adGroups = [searchAdGroup, displayAdGroup];

  const campaignBase = {
    name: `🔍 ${analysis.playlist.name} — ${genreLabel} Google Campaign`,
    campaignType: 'SEARCH' as const,
    status: 'DRAFT' as const,
    dailyBudget: budget,
    adGroups,
    generatedAt: new Date().toISOString(),
    playlistName: analysis.playlist.name,
    genre: analysis.topGenre,
  };

  return {
    ...campaignBase,
    id: generateId(),
    googleAdsApiPayload: buildGoogleAdsApiPayload(campaignBase, adGroups),
  };
};
