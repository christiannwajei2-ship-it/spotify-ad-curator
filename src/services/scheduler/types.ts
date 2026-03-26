// ===================================================
// Scheduler Service Types
// ===================================================

// ===================================================
// Frequency / Timing
// ===================================================

export type ScheduleFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly';

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday

export interface ScheduleRule {
  frequency: ScheduleFrequency;
  dayOfWeek?: DayOfWeek;   // used for weekly / biweekly
  dayOfMonth?: number;     // 1-28, used for monthly
  hour: number;            // 0-23 (UTC)
  minute: number;          // 0-59
}

// ===================================================
// Actions
// ===================================================

export type ScheduleAction =
  | 'refresh_copy'
  | 'pause_losers'
  | 'boost_winners'
  | 'update_targeting'
  | 'full_refresh';

export interface ScheduleActionConfig {
  type: ScheduleAction;
  label: string;
  icon: string;
  description: string;
}

export const SCHEDULE_ACTIONS: ScheduleActionConfig[] = [
  {
    type: 'refresh_copy',
    label: 'Refresh Ad Copy',
    icon: '✍️',
    description: 'Regenerate ad copy using AI for all selected campaigns',
  },
  {
    type: 'pause_losers',
    label: 'Pause Underperformers',
    icon: '⏸️',
    description: 'Auto-pause campaigns that fall below performance thresholds',
  },
  {
    type: 'boost_winners',
    label: 'Boost Top Performers',
    icon: '🚀',
    description: 'Increase budget 20% for campaigns exceeding ROAS targets',
  },
  {
    type: 'update_targeting',
    label: 'Update Targeting',
    icon: '🎯',
    description: 'Refresh audience targeting based on latest performance data',
  },
  {
    type: 'full_refresh',
    label: 'Full Campaign Refresh',
    icon: '🔄',
    description: 'Complete campaign rebuild with fresh analysis and new copy',
  },
];

// ===================================================
// Performance Thresholds
// ===================================================

export interface PerformanceThreshold {
  /** Pause campaigns with CTR below this value (%) */
  minCTR: number;
  /** Pause campaigns with ROAS below this value */
  minROAS: number;
  /** Boost campaigns with ROAS above this value */
  boostROASTarget: number;
  /** Minimum impressions before evaluating (avoids noise) */
  minImpressions: number;
  /** Maximum daily budget cap after boost ($) */
  maxBudgetCap: number;
}

export const DEFAULT_THRESHOLDS: PerformanceThreshold = {
  minCTR: 0.5,
  minROAS: 1.0,
  boostROASTarget: 3.0,
  minImpressions: 1000,
  maxBudgetCap: 500,
};

// ===================================================
// Campaign Schedule
// ===================================================

export type ScheduleStatus = 'active' | 'paused' | 'completed' | 'failed';

export type AdPlatformId = 'meta' | 'tiktok' | 'youtube' | 'google';

export interface CampaignSchedule {
  id: string;
  name: string;
  description: string;
  rule: ScheduleRule;
  platforms: AdPlatformId[];
  action: ScheduleAction;
  thresholds: PerformanceThreshold;
  status: ScheduleStatus;
  createdAt: string;
  updatedAt: string;
  lastRunAt: string | null;
  nextRunAt: string | null;
  runCount: number;
}

// ===================================================
// Execution Log
// ===================================================

export type LogResult = 'success' | 'failure' | 'partial' | 'skipped';

export interface MetricsSnapshot {
  impressions: number;
  clicks: number;
  ctr: number;
  spend: number;
  roas: number;
  conversions: number;
}

export interface ScheduleLog {
  id: string;
  scheduleId: string;
  scheduleName: string;
  action: ScheduleAction;
  triggeredAt: string;
  completedAt: string;
  result: LogResult;
  message: string;
  metricsBeforeSnapshot?: MetricsSnapshot;
  metricsAfterSnapshot?: MetricsSnapshot;
  affectedCampaigns: number;
  platforms: AdPlatformId[];
}
