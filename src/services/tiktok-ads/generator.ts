import type { PlaylistAnalysis, TargetingRecommendation } from '../../types';
import type { TikTokCampaign, TikTokAdGroup, TikTokGender, TikTokAgeRange } from './types';
import { generateTikTokCreatives } from './templates';
import { generateId } from '../../utils/helpers';
import { capitalize } from '../../utils/formatters';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const TIKTOK_MIN_DAILY_BUDGET = 5; // USD

const getGenderTargeting = (genderTargeting: string): TikTokGender => {
  if (genderTargeting === 'male') return 'GENDER_MALE';
  if (genderTargeting === 'female') return 'GENDER_FEMALE';
  return 'GENDER_UNLIMITED';
};

const buildAgeGroups = (ageMin: number, ageMax: number): TikTokAgeRange[] => {
  const ranges: TikTokAgeRange[] = [];
  const breakpoints = [13, 18, 25, 35, 45, 55];
  for (let i = 0; i < breakpoints.length - 1; i++) {
    const lo = breakpoints[i];
    const hi = breakpoints[i + 1] - 1;
    if (lo <= ageMax && hi >= ageMin) {
      ranges.push({ minAge: Math.max(lo, ageMin), maxAge: Math.min(hi, ageMax) });
    }
  }
  if (ageMax >= 55) ranges.push({ minAge: Math.max(55, ageMin), maxAge: 100 });
  return ranges.length > 0 ? ranges : [{ minAge: ageMin, maxAge: ageMax }];
};

const buildTikTokApiPayload = (
  campaign: Omit<TikTokCampaign, 'id' | 'tiktokApiPayload'>,
  adGroup: TikTokAdGroup
): Record<string, unknown> => ({
  campaign: {
    campaign_name: campaign.name,
    objective_type: campaign.objective,
    budget_mode: 'BUDGET_MODE_DAY',
    budget: campaign.dailyBudget,
    status: 'STATUS_DISABLE',
  },
  ad_group: {
    adgroup_name: adGroup.name,
    placement_type: 'PLACEMENT_TYPE_NORMAL',
    placements: adGroup.targeting.placements,
    location_ids: adGroup.targeting.locations,
    gender: adGroup.targeting.gender,
    age: adGroup.targeting.ageGroups,
    interest_category_ids: adGroup.targeting.interests,
    budget_mode: 'BUDGET_MODE_DAY',
    budget: adGroup.dailyBudget,
    schedule_type: 'SCHEDULE_START_END',
    schedule_start_time: adGroup.startTime,
    optimization_goal: adGroup.optimizationGoal,
    billing_event: adGroup.billingEvent,
    bid_type: adGroup.bidStrategy,
  },
  ads: adGroup.ads.map((ad) => ({
    ad_name: ad.name,
    ad_text: ad.creative.primaryText,
    call_to_action: ad.creative.callToAction,
    ad_format: 'SINGLE_VIDEO',
  })),
});

export const generateTikTokCampaign = (
  analysis: PlaylistAnalysis,
  targeting: TargetingRecommendation,
  dailyBudget = 5
): TikTokCampaign => {
  const creatives = generateTikTokCreatives(analysis);
  const { countries, demographics, interests } = targeting;

  const budget = Math.max(dailyBudget, TIKTOK_MIN_DAILY_BUDGET);
  const topCountries = countries.slice(0, 5).map((c) => c.code);
  const genreLabel = capitalize(analysis.topGenre);
  const startTime = new Date(Date.now() + ONE_DAY_MS).toISOString();

  const adGroup: TikTokAdGroup = {
    name: `${genreLabel} Listeners — ${topCountries.join(', ')} — ${new Date().toLocaleDateString()}`,
    dailyBudget: budget,
    bidStrategy: 'BID_TYPE_NO_BID',
    objective: 'TRAFFIC',
    startTime,
    targeting: {
      locations: topCountries,
      gender: getGenderTargeting(demographics.genderTargeting),
      ageGroups: buildAgeGroups(demographics.ageMin, demographics.ageMax),
      interests: interests.map((i) => i.name),
      placements: ['PLACEMENT_TIKTOK', 'PLACEMENT_TIKTOK_STORY'],
    },
    optimizationGoal: 'CLICK',
    billingEvent: 'CPC',
    ads: creatives.map((creative) => ({
      name: `${creative.name} — ${analysis.playlist.name}`,
      status: 'DRAFT',
      creative,
    })),
  };

  const campaignBase = {
    name: `🎵 ${analysis.playlist.name} — ${genreLabel} TikTok Campaign`,
    objective: 'TRAFFIC' as const,
    status: 'DRAFT' as const,
    dailyBudget: budget,
    adGroups: [adGroup],
    generatedAt: new Date().toISOString(),
    playlistName: analysis.playlist.name,
    genre: analysis.topGenre,
  };

  const campaign: TikTokCampaign = {
    ...campaignBase,
    id: generateId(),
    tiktokApiPayload: buildTikTokApiPayload(campaignBase, adGroup),
  };

  return campaign;
};
