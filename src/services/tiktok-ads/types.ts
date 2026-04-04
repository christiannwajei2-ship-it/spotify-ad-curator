// ===================================================
// TikTok Ads Types
// ===================================================

export type TikTokObjective =
  | 'TRAFFIC'
  | 'REACH'
  | 'VIDEO_VIEWS'
  | 'APP_INSTALL'
  | 'CONVERSIONS';

export type TikTokAdStatus = 'ACTIVE' | 'PAUSED' | 'DRAFT';

export type TikTokBidStrategy =
  | 'BID_TYPE_NO_BID'   // Lowest Cost
  | 'BID_TYPE_CUSTOM';  // Target Cost

export type TikTokPlacement =
  | 'PLACEMENT_TIKTOK'
  | 'PLACEMENT_TOPVIEW'
  | 'PLACEMENT_TIKTOK_STORY';

export type TikTokCallToAction =
  | 'LISTEN_NOW'
  | 'WATCH_NOW'
  | 'FOLLOW_NOW'
  | 'LEARN_MORE'
  | 'SIGN_UP';

export type TikTokGender = 'GENDER_UNLIMITED' | 'GENDER_MALE' | 'GENDER_FEMALE';

// ===================================================
// Campaign
// ===================================================

export interface TikTokCampaign {
  id: string;
  name: string;
  objective: TikTokObjective;
  status: TikTokAdStatus;
  dailyBudget: number;            // USD
  adGroups: TikTokAdGroup[];
  generatedAt: string;
  playlistName: string;
  genre: string;
  tiktokApiPayload?: Record<string, unknown>;
}

// ===================================================
// Ad Group (equivalent to Meta "Ad Set")
// ===================================================

export interface TikTokAgeRange {
  minAge: number;
  maxAge: number;
}

export interface TikTokAdGroupTargeting {
  locations: string[];         // ISO country codes
  gender: TikTokGender;
  ageGroups: TikTokAgeRange[];
  interests: string[];         // TikTok interest category labels
  placements: TikTokPlacement[];
}

export interface TikTokAdGroup {
  name: string;
  dailyBudget: number;          // USD — minimum $5/day
  bidStrategy: TikTokBidStrategy;
  objective: TikTokObjective;
  startTime: string;
  targeting: TikTokAdGroupTargeting;
  optimizationGoal: 'CLICK' | 'REACH' | 'IMPRESSION';
  billingEvent: 'CPC' | 'CPM' | 'CPV';
  ads: TikTokAd[];
}

// ===================================================
// Creative Template (for UI preview / copy generation)
// ===================================================

export interface TikTokCreativeTemplate {
  id: string;
  name: string;
  primaryText: string;
  headline: string;
  callToAction: TikTokCallToAction;
  hashtags: string[];
  videoSpecs: {
    aspectRatio: string;      // '9:16'
    orientation: 'vertical';
    minDurationSec: number;
    maxDurationSec: number;
    recommended: string;
  };
  placements: TikTokPlacement[];
}

// ===================================================
// Ad
// ===================================================

export interface TikTokAd {
  name: string;
  status: TikTokAdStatus;
  creative: TikTokCreativeTemplate;
}
