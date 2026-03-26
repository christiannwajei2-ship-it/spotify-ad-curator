// ===================================================
// Scheduler Auto-Optimization Rules
// ===================================================

import type { MetricsSnapshot, PerformanceThreshold, ScheduleAction } from './types';
import { DEFAULT_THRESHOLDS } from './types';

// ===================================================
// Rule definition
// ===================================================

export interface OptimizationRule {
  id: string;
  action: ScheduleAction;
  name: string;
  description: string;
  example: string;
  icon: string;
  /** Cooldown in hours before the rule can trigger again */
  cooldownHours: number;
  /** Check whether this rule's condition is met */
  check: (metrics: MetricsSnapshot, thresholds: PerformanceThreshold) => boolean;
  /** Human-readable description of what the action will do */
  actionSummary: (metrics: MetricsSnapshot, thresholds: PerformanceThreshold) => string;
}

// ===================================================
// Rules
// ===================================================

export const OPTIMIZATION_RULES: OptimizationRule[] = [
  // ── Pause Losers ────────────────────────────────
  {
    id: 'pause-losers',
    action: 'pause_losers',
    name: 'Pause Underperformers',
    description:
      'Automatically pause campaigns whose CTR falls below 0.5% after at least 1,000 impressions, preventing wasted spend.',
    example:
      'A Meta campaign has 2,400 impressions but only a 0.3% CTR — it gets paused until you refresh the creative.',
    icon: '⏸️',
    cooldownHours: 24,
    check: (metrics, thresholds) =>
      metrics.impressions >= thresholds.minImpressions &&
      metrics.ctr < thresholds.minCTR,
    actionSummary: (metrics, thresholds) =>
      `Pause campaign — CTR is ${metrics.ctr.toFixed(2)}% (threshold: ${thresholds.minCTR}%)`,
  },

  // ── Boost Winners ────────────────────────────────
  {
    id: 'boost-winners',
    action: 'boost_winners',
    name: 'Boost Top Performers',
    description:
      'Increase daily budget by 20% for campaigns with ROAS above 3× to capitalise on high-performing creative while it lasts.',
    example:
      'Your TikTok campaign achieves a 4.2× ROAS — budget is bumped from $50/day to $60/day automatically.',
    icon: '🚀',
    cooldownHours: 48,
    check: (metrics, thresholds) =>
      metrics.roas >= thresholds.boostROASTarget,
    actionSummary: (metrics, thresholds) =>
      `Boost budget 20% — ROAS is ${metrics.roas.toFixed(2)}x (target: ${thresholds.boostROASTarget}x)`,
  },

  // ── Refresh Copy ─────────────────────────────────
  {
    id: 'refresh-copy',
    action: 'refresh_copy',
    name: 'Weekly Copy Refresh',
    description:
      'Regenerate ad headlines, descriptions, and CTAs weekly using the AI Copy Generator to fight creative fatigue.',
    example:
      'Every Monday at 9 AM, fresh copy variants are generated for all active Meta and TikTok campaigns.',
    icon: '✍️',
    cooldownHours: 168, // 7 days
    check: () => true, // Always runs on schedule
    actionSummary: () => 'Regenerate all ad copy variants using AI',
  },

  // ── Update Targeting ──────────────────────────────
  {
    id: 'update-targeting',
    action: 'update_targeting',
    name: 'Bi-Weekly Targeting Update',
    description:
      'Refresh audience segments and lookalike audiences every two weeks based on the latest engagement and conversion data.',
    example:
      'After 14 days of data, the system discovers fans of Afrobeats convert 2× better — targeting is updated accordingly.',
    icon: '🎯',
    cooldownHours: 336, // 14 days
    check: () => true,
    actionSummary: () =>
      'Update audience segments and lookalike audiences based on performance data',
  },

  // ── Full Refresh ─────────────────────────────────
  {
    id: 'full-refresh',
    action: 'full_refresh',
    name: 'Monthly Full Refresh',
    description:
      'Run a complete campaign rebuild each month — re-analyse the playlist, generate new copy, refresh targeting, and restructure ad sets for peak performance.',
    example:
      'On the 1st of every month, your Afrobeats campaign is rebuilt from scratch with the latest listener trends and fresh AI-generated creative.',
    icon: '🔄',
    cooldownHours: 720, // 30 days
    check: () => true,
    actionSummary: () =>
      'Full campaign rebuild: re-analysis, new copy, updated targeting, restructured ad sets',
  },
];

// ===================================================
// Helpers
// ===================================================

/** Return which rules would trigger given current metrics */
export function getActiveRules(
  metrics: MetricsSnapshot,
  thresholds: PerformanceThreshold = DEFAULT_THRESHOLDS
): OptimizationRule[] {
  return OPTIMIZATION_RULES.filter((r) => r.check(metrics, thresholds));
}

/** Lookup a rule by its action */
export function getRuleByAction(action: ScheduleAction): OptimizationRule | undefined {
  return OPTIMIZATION_RULES.find((r) => r.action === action);
}
