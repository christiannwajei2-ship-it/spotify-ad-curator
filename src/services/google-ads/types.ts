// ===================================================
// Google Search + Display Ads Types
// ===================================================

export type GoogleCampaignType =
  | 'SEARCH'    // Google Search ads targeting keywords
  | 'DISPLAY';  // Google Display Network ads

export type GoogleAdStatus = 'ENABLED' | 'PAUSED' | 'DRAFT';

export type GoogleBiddingStrategy =
  | 'MAXIMIZE_CLICKS'       // Smart bidding — maximize clicks within budget
  | 'TARGET_CPA'            // Target cost per acquisition
  | 'TARGET_ROAS'           // Target return on ad spend
  | 'MANUAL_CPC';           // Manual cost per click

// ===================================================
// Search — Keyword Match Types
// ===================================================

export type GoogleKeywordMatchType =
  | 'BROAD'    // broad match
  | 'PHRASE'   // "phrase match"
  | 'EXACT';   // [exact match]

export interface GoogleKeyword {
  text: string;
  matchType: GoogleKeywordMatchType;
}

// ===================================================
// Display — Audience Targeting
// ===================================================

export type GoogleAudienceType =
  | 'AFFINITY'    // Interest-based (e.g. Music Lovers)
  | 'IN_MARKET';  // Actively researching (e.g. Music Streaming)

export interface GoogleAudienceSegment {
  id: string;
  name: string;
  type: GoogleAudienceType;
}

// ===================================================
// Campaign
// ===================================================

export interface GoogleCampaign {
  id: string;
  name: string;
  campaignType: GoogleCampaignType;
  status: GoogleAdStatus;
  dailyBudget: number;        // USD — minimum $1/day
  adGroups: GoogleAdGroup[];
  generatedAt: string;
  playlistName: string;
  genre: string;
  googleAdsApiPayload?: Record<string, unknown>;
}

// ===================================================
// Ad Group
// ===================================================

export interface GoogleAdGroupTargeting {
  locations: string[];                   // ISO country codes
  languages: string[];                   // e.g. ['en', 'fr']
  keywords?: GoogleKeyword[];            // Search campaigns
  negativeKeywords?: string[];           // Keywords to exclude (Search)
  audiences?: GoogleAudienceSegment[];   // Display campaigns
  placements?: string[];                 // Display — target sites/apps
}

export interface GoogleAdGroup {
  name: string;
  campaignType: GoogleCampaignType;
  status: GoogleAdStatus;
  dailyBudget: number;
  biddingStrategy: GoogleBiddingStrategy;
  targeting: GoogleAdGroupTargeting;
  ads: GoogleAd[];
}

// ===================================================
// Search Ad Creative
// ===================================================

export interface GoogleSearchCreativeTemplate {
  id: string;
  name: string;
  headlines: string[];         // 3 headlines, max 30 chars each
  descriptions: string[];      // 2 descriptions, max 90 chars each
  finalUrl: string;
  displayPath?: string;        // display path appended to domain (e.g. /spotify/playlist)
}

// ===================================================
// Display Ad Creative
// ===================================================

export interface GoogleDisplayImageSpec {
  width: number;
  height: number;
  label: string;               // e.g. "Leaderboard 728×90"
  recommended: string;         // format notes
}

export interface GoogleDisplayCreativeTemplate {
  id: string;
  name: string;
  headlines: string[];         // 1–5 short headlines, max 30 chars
  longHeadline: string;        // 1 long headline, max 90 chars
  descriptions: string[];      // 1–5 descriptions, max 90 chars
  businessName: string;        // max 25 chars
  imageSpecs: GoogleDisplayImageSpec[];
  callToAction: string;
}

// ===================================================
// Ad (wraps either Search or Display creative)
// ===================================================

export interface GoogleAd {
  name: string;
  status: GoogleAdStatus;
  searchCreative?: GoogleSearchCreativeTemplate;
  displayCreative?: GoogleDisplayCreativeTemplate;
}
