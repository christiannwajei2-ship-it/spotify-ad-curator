export { generateGoogleCampaign } from './generator';
export { generateGoogleSearchCreatives, generateGoogleDisplayCreatives } from './templates';
export { publishGoogleCampaign } from './api';
export type {
  GoogleCampaign,
  GoogleAdGroup,
  GoogleAd,
  GoogleSearchCreativeTemplate,
  GoogleDisplayCreativeTemplate,
  GoogleDisplayImageSpec,
  GoogleCampaignType,
  GoogleAdStatus,
  GoogleBiddingStrategy,
  GoogleKeyword,
  GoogleKeywordMatchType,
  GoogleAudienceSegment,
  GoogleAudienceType,
  GoogleAdGroupTargeting,
} from './types';
