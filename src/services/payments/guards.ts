// ===================================================
// Payments Service — Feature Guards / Access Control
// ===================================================

import type { PricingTier } from './types';
import { PLANS } from './plans';

// ===================================================
// Platform access
// ===================================================

/**
 * Check if a user's tier allows access to a given ad platform.
 */
export function canAccessPlatform(tier: PricingTier, platform: string): boolean {
  return PLANS[tier]?.limits.platforms.includes(platform) ?? false;
}

// ===================================================
// AI Copy generation
// ===================================================

/**
 * Check if the user can generate more AI copy given their tier and usage this month.
 * Returns true when allowed, false when they've hit their limit.
 */
export function canGenerateAICopy(tier: PricingTier, usageCount: number): boolean {
  const limit = PLANS[tier]?.limits.aiCopyGenerationsPerMonth;
  if (limit === null) return true; // unlimited
  return usageCount < limit;
}

/**
 * Return remaining AI copy generations this month (null = unlimited).
 */
export function remainingAICopyGenerations(tier: PricingTier, usageCount: number): number | null {
  const limit = PLANS[tier]?.limits.aiCopyGenerationsPerMonth;
  if (limit === null) return null;
  return Math.max(0, limit - usageCount);
}

// ===================================================
// Export access
// ===================================================

/**
 * Check if the user can export reports.
 */
export function canExportReport(tier: PricingTier): boolean {
  return PLANS[tier]?.limits.canExport ?? false;
}

// ===================================================
// Analysis limits
// ===================================================

/**
 * Check if the user can run another analysis today.
 */
export function canAnalyze(tier: PricingTier, dailyCount: number): boolean {
  const limit = PLANS[tier]?.limits.analysesPerDay;
  if (limit === null) return true;
  return dailyCount < limit;
}

/**
 * Return remaining analyses today (null = unlimited).
 */
export function remainingAnalyses(tier: PricingTier, dailyCount: number): number | null {
  const limit = PLANS[tier]?.limits.analysesPerDay;
  if (limit === null) return null;
  return Math.max(0, limit - dailyCount);
}

// ===================================================
// Analytics window
// ===================================================

/**
 * Check if the user can view analytics for a given number of days.
 */
export function canViewAnalyticsPeriod(tier: PricingTier, days: number): boolean {
  return (PLANS[tier]?.limits.analyticsWindowDays ?? 7) >= days;
}

// ===================================================
// Apple Music
// ===================================================

export function canUseAppleMusic(tier: PricingTier): boolean {
  return PLANS[tier]?.limits.canUseAppleMusic ?? false;
}

// ===================================================
// Usage summary
// ===================================================

export interface RemainingUsage {
  analysesToday: number | null;
  aiCopyThisMonth: number | null;
  analyticsWindowDays: number;
  canExport: boolean;
  platforms: string[];
}

export function getRemainingUsage(
  tier: PricingTier,
  currentUsage: { analysesToday: number; aiCopyThisMonth: number }
): RemainingUsage {
  const plan = PLANS[tier];
  return {
    analysesToday: plan?.limits.analysesPerDay === null
      ? null
      : Math.max(0, (plan?.limits.analysesPerDay ?? 0) - currentUsage.analysesToday),
    aiCopyThisMonth: plan?.limits.aiCopyGenerationsPerMonth === null
      ? null
      : Math.max(0, (plan?.limits.aiCopyGenerationsPerMonth ?? 0) - currentUsage.aiCopyThisMonth),
    analyticsWindowDays: plan?.limits.analyticsWindowDays ?? 7,
    canExport: plan?.limits.canExport ?? false,
    platforms: plan?.limits.platforms ?? [],
  };
}

// ===================================================
// Upgrade messaging
// ===================================================

export type GatedFeature =
  | 'tiktok'
  | 'youtube'
  | 'google-search'
  | 'google-display'
  | 'ai-copy'
  | 'export'
  | 'analytics-30d'
  | 'analytics-90d'
  | 'apple-music'
  | 'multi-campaign'
  | 'white-label'
  | 'api'
  | 'team';

interface UpgradeMessage {
  title: string;
  description: string;
  requiredTier: 'pro' | 'agency';
  cta: string;
}

const UPGRADE_MESSAGES: Record<GatedFeature, UpgradeMessage> = {
  'tiktok': {
    title: 'TikTok Ads require Pro',
    description: 'Reach Gen Z and millennials on the fastest-growing platform. Upgrade to Pro to unlock TikTok ad generation.',
    requiredTier: 'pro',
    cta: 'Upgrade to Pro',
  },
  'youtube': {
    title: 'YouTube Ads require Pro',
    description: 'Promote your music with skippable and non-skippable video ads. Upgrade to Pro to unlock YouTube ad generation.',
    requiredTier: 'pro',
    cta: 'Upgrade to Pro',
  },
  'google-search': {
    title: 'Google Search Ads require Pro',
    description: 'Capture fans searching for your genre or similar artists. Upgrade to Pro to unlock Google Ads.',
    requiredTier: 'pro',
    cta: 'Upgrade to Pro',
  },
  'google-display': {
    title: 'Google Display Ads require Pro',
    description: 'Show banner ads across millions of websites. Upgrade to Pro to unlock Google Display Ads.',
    requiredTier: 'pro',
    cta: 'Upgrade to Pro',
  },
  'ai-copy': {
    title: 'AI copy limit reached',
    description: "You've used all 3 free AI copy generations this month. Upgrade to Pro for unlimited generations.",
    requiredTier: 'pro',
    cta: 'Upgrade to Pro',
  },
  'export': {
    title: 'Export requires Pro',
    description: 'Download your campaign data as CSV or JSON. Upgrade to Pro to unlock report exports.',
    requiredTier: 'pro',
    cta: 'Upgrade to Pro',
  },
  'analytics-30d': {
    title: '30-day analytics require Pro',
    description: 'See trends over 30 days to spot what\'s working. Upgrade to Pro for extended analytics.',
    requiredTier: 'pro',
    cta: 'Upgrade to Pro',
  },
  'analytics-90d': {
    title: '90-day analytics require Pro',
    description: 'Get the full picture with 90 days of performance data. Upgrade to Pro for full analytics.',
    requiredTier: 'pro',
    cta: 'Upgrade to Pro',
  },
  'apple-music': {
    title: 'Apple Music requires Pro',
    description: 'Analyze Apple Music playlists and generate ads for Apple Music fans. Upgrade to Pro.',
    requiredTier: 'pro',
    cta: 'Upgrade to Pro',
  },
  'multi-campaign': {
    title: 'Multi-campaign management requires Agency',
    description: 'Manage campaigns across multiple artists from one dashboard. Upgrade to Agency.',
    requiredTier: 'agency',
    cta: 'Go Agency',
  },
  'white-label': {
    title: 'White-label exports require Agency',
    description: 'Remove SpotifyAdCurator branding from exports for client deliverables. Upgrade to Agency.',
    requiredTier: 'agency',
    cta: 'Go Agency',
  },
  'api': {
    title: 'API access requires Agency',
    description: 'Integrate SpotifyAdCurator directly into your workflow via API. Upgrade to Agency.',
    requiredTier: 'agency',
    cta: 'Go Agency',
  },
  'team': {
    title: 'Team seats require Agency',
    description: 'Invite up to 5 team members to collaborate on campaigns. Upgrade to Agency.',
    requiredTier: 'agency',
    cta: 'Go Agency',
  },
};

export function getUpgradeMessage(feature: GatedFeature): UpgradeMessage {
  return UPGRADE_MESSAGES[feature];
}
