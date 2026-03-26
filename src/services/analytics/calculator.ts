// ===================================================
// Analytics Calculation Engine
// ===================================================

import type {
  PlatformMetrics,
  ROIReport,
  TimePeriod,
  TimeSeriesPoint,
} from './types';
import { INDUSTRY_BENCHMARKS } from './types';

// ===================================================
// Core ROI Calculations
// ===================================================

export function calculateROI(
  spend: number,
  newFollowers: number,
  newStreams: number
): Omit<ROIReport, 'benchmarks' | 'ratings' | 'projections'> {
  const costPerFollower = newFollowers > 0 ? spend / newFollowers : 0;
  const costPerStream = newStreams > 0 ? spend / newStreams : 0;
  // ROAS for music: estimated revenue = followers * $0.01 (streaming rev) + streams * $0.004
  const estimatedRevenue = newFollowers * 0.01 + newStreams * 0.004;
  const roas = spend > 0 ? estimatedRevenue / spend : 0;

  return { adSpend: spend, newFollowers, newStreams, costPerFollower, costPerStream, roas };
}

export function calculateCostPerFollower(spend: number, newFollowers: number): number {
  if (newFollowers <= 0) return 0;
  return spend / newFollowers;
}

export function calculateCostPerStream(spend: number, newStreams: number): number {
  if (newStreams <= 0) return 0;
  return spend / newStreams;
}

// ===================================================
// Full ROI Report
// ===================================================

export function buildROIReport(
  spend: number,
  newFollowers: number,
  newStreams: number,
  campaignDays = 30
): ROIReport {
  const base = calculateROI(spend, newFollowers, newStreams);

  const rateFollower = ratePerformance(base.costPerFollower, INDUSTRY_BENCHMARKS.costPerFollower, 'lower');
  const rateStream   = ratePerformance(base.costPerStream,   INDUSTRY_BENCHMARKS.costPerStream,   'lower');
  const rateRoas     = ratePerformance(base.roas,            INDUSTRY_BENCHMARKS.roas,             'higher');

  const dailyFollowers = campaignDays > 0 ? newFollowers / campaignDays : 0;
  const dailyStreams   = campaignDays > 0 ? newStreams / campaignDays : 0;

  return {
    ...base,
    benchmarks: {
      industryAvgCostPerFollower: INDUSTRY_BENCHMARKS.costPerFollower,
      industryAvgCostPerStream:   INDUSTRY_BENCHMARKS.costPerStream,
      industryAvgRoas:            INDUSTRY_BENCHMARKS.roas,
    },
    ratings: {
      costPerFollower: rateFollower,
      costPerStream:   rateStream,
      roas:            rateRoas,
    },
    projections: {
      followersAt30Days:          Math.round(dailyFollowers * 30),
      streamsAt30Days:            Math.round(dailyStreams * 30),
      estimatedMonthlyListeners:  Math.round(newFollowers * 0.35),
    },
  };
}

type Direction = 'lower' | 'higher';
type Rating = 'excellent' | 'good' | 'average' | 'poor';

function ratePerformance(value: number, benchmark: number, direction: Direction): Rating {
  if (value <= 0) return 'poor';
  const ratio = direction === 'lower' ? benchmark / value : value / benchmark;
  if (ratio >= 1.5) return 'excellent';
  if (ratio >= 1.0) return 'good';
  if (ratio >= 0.7) return 'average';
  return 'poor';
}

// ===================================================
// Platform Comparison
// ===================================================

export function comparePlatforms(
  platforms: PlatformMetrics[]
): PlatformMetrics[] {
  // Rank by ROAS descending, break ties by CTR
  return [...platforms].sort((a, b) => {
    if (b.roas !== a.roas) return b.roas - a.roas;
    return b.ctr - a.ctr;
  });
}

export function getBestPerformerPerMetric(platforms: PlatformMetrics[]): Record<string, string> {
  if (platforms.length === 0) return {};

  const best: Record<string, string> = {};

  const maxBy = (key: keyof PlatformMetrics) =>
    platforms.reduce((prev, curr) => ((curr[key] as number) > (prev[key] as number) ? curr : prev));

  const minBy = (key: keyof PlatformMetrics) =>
    platforms.reduce((prev, curr) => ((curr[key] as number) < (prev[key] as number) ? curr : prev));

  best.roas        = maxBy('roas').platform;
  best.ctr         = maxBy('ctr').platform;
  best.conversions = maxBy('conversions').platform;
  best.cpc         = minBy('cpc').platform; // lower is better
  best.cpm         = minBy('cpm').platform; // lower is better

  return best;
}

// ===================================================
// Growth Projection
// ===================================================

export function projectGrowth(
  currentMetrics: { spend: number; conversions: number; impressions: number },
  days: number
): { projectedConversions: number; projectedImpressions: number; projectedSpend: number } {
  const dailyConversions  = currentMetrics.conversions  / 30;
  const dailyImpressions  = currentMetrics.impressions  / 30;
  const dailySpend        = currentMetrics.spend        / 30;

  return {
    projectedConversions:  Math.round(dailyConversions * days),
    projectedImpressions:  Math.round(dailyImpressions * days),
    projectedSpend:        parseFloat((dailySpend * days).toFixed(2)),
  };
}

// ===================================================
// Time Series Aggregation
// ===================================================

export function aggregateByPeriod(
  points: TimeSeriesPoint[],
  period: TimePeriod
): TimeSeriesPoint[] {
  const cutoffDays: Record<TimePeriod, number> = {
    '7d':  7,
    '30d': 30,
    '90d': 90,
    'all': Infinity,
  };
  const cutoff = cutoffDays[period];
  const now = Date.now();
  return points.filter((p) => {
    const diffDays = (now - new Date(p.date).getTime()) / 86400000;
    return diffDays <= cutoff;
  });
}
