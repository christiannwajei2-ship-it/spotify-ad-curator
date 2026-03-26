import type { PlaylistAnalysis, TargetingRecommendation, AdCampaign, AdSet } from '../../types';
import { generateAdCreatives } from './templates';
import { generateId } from '../../utils/helpers';
import { capitalize } from '../../utils/formatters';

export const generateCampaign = (
  analysis: PlaylistAnalysis,
  targeting: TargetingRecommendation,
  dailyBudget = 2
): AdCampaign => {
  const creatives = generateAdCreatives(analysis);
  const { countries, demographics, interests } = targeting;

  // Top 5 countries by targeting score
  const topCountries = countries.slice(0, 5).map((c) => c.code);

  const adSet: AdSet = {
    name: `${capitalize(analysis.topGenre)} Listeners — ${topCountries.join(', ')} — ${new Date().toLocaleDateString()}`,
    dailyBudget: dailyBudget * 100, // Meta uses cents
    bidStrategy: 'LOWEST_COST_WITHOUT_CAP',
    objective: 'LINK_CLICKS',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    targeting: {
      geoLocations: { countries: topCountries },
      ageMin: demographics.ageMin,
      ageMax: demographics.ageMax,
      interests: interests.map((i) => ({ id: i.id, name: i.name })),
      publisherPlatforms: ['facebook', 'instagram'],
      facebookPositions: ['feed', 'marketplace', 'video_feeds'],
      instagramPositions: ['stream', 'story', 'reels'],
    },
    optimizationGoal: 'LINK_CLICKS',
    billingEvent: 'IMPRESSIONS',
  };

  const campaign: AdCampaign = {
    id: generateId(),
    name: `🎵 ${analysis.playlist.name} — ${capitalize(analysis.topGenre)} Growth Campaign`,
    objective: 'LINK_CLICKS',
    status: 'DRAFT',
    dailyBudget,
    specialAdCategories: [],
    adSets: [adSet],
    creatives,
    generatedAt: new Date().toISOString(),
    playlistName: analysis.playlist.name,
    genre: analysis.topGenre,
    metaApiPayload: buildMetaApiPayload(analysis, adSet, dailyBudget),
  };

  return campaign;
};

const buildMetaApiPayload = (
  analysis: PlaylistAnalysis,
  adSet: AdSet,
  dailyBudget: number
): Record<string, unknown> => ({
  campaign: {
    name: `Spotify Ad Curator — ${analysis.playlist.name} — ${new Date().toLocaleDateString()}`,
    objective: 'LINK_CLICKS',
    status: 'PAUSED',
    special_ad_categories: [],
    bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
  },
  ad_set: {
    name: adSet.name,
    daily_budget: dailyBudget * 100,
    billing_event: 'IMPRESSIONS',
    optimization_goal: 'LINK_CLICKS',
    bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
    targeting: {
      geo_locations: adSet.targeting.geoLocations,
      age_min: adSet.targeting.ageMin,
      age_max: adSet.targeting.ageMax,
      interests: adSet.targeting.interests,
      publisher_platforms: adSet.targeting.publisherPlatforms,
      facebook_positions: adSet.targeting.facebookPositions,
      instagram_positions: adSet.targeting.instagramPositions,
    },
    start_time: adSet.startTime,
  },
  ad_creative: {
    name: `Creative — ${analysis.playlist.name}`,
    object_story_spec: {
      link_data: {
        link: analysis.playlist.spotifyUrl,
        message: '🎵 Discover your next favorite playlist ❤️',
        name: analysis.playlist.name,
        description: `${analysis.topGenre} • ${analysis.playlist.trackCount} tracks`,
        call_to_action: { type: 'LISTEN_NOW', value: { link: analysis.playlist.spotifyUrl } },
        image_hash: 'REPLACE_WITH_YOUR_IMAGE_HASH',
      },
    },
  },
});
