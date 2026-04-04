import type { YouTubeCampaign, YouTubeAdGroup, YouTubeAd } from './types';

const BASE_URL = 'https://googleads.googleapis.com/v14';

const getHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID ?? ''}`,
  'developer-token': import.meta.env.VITE_GOOGLE_ADS_DEVELOPER_TOKEN ?? '',
});

const getCustomerId = (): string =>
  import.meta.env.VITE_GOOGLE_ADS_CUSTOMER_ID ?? '';

// ===================================================
// Campaign
// ===================================================

export interface CreateYouTubeCampaignParams {
  name: string;
  campaignType: string;
  dailyBudgetMicros: number;   // daily budget in micros
}

export const createYouTubeCampaign = async (
  params: CreateYouTubeCampaignParams
): Promise<string> => {
  const response = await fetch(
    `${BASE_URL}/customers/${getCustomerId()}/campaigns:mutate`,
    {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        operations: [
          {
            create: {
              name: params.name,
              advertisingChannelType: 'VIDEO',
              status: 'PAUSED',
              campaignBudget: {
                amountMicros: params.dailyBudgetMicros,
                deliveryMethod: 'STANDARD',
              },
              videoCampaignSettings: {
                videoAdInventoryControl: {
                  allowedVideoFormats: ['VIDEO_RESPONSIVE'],
                },
              },
            },
          },
        ],
      }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      (data.error?.message as string | undefined) ?? 'Failed to create YouTube campaign'
    );
  }
  const resourceName = data.results?.[0]?.resourceName as string | undefined;
  return resourceName ?? '';
};

// ===================================================
// Ad Group
// ===================================================

export const createYouTubeAdGroup = async (
  campaignResourceName: string,
  adGroup: YouTubeAdGroup
): Promise<string> => {
  const response = await fetch(
    `${BASE_URL}/customers/${getCustomerId()}/adGroups:mutate`,
    {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        operations: [
          {
            create: {
              name: adGroup.name,
              campaign: campaignResourceName,
              status: 'ENABLED',
              adGroupType:
                adGroup.adFormat === 'INFEED_VIDEO'
                  ? 'VIDEO_TRUE_VIEW_IN_DISPLAY'
                  : 'VIDEO_TRUE_VIEW_IN_STREAM',
              cpcBidMicros: adGroup.targetCpvMicros ?? 50000, // default $0.05 CPV
            },
          },
        ],
      }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      (data.error?.message as string | undefined) ?? 'Failed to create YouTube ad group'
    );
  }
  const resourceName = data.results?.[0]?.resourceName as string | undefined;
  return resourceName ?? '';
};

// ===================================================
// Ad
// ===================================================

export const createYouTubeAd = async (
  adGroupResourceName: string,
  ad: YouTubeAd
): Promise<string> => {
  const { creative } = ad;

  const response = await fetch(
    `${BASE_URL}/customers/${getCustomerId()}/adGroupAds:mutate`,
    {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        operations: [
          {
            create: {
              adGroup: adGroupResourceName,
              status: 'PAUSED',
              ad: {
                name: ad.name,
                videoResponsiveAd: {
                  headlines: [{ text: creative.headline }],
                  longHeadlines: [{ text: creative.longHeadline }],
                  descriptions: [{ text: creative.description }],
                  callToActions: [{ text: creative.callToAction.replace(/_/g, ' ') }],
                },
              },
            },
          },
        ],
      }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      (data.error?.message as string | undefined) ?? 'Failed to create YouTube ad'
    );
  }
  const resourceName = data.results?.[0]?.resourceName as string | undefined;
  return resourceName ?? '';
};

// ===================================================
// Full Campaign Creation (Campaign → Ad Groups → Ads)
// ===================================================

export const publishYouTubeCampaign = async (campaign: YouTubeCampaign): Promise<void> => {
  const campaignResourceName = await createYouTubeCampaign({
    name: campaign.name,
    campaignType: campaign.campaignType,
    dailyBudgetMicros: campaign.dailyBudget * 1_000_000,
  });

  for (const adGroup of campaign.adGroups) {
    const adGroupResourceName = await createYouTubeAdGroup(campaignResourceName, adGroup);
    for (const ad of adGroup.ads) {
      await createYouTubeAd(adGroupResourceName, ad);
    }
  }
};
