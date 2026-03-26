import type { GoogleCampaign, GoogleAdGroup, GoogleAd } from './types';

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

export interface CreateGoogleCampaignParams {
  name: string;
  campaignType: string;
  dailyBudgetMicros: number;   // daily budget in micros
}

export const createGoogleCampaign = async (
  params: CreateGoogleCampaignParams
): Promise<string> => {
  const advertisingChannelType =
    params.campaignType === 'DISPLAY' ? 'DISPLAY' : 'SEARCH';

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
              advertisingChannelType,
              status: 'PAUSED',
              campaignBudget: {
                amountMicros: params.dailyBudgetMicros,
                deliveryMethod: 'STANDARD',
              },
              biddingStrategyType: 'MAXIMIZE_CLICKS',
            },
          },
        ],
      }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      (data.error?.message as string | undefined) ?? 'Failed to create Google campaign'
    );
  }
  const resourceName = data.results?.[0]?.resourceName as string | undefined;
  return resourceName ?? '';
};

// ===================================================
// Ad Group
// ===================================================

export const createGoogleAdGroup = async (
  campaignResourceName: string,
  adGroup: GoogleAdGroup
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
              type: adGroup.campaignType === 'DISPLAY' ? 'DISPLAY_STANDARD' : 'SEARCH_STANDARD',
            },
          },
        ],
      }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      (data.error?.message as string | undefined) ?? 'Failed to create Google ad group'
    );
  }
  const resourceName = data.results?.[0]?.resourceName as string | undefined;
  return resourceName ?? '';
};

// ===================================================
// Keywords (Search campaigns only)
// ===================================================

export const createGoogleKeywords = async (
  adGroupResourceName: string,
  adGroup: GoogleAdGroup
): Promise<void> => {
  if (!adGroup.targeting.keywords?.length) return;

  const keywordOps = adGroup.targeting.keywords.map((kw) => ({
    create: {
      adGroup: adGroupResourceName,
      text: kw.text,
      matchType: kw.matchType,
      status: 'ENABLED',
    },
  }));

  const negativeOps = (adGroup.targeting.negativeKeywords ?? []).map((text) => ({
    create: {
      adGroup: adGroupResourceName,
      text,
      matchType: 'BROAD',
      negative: true,
    },
  }));

  const response = await fetch(
    `${BASE_URL}/customers/${getCustomerId()}/adGroupCriteria:mutate`,
    {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ operations: [...keywordOps, ...negativeOps] }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      (data.error?.message as string | undefined) ?? 'Failed to create Google keywords'
    );
  }
};

// ===================================================
// Ad
// ===================================================

export const createGoogleAd = async (
  adGroupResourceName: string,
  ad: GoogleAd
): Promise<string> => {
  const isDisplay = !!ad.displayCreative;
  const creative = ad.searchCreative ?? ad.displayCreative;
  if (!creative) throw new Error('Ad has no creative');

  const adPayload = isDisplay
    ? {
        name: ad.name,
        responsiveDisplayAd: {
          headlines: ad.displayCreative!.headlines.map((text) => ({ text })),
          longHeadline: { text: ad.displayCreative!.longHeadline },
          descriptions: ad.displayCreative!.descriptions.map((text) => ({ text })),
          businessName: ad.displayCreative!.businessName,
          callToActionText: ad.displayCreative!.callToAction,
        },
      }
    : {
        name: ad.name,
        responsiveSearchAd: {
          headlines: ad.searchCreative!.headlines.map((text) => ({ text })),
          descriptions: ad.searchCreative!.descriptions.map((text) => ({ text })),
          path1: 'spotify',
          path2: 'playlist',
        },
        finalUrls: [ad.searchCreative!.finalUrl],
      };

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
              ad: adPayload,
            },
          },
        ],
      }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      (data.error?.message as string | undefined) ?? 'Failed to create Google ad'
    );
  }
  const resourceName = data.results?.[0]?.resourceName as string | undefined;
  return resourceName ?? '';
};

// ===================================================
// Full Campaign Creation (Campaign → Ad Groups → Ads)
// ===================================================

export const publishGoogleCampaign = async (campaign: GoogleCampaign): Promise<void> => {
  const campaignResourceName = await createGoogleCampaign({
    name: campaign.name,
    campaignType: campaign.campaignType,
    dailyBudgetMicros: campaign.dailyBudget * 1_000_000,
  });

  for (const adGroup of campaign.adGroups) {
    const adGroupResourceName = await createGoogleAdGroup(campaignResourceName, adGroup);
    await createGoogleKeywords(adGroupResourceName, adGroup);
    for (const ad of adGroup.ads) {
      await createGoogleAd(adGroupResourceName, ad);
    }
  }
};
