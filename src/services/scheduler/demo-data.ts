// ===================================================
// Scheduler Demo Data
// ===================================================

import type { CampaignSchedule, ScheduleLog } from './types';
import { DEFAULT_THRESHOLDS } from './types';

// ===================================================
// Helper
// ===================================================

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}


function daysFromNow(d: number): string {
  return new Date(Date.now() + d * 24 * 60 * 60 * 1000).toISOString();
}

// ===================================================
// Demo Schedules
// ===================================================

export const DEMO_SCHEDULES: CampaignSchedule[] = [
  // 1. Weekly copy refresh — every Monday 9 AM
  {
    id: 'demo-sched-001',
    name: 'Weekly Copy Refresh',
    description: 'Regenerate ad copy every Monday for Meta and TikTok campaigns',
    rule: { frequency: 'weekly', dayOfWeek: 1, hour: 9, minute: 0 },
    platforms: ['meta', 'tiktok'],
    action: 'refresh_copy',
    thresholds: DEFAULT_THRESHOLDS,
    status: 'active',
    createdAt: hoursAgo(14 * 24),
    updatedAt: hoursAgo(7 * 24),
    lastRunAt: hoursAgo(7 * 24 + 2),
    nextRunAt: daysFromNow(2),
    runCount: 6,
  },

  // 2. Bi-weekly performance check — every other Wednesday 8 AM
  {
    id: 'demo-sched-002',
    name: 'Bi-Weekly Performance Check',
    description: 'Pause underperformers and boost winners across all platforms',
    rule: { frequency: 'biweekly', dayOfWeek: 3, hour: 8, minute: 0 },
    platforms: ['meta', 'tiktok', 'youtube', 'google'],
    action: 'pause_losers',
    thresholds: {
      ...DEFAULT_THRESHOLDS,
      minCTR: 0.6,
      boostROASTarget: 3.5,
    },
    status: 'active',
    createdAt: hoursAgo(30 * 24),
    updatedAt: hoursAgo(14 * 24),
    lastRunAt: hoursAgo(14 * 24 + 1),
    nextRunAt: daysFromNow(7),
    runCount: 2,
  },

  // 3. Monthly full refresh — 1st of each month at 6 AM
  {
    id: 'demo-sched-003',
    name: 'Monthly Full Refresh',
    description: 'Complete campaign rebuild with fresh analysis on the 1st of each month',
    rule: { frequency: 'monthly', dayOfMonth: 1, hour: 6, minute: 0 },
    platforms: ['meta', 'tiktok', 'youtube'],
    action: 'full_refresh',
    thresholds: DEFAULT_THRESHOLDS,
    status: 'active',
    createdAt: hoursAgo(60 * 24),
    updatedAt: hoursAgo(30 * 24),
    lastRunAt: hoursAgo(30 * 24 + 3),
    nextRunAt: daysFromNow(18),
    runCount: 2,
  },
];

// ===================================================
// Demo Execution Logs
// ===================================================

export const DEMO_LOGS: ScheduleLog[] = [
  // Schedule 1 — latest run
  {
    id: 'demo-log-001',
    scheduleId: 'demo-sched-001',
    scheduleName: 'Weekly Copy Refresh',
    action: 'refresh_copy',
    triggeredAt: hoursAgo(7 * 24 + 2),
    completedAt: hoursAgo(7 * 24 + 2 - 0.1),
    result: 'success',
    message: 'Generated 14 new ad copy variants for Meta and TikTok campaigns',
    metricsBeforeSnapshot: {
      impressions: 187_440,
      clicks: 2_811,
      ctr: 1.50,
      spend: 1_248.00,
      roas: 2.8,
      conversions: 1_340,
    },
    metricsAfterSnapshot: {
      impressions: 201_320,
      clicks: 3_622,
      ctr: 1.80,
      spend: 1_390.00,
      roas: 3.4,
      conversions: 1_710,
    },
    affectedCampaigns: 4,
    platforms: ['meta', 'tiktok'],
  },

  // Schedule 1 — previous run
  {
    id: 'demo-log-002',
    scheduleId: 'demo-sched-001',
    scheduleName: 'Weekly Copy Refresh',
    action: 'refresh_copy',
    triggeredAt: hoursAgo(14 * 24 + 2),
    completedAt: hoursAgo(14 * 24 + 2 - 0.08),
    result: 'success',
    message: 'Created 10 new copy variants with improved CTAs',
    metricsBeforeSnapshot: {
      impressions: 142_000,
      clicks: 1_988,
      ctr: 1.40,
      spend: 980.00,
      roas: 2.4,
      conversions: 1_020,
    },
    metricsAfterSnapshot: {
      impressions: 161_000,
      clicks: 2_576,
      ctr: 1.60,
      spend: 1_100.00,
      roas: 2.9,
      conversions: 1_290,
    },
    affectedCampaigns: 3,
    platforms: ['meta', 'tiktok'],
  },

  // Schedule 2 — latest run
  {
    id: 'demo-log-003',
    scheduleId: 'demo-sched-002',
    scheduleName: 'Bi-Weekly Performance Check',
    action: 'pause_losers',
    triggeredAt: hoursAgo(14 * 24 + 1),
    completedAt: hoursAgo(14 * 24 + 1 - 0.05),
    result: 'success',
    message: 'Paused 1 underperforming Google campaign (CTR 0.4%, below 0.6% threshold)',
    metricsBeforeSnapshot: {
      impressions: 412_000,
      clicks: 5_344,
      ctr: 1.30,
      spend: 3_280.00,
      roas: 2.9,
      conversions: 2_860,
    },
    metricsAfterSnapshot: {
      impressions: 352_000,
      clicks: 5_104,
      ctr: 1.45,
      spend: 2_810.00,
      roas: 3.6,
      conversions: 2_660,
    },
    affectedCampaigns: 1,
    platforms: ['google'],
  },

  // Schedule 3 — latest run
  {
    id: 'demo-log-004',
    scheduleId: 'demo-sched-003',
    scheduleName: 'Monthly Full Refresh',
    action: 'full_refresh',
    triggeredAt: hoursAgo(30 * 24 + 3),
    completedAt: hoursAgo(30 * 24 + 3 - 0.25),
    result: 'success',
    message: 'Rebuilt 3 campaigns with fresh analysis and 18 new creative assets',
    metricsBeforeSnapshot: {
      impressions: 310_000,
      clicks: 3_720,
      ctr: 1.20,
      spend: 2_600.00,
      roas: 2.5,
      conversions: 1_950,
    },
    metricsAfterSnapshot: {
      impressions: 388_000,
      clicks: 5_432,
      ctr: 1.40,
      spend: 2_920.00,
      roas: 3.3,
      conversions: 2_580,
    },
    affectedCampaigns: 3,
    platforms: ['meta', 'tiktok', 'youtube'],
  },

  // Schedule 1 — failure example
  {
    id: 'demo-log-005',
    scheduleId: 'demo-sched-001',
    scheduleName: 'Weekly Copy Refresh',
    action: 'refresh_copy',
    triggeredAt: hoursAgo(21 * 24 + 2),
    completedAt: hoursAgo(21 * 24 + 2),
    result: 'failure',
    message: 'Action failed: AI copy service temporarily unavailable. Retried automatically on the next run.',
    affectedCampaigns: 0,
    platforms: ['meta', 'tiktok'],
  },

  // Schedule 2 — skipped (no losers)
  {
    id: 'demo-log-006',
    scheduleId: 'demo-sched-002',
    scheduleName: 'Bi-Weekly Performance Check',
    action: 'pause_losers',
    triggeredAt: hoursAgo(28 * 24 + 1),
    completedAt: hoursAgo(28 * 24 + 1),
    result: 'skipped',
    message: 'No campaigns met the pause criteria — all platforms performing above threshold',
    affectedCampaigns: 0,
    platforms: ['meta', 'tiktok', 'youtube', 'google'],
  },

  // Schedule 1 — older run
  {
    id: 'demo-log-007',
    scheduleId: 'demo-sched-001',
    scheduleName: 'Weekly Copy Refresh',
    action: 'refresh_copy',
    triggeredAt: hoursAgo(28 * 24 + 2),
    completedAt: hoursAgo(28 * 24 + 2 - 0.09),
    result: 'success',
    message: 'AI refreshed headlines and descriptions for 8 campaigns',
    metricsBeforeSnapshot: {
      impressions: 95_000,
      clicks: 1_140,
      ctr: 1.20,
      spend: 640.00,
      roas: 2.1,
      conversions: 710,
    },
    metricsAfterSnapshot: {
      impressions: 118_000,
      clicks: 1_534,
      ctr: 1.30,
      spend: 780.00,
      roas: 2.6,
      conversions: 940,
    },
    affectedCampaigns: 5,
    platforms: ['meta', 'tiktok'],
  },
];
