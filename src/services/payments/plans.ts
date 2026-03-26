// ===================================================
// Payments Service — Pricing Plan Definitions
// ===================================================

import type { SubscriptionPlan, PlanFeature } from './types';

// ===================================================
// Plan definitions
// ===================================================

export const PLANS: Record<string, SubscriptionPlan> = {
  free: {
    id: 'free',
    tier: 'free',
    name: 'Free',
    description: 'Perfect for getting started with music ad campaigns',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      '1 playlist analysis per day',
      'Meta Ads only',
      '3 AI copy generations / month',
      'Basic analytics (7-day view)',
      'Community support',
    ],
    limits: {
      analysesPerDay: 1,
      platforms: ['meta'],
      aiCopyGenerationsPerMonth: 3,
      canExport: false,
      exportFormats: [],
      analyticsWindowDays: 7,
      canUseAppleMusic: false,
      canManageMultipleCampaigns: false,
      canWhiteLabel: false,
      canAccessApi: false,
      teamSeats: 1,
    },
    color: 'gray',
    icon: '🎵',
  },

  pro: {
    id: 'pro',
    tier: 'pro',
    name: 'Pro',
    description: 'Everything you need to grow your music with paid ads',
    monthlyPrice: 19,
    yearlyPrice: 190,
    stripePriceIdMonthly: 'price_pro_monthly',
    stripePriceIdYearly: 'price_pro_yearly',
    features: [
      'Unlimited playlist analyses',
      'All platforms (Meta, TikTok, YouTube, Google)',
      'Unlimited AI copy generations',
      'Full analytics (90-day view)',
      'CSV & JSON export',
      'Apple Music support',
      'Priority support',
    ],
    limits: {
      analysesPerDay: null,
      platforms: ['meta', 'tiktok', 'youtube', 'google-search', 'google-display'],
      aiCopyGenerationsPerMonth: null,
      canExport: true,
      exportFormats: ['csv', 'json'],
      analyticsWindowDays: 90,
      canUseAppleMusic: true,
      canManageMultipleCampaigns: false,
      canWhiteLabel: false,
      canAccessApi: false,
      teamSeats: 1,
    },
    badge: 'Most Popular',
    color: 'brand',
    icon: '⭐',
  },

  agency: {
    id: 'agency',
    tier: 'agency',
    name: 'Agency',
    description: 'Built for teams managing multiple artists and campaigns',
    monthlyPrice: 49,
    yearlyPrice: 490,
    stripePriceIdMonthly: 'price_agency_monthly',
    stripePriceIdYearly: 'price_agency_yearly',
    features: [
      'Everything in Pro',
      'Multi-campaign management',
      'White-label exports (no branding)',
      'API access',
      'Custom ad templates',
      'Team collaboration (up to 5 seats)',
      'Dedicated support',
    ],
    limits: {
      analysesPerDay: null,
      platforms: ['meta', 'tiktok', 'youtube', 'google-search', 'google-display'],
      aiCopyGenerationsPerMonth: null,
      canExport: true,
      exportFormats: ['csv', 'json', 'white-label'],
      analyticsWindowDays: 90,
      canUseAppleMusic: true,
      canManageMultipleCampaigns: true,
      canWhiteLabel: true,
      canAccessApi: true,
      teamSeats: 5,
    },
    color: 'yellow',
    icon: '🏢',
  },
};

export const PLAN_LIST: SubscriptionPlan[] = [PLANS.free, PLANS.pro, PLANS.agency];

// ===================================================
// Feature comparison rows
// ===================================================

export const PLAN_FEATURES: PlanFeature[] = [
  {
    id: 'analyses',
    label: 'Playlist analyses',
    free: '1 per day',
    pro: 'Unlimited',
    agency: 'Unlimited',
  },
  {
    id: 'platforms',
    label: 'Ad platforms',
    free: 'Meta only',
    pro: 'All platforms',
    agency: 'All platforms',
  },
  {
    id: 'ai-copy',
    label: 'AI copy generations',
    free: '3 per month',
    pro: 'Unlimited',
    agency: 'Unlimited',
  },
  {
    id: 'analytics',
    label: 'Analytics window',
    free: '7 days',
    pro: '90 days',
    agency: '90 days',
  },
  {
    id: 'export',
    label: 'Export reports',
    free: false,
    pro: 'CSV & JSON',
    agency: 'CSV, JSON & White-label',
  },
  {
    id: 'apple-music',
    label: 'Apple Music support',
    free: false,
    pro: true,
    agency: true,
  },
  {
    id: 'multi-campaign',
    label: 'Multi-campaign management',
    free: false,
    pro: false,
    agency: true,
  },
  {
    id: 'white-label',
    label: 'White-label exports',
    free: false,
    pro: false,
    agency: true,
  },
  {
    id: 'api',
    label: 'API access',
    free: false,
    pro: false,
    agency: true,
  },
  {
    id: 'team',
    label: 'Team seats',
    free: '1',
    pro: '1',
    agency: 'Up to 5',
  },
  {
    id: 'support',
    label: 'Support',
    free: 'Community',
    pro: 'Priority',
    agency: 'Dedicated',
  },
];

// ===================================================
// Savings calculation
// ===================================================

export const getYearlySavings = (plan: SubscriptionPlan): number => {
  if (plan.monthlyPrice === 0) return 0;
  const annualIfMonthly = plan.monthlyPrice * 12;
  return annualIfMonthly - plan.yearlyPrice;
};

export const getYearlySavingsPercent = (plan: SubscriptionPlan): number => {
  if (plan.monthlyPrice === 0) return 0;
  const savings = getYearlySavings(plan);
  const annualIfMonthly = plan.monthlyPrice * 12;
  return Math.round((savings / annualIfMonthly) * 100);
};
