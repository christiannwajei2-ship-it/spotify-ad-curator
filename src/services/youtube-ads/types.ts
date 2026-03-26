// ===================================================
// YouTube Ads Types
// ===================================================

export type YouTubeCampaignType =
  | 'VIDEO_VIEWS'       // Maximize views (In-stream + In-feed)
  | 'VIDEO_REACH';      // Efficient reach (Bumpers, non-skippable)

export type YouTubeAdFormat =
  | 'INSTREAM_SKIPPABLE'    // Skippable in-stream (skip after 5s)
  | 'INFEED_VIDEO'          // In-feed / discovery ads
  | 'SHORTS';               // YouTube Shorts ads (9:16)

export type YouTubeAdStatus = 'ENABLED' | 'PAUSED' | 'DRAFT';

export type YouTubeBiddingStrategy =
  | 'TARGET_CPV'             // Target Cost-Per-View
  | 'MAXIMIZE_CONVERSIONS'   // Smart bidding
  | 'TARGET_CPM';            // Target CPM for reach campaigns

export type YouTubeCallToAction =
  | 'LISTEN_NOW'
  | 'WATCH_NOW'
  | 'SUBSCRIBE'
  | 'LEARN_MORE'
  | 'VISIT_SITE';

// ===================================================
// Campaign
// ===================================================

export interface YouTubeCampaign {
  id: string;
  name: string;
  campaignType: YouTubeCampaignType;
  status: YouTubeAdStatus;
  dailyBudget: number;        // USD — minimum $1/day
  adGroups: YouTubeAdGroup[];
  generatedAt: string;
  playlistName: string;
  genre: string;
  youtubeApiPayload?: Record<string, unknown>;
}

// ===================================================
// Ad Group
// ===================================================

export interface YouTubeTopicTargeting {
  topicIds: string[];         // Google Ads topic IDs (music-related)
  topicLabels: string[];      // Human-readable labels
}

export interface YouTubeAudienceSegment {
  id: string;
  name: string;               // e.g. "Music lovers", "Afrobeats fans"
}

export interface YouTubeAdGroupTargeting {
  locations: string[];                    // ISO country codes
  ageGroups: string[];                    // e.g. ['AGE_RANGE_18_24', 'AGE_RANGE_25_34']
  genders: string[];                      // ['GENDER_MALE', 'GENDER_FEMALE', 'GENDER_UNDETERMINED']
  topics: YouTubeTopicTargeting;
  audiences: YouTubeAudienceSegment[];
  placementChannels: string[];            // YouTube channel URLs for placement targeting
  keywords: string[];                     // Contextual keywords
}

export interface YouTubeAdGroup {
  name: string;
  adFormat: YouTubeAdFormat;
  dailyBudget: number;          // USD
  biddingStrategy: YouTubeBiddingStrategy;
  targetCpvMicros?: number;     // Target CPV in micros (millionths of a dollar)
  startDate: string;
  targeting: YouTubeAdGroupTargeting;
  ads: YouTubeAd[];
}

// ===================================================
// Creative
// ===================================================

export interface YouTubeVideoSpecs {
  format: YouTubeAdFormat;
  aspectRatio: '16:9' | '9:16';
  orientation: 'landscape' | 'vertical';
  minDurationSec: number;
  maxDurationSec?: number;
  recommended: string;
  companionBanner?: string;     // Companion banner specs for in-stream
}

export interface YouTubeCreativeTemplate {
  id: string;
  name: string;
  headline: string;             // max 30 chars
  longHeadline: string;         // max 90 chars
  description: string;          // max 90 chars
  callToAction: YouTubeCallToAction;
  videoSpecs: YouTubeVideoSpecs;
  format: YouTubeAdFormat;
}

// ===================================================
// Ad
// ===================================================

export interface YouTubeAd {
  name: string;
  status: YouTubeAdStatus;
  creative: YouTubeCreativeTemplate;
}
