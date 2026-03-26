// ===================================================
// Analytics Demo Data — Realistic 30-day campaign
// ===================================================

import type { PlatformMetrics, TimeSeriesPoint, TimeSeriesData, AnalyticsSummary } from './types';

// ===================================================
// Helper: generate a date string N days ago
// ===================================================

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

// ===================================================
// Platform Metrics — 30-day Afrobeats campaign
// ===================================================

export const DEMO_PLATFORM_METRICS: PlatformMetrics[] = [
  {
    platform:     'meta',
    label:        'Meta',
    icon:         '📘',
    color:        '#1877F2',
    impressions:  184_320,
    clicks:       3_312,
    ctr:          1.80,
    cpc:          0.48,
    cpm:          8.62,
    spend:        1_590.00,
    conversions:  2_148,
    roas:         3.8,
    newFollowers: 1_842,
    newStreams:   38_640,
  },
  {
    platform:     'tiktok',
    label:        'TikTok',
    icon:         '📱',
    color:        '#010101',
    impressions:  312_800,
    clicks:       7_507,
    ctr:          2.40,
    cpc:          0.32,
    cpm:          7.69,
    spend:        2_402.00,
    conversions:  3_218,
    roas:         4.2,
    newFollowers: 2_754,
    newStreams:   62_480,
  },
  {
    platform:     'youtube',
    label:        'YouTube',
    icon:         '📺',
    color:        '#FF0000',
    impressions:  97_650,
    clicks:       879,
    ctr:          0.90,
    cpc:          0.61,
    cpm:          5.39,
    spend:        526.00,
    conversions:  712,
    roas:         2.9,
    newFollowers: 598,
    newStreams:   14_240,
  },
  {
    platform:     'google',
    label:        'Google',
    icon:         '🔍',
    color:        '#4285F4',
    impressions:  68_400,
    clicks:       2_394,
    ctr:          3.50,
    cpc:          0.77,
    cpm:          26.88,
    spend:        1_840.00,
    conversions:  1_134,
    roas:         2.4,
    newFollowers: 876,
    newStreams:   22_680,
  },
];

// ===================================================
// Time Series — 30 daily data points across all platforms
// ===================================================

const RAW_DAILY: Array<{ impressions: number; clicks: number; spend: number; conversions: number }> = [
  { impressions: 18_420, clicks: 368, spend: 195.60, conversions: 194 },
  { impressions: 19_840, clicks: 397, spend: 211.00, conversions: 210 },
  { impressions: 17_300, clicks: 346, spend: 184.20, conversions: 182 },
  { impressions: 21_560, clicks: 431, spend: 228.70, conversions: 228 },
  { impressions: 23_100, clicks: 462, spend: 245.00, conversions: 244 },
  { impressions: 26_840, clicks: 537, spend: 284.90, conversions: 284 },
  { impressions: 28_900, clicks: 578, spend: 306.60, conversions: 306 },
  { impressions: 22_300, clicks: 446, spend: 236.40, conversions: 236 },
  { impressions: 20_740, clicks: 415, spend: 220.00, conversions: 219 },
  { impressions: 19_820, clicks: 396, spend: 210.30, conversions: 209 },
  { impressions: 21_050, clicks: 421, spend: 222.80, conversions: 222 },
  { impressions: 22_460, clicks: 449, spend: 238.00, conversions: 237 },
  { impressions: 24_370, clicks: 487, spend: 258.30, conversions: 258 },
  { impressions: 27_910, clicks: 558, spend: 295.80, conversions: 295 },
  { impressions: 30_440, clicks: 609, spend: 322.70, conversions: 322 },
  { impressions: 25_600, clicks: 512, spend: 271.40, conversions: 270 },
  { impressions: 23_200, clicks: 464, spend: 245.70, conversions: 245 },
  { impressions: 21_890, clicks: 438, spend: 231.80, conversions: 231 },
  { impressions: 22_700, clicks: 454, spend: 240.30, conversions: 240 },
  { impressions: 24_100, clicks: 482, spend: 255.30, conversions: 255 },
  { impressions: 26_540, clicks: 531, spend: 281.10, conversions: 281 },
  { impressions: 29_820, clicks: 596, spend: 316.00, conversions: 316 },
  { impressions: 32_680, clicks: 654, spend: 346.00, conversions: 346 },
  { impressions: 28_400, clicks: 568, spend: 300.80, conversions: 301 },
  { impressions: 26_700, clicks: 534, spend: 282.80, conversions: 283 },
  { impressions: 25_300, clicks: 506, spend: 268.20, conversions: 267 },
  { impressions: 24_800, clicks: 496, spend: 262.60, conversions: 262 },
  { impressions: 26_200, clicks: 524, spend: 277.50, conversions: 277 },
  { impressions: 28_800, clicks: 576, spend: 305.20, conversions: 305 },
  { impressions: 32_400, clicks: 648, spend: 343.00, conversions: 343 },
];

export const DEMO_TIME_SERIES: TimeSeriesData = {
  platform: 'all',
  period:   '30d',
  points:   RAW_DAILY.map((d, i) => ({
    date:        daysAgo(29 - i),
    impressions: d.impressions,
    clicks:      d.clicks,
    spend:       d.spend,
    conversions: d.conversions,
    ctr:         parseFloat(((d.clicks / d.impressions) * 100).toFixed(2)),
  })),
};

// ===================================================
// Analytics Summary — all platforms combined
// ===================================================

export const DEMO_ANALYTICS_SUMMARY: AnalyticsSummary = {
  totalSpend:        6_358.00,
  totalReach:        498_240,
  totalImpressions:  663_170,
  totalClicks:       14_092,
  avgCtr:            2.12,
  totalConversions:  7_212,
  costPerFollower:   0.54,
  costPerStream:     0.0046,
  bestPlatform:      'tiktok',
  bestPlatformLabel: 'TikTok',
  periodLabel:       'Last 30 Days',
  trends: {
    spend:       12.4,
    reach:       18.6,
    impressions: 15.3,
    clicks:      21.8,
    ctr:         5.2,
    conversions: 24.1,
  },
};

// ===================================================
// Per-platform time series (last 30 days)
// ===================================================

function makeSeriesForPlatform(
  platformShare: number,
  points: TimeSeriesPoint[]
): TimeSeriesData['points'] {
  return points.map((p) => ({
    ...p,
    impressions: Math.round(p.impressions * platformShare),
    clicks:      Math.round(p.clicks      * platformShare),
    spend:       parseFloat((p.spend * platformShare).toFixed(2)),
    conversions: Math.round(p.conversions * platformShare),
    ctr:         parseFloat(((Math.round(p.clicks * platformShare) /
                   Math.round(p.impressions * platformShare)) * 100).toFixed(2)),
  }));
}

export const DEMO_PLATFORM_SERIES: Record<string, TimeSeriesData> = {
  meta: {
    platform: 'meta',
    period:   '30d',
    points:   makeSeriesForPlatform(0.278, DEMO_TIME_SERIES.points),
  },
  tiktok: {
    platform: 'tiktok',
    period:   '30d',
    points:   makeSeriesForPlatform(0.472, DEMO_TIME_SERIES.points),
  },
  youtube: {
    platform: 'youtube',
    period:   '30d',
    points:   makeSeriesForPlatform(0.147, DEMO_TIME_SERIES.points),
  },
  google: {
    platform: 'google',
    period:   '30d',
    points:   makeSeriesForPlatform(0.103, DEMO_TIME_SERIES.points),
  },
};
