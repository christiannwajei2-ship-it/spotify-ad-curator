// ===================================================
// Analytics Service Types
// ===================================================

export type AdPlatform = 'meta' | 'tiktok' | 'youtube' | 'google';

export type TimePeriod = '7d' | '30d' | '90d' | 'all';

// ===================================================
// Core Metrics
// ===================================================

export interface CampaignMetrics {
  campaignId: string;
  campaignName: string;
  platform: AdPlatform;
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
  ctr: number;         // Click-through rate (%)
  cpc: number;         // Cost per click ($)
  cpm: number;         // Cost per mille ($)
  spend: number;       // Total spend ($)
  conversions: number; // New followers / stream starts
  roas: number;        // Return on ad spend
}

export interface PlatformMetrics {
  platform: AdPlatform;
  label: string;
  icon: string;
  color: string;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  spend: number;
  conversions: number;
  roas: number;
  newFollowers: number;
  newStreams: number;
}

// ===================================================
// Time Series Data
// ===================================================

export interface TimeSeriesPoint {
  date: string;        // ISO date string
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  ctr: number;
}

export interface TimeSeriesData {
  platform: AdPlatform | 'all';
  period: TimePeriod;
  points: TimeSeriesPoint[];
}

// ===================================================
// Dashboard Summary
// ===================================================

export interface AnalyticsSummary {
  totalSpend: number;
  totalReach: number;         // Unique people reached
  totalImpressions: number;
  totalClicks: number;
  avgCtr: number;
  totalConversions: number;
  costPerFollower: number;
  costPerStream: number;
  bestPlatform: AdPlatform;
  bestPlatformLabel: string;
  periodLabel: string;
  // Trend vs previous period
  trends: {
    spend: number;         // % change
    reach: number;
    impressions: number;
    clicks: number;
    ctr: number;
    conversions: number;
  };
}

// ===================================================
// ROI Report
// ===================================================

export interface ROIReport {
  adSpend: number;
  newFollowers: number;
  newStreams: number;
  // Calculated
  costPerFollower: number;
  costPerStream: number;
  roas: number;
  // Benchmark comparisons
  benchmarks: {
    industryAvgCostPerFollower: number;
    industryAvgCostPerStream: number;
    industryAvgRoas: number;
  };
  // Performance ratings
  ratings: {
    costPerFollower: 'excellent' | 'good' | 'average' | 'poor';
    costPerStream: 'excellent' | 'good' | 'average' | 'poor';
    roas: 'excellent' | 'good' | 'average' | 'poor';
  };
  projections: {
    followersAt30Days: number;
    streamsAt30Days: number;
    estimatedMonthlyListeners: number;
  };
}

// ===================================================
// Platform Config
// ===================================================

export const PLATFORM_CONFIG: Record<AdPlatform, { label: string; icon: string; color: string }> = {
  meta:    { label: 'Meta',    icon: '📘', color: '#1877F2' },
  tiktok:  { label: 'TikTok', icon: '📱', color: '#010101' },
  youtube: { label: 'YouTube', icon: '📺', color: '#FF0000' },
  google:  { label: 'Google', icon: '🔍', color: '#4285F4' },
};

// ===================================================
// Industry Benchmarks (music marketing)
// ===================================================

export const INDUSTRY_BENCHMARKS = {
  costPerFollower:    0.75,  // $0.75 avg cost per new follower
  costPerStream:      0.008, // $0.008 avg cost per stream
  roas:               3.2,   // 3.2x avg ROAS
  ctr: {
    meta:    1.8,   // % avg CTR Meta
    tiktok:  2.4,   // % avg CTR TikTok
    youtube: 0.9,   // % avg CTR YouTube
    google:  3.5,   // % avg CTR Google
  },
  cpc: {
    meta:    0.50,
    tiktok:  0.35,
    youtube: 0.65,
    google:  0.80,
  },
};
