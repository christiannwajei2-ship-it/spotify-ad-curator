import type { TikTokCampaign, TikTokAdGroup, TikTokAd } from './types';

const BASE_URL = 'https://business-api.tiktok.com/open_api/v1.3';

const getHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  'Access-Token': import.meta.env.VITE_TIKTOK_ACCESS_TOKEN ?? '',
});

const getAdvertiserId = (): string =>
  import.meta.env.VITE_TIKTOK_ADVERTISER_ID ?? '';

// ===================================================
// Campaign
// ===================================================

export interface CreateCampaignParams {
  name: string;
  objective: string;
  dailyBudget: number;
}

export const createCampaign = async (params: CreateCampaignParams): Promise<string> => {
  const response = await fetch(`${BASE_URL}/campaign/create/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      advertiser_id: getAdvertiserId(),
      campaign_name: params.name,
      objective_type: params.objective,
      budget_mode: 'BUDGET_MODE_DAY',
      budget: params.dailyBudget,
    }),
  });
  const data = await response.json();
  if (data.code !== 0) throw new Error(data.message ?? 'Failed to create TikTok campaign');
  return data.data.campaign_id as string;
};

// ===================================================
// Ad Group
// ===================================================

export const createAdGroup = async (
  campaignId: string,
  adGroup: TikTokAdGroup
): Promise<string> => {
  const { targeting } = adGroup;

  const response = await fetch(`${BASE_URL}/adgroup/create/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      advertiser_id: getAdvertiserId(),
      campaign_id: campaignId,
      adgroup_name: adGroup.name,
      placement_type: 'PLACEMENT_TYPE_NORMAL',
      placements: targeting.placements,
      location_ids: targeting.locations,
      gender: targeting.gender,
      age: targeting.ageGroups,
      interest_category_ids: targeting.interests,
      budget_mode: 'BUDGET_MODE_DAY',
      budget: adGroup.dailyBudget,
      schedule_type: 'SCHEDULE_START_END',
      schedule_start_time: adGroup.startTime,
      optimization_goal: adGroup.optimizationGoal,
      billing_event: adGroup.billingEvent,
      bid_type: adGroup.bidStrategy,
    }),
  });
  const data = await response.json();
  if (data.code !== 0) throw new Error(data.message ?? 'Failed to create TikTok ad group');
  return data.data.adgroup_id as string;
};

// ===================================================
// Ad
// ===================================================

export const createAd = async (
  adGroupId: string,
  ad: TikTokAd
): Promise<string> => {
  const { creative } = ad;

  const response = await fetch(`${BASE_URL}/ad/create/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      advertiser_id: getAdvertiserId(),
      adgroup_id: adGroupId,
      ads: [
        {
          ad_name: ad.name,
          ad_text: creative.primaryText,
          call_to_action: creative.callToAction,
          ad_format: 'SINGLE_VIDEO',
        },
      ],
    }),
  });
  const data = await response.json();
  if (data.code !== 0) throw new Error(data.message ?? 'Failed to create TikTok ad');
  return (data.data.ad_ids[0] ?? '') as string;
};

// ===================================================
// Full Campaign Creation (Campaign → Ad Group → Ads)
// ===================================================

export const publishCampaign = async (campaign: TikTokCampaign): Promise<void> => {
  const campaignId = await createCampaign({
    name: campaign.name,
    objective: campaign.objective,
    dailyBudget: campaign.dailyBudget,
  });

  for (const adGroup of campaign.adGroups) {
    const adGroupId = await createAdGroup(campaignId, adGroup);
    for (const ad of adGroup.ads) {
      await createAd(adGroupId, ad);
    }
  }
};
