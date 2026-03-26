// ===================================================
// Scheduler Engine — Core scheduling logic
// ===================================================

import type {
  CampaignSchedule,
  ScheduleRule,
  ScheduleLog,
  PerformanceThreshold,
  ScheduleAction,
  MetricsSnapshot,
  AdPlatformId,
  LogResult,
} from './types';
import { DEFAULT_THRESHOLDS } from './types';

// ===================================================
// Storage keys
// ===================================================

const SCHEDULES_KEY = 'sac_schedules';
const LOGS_KEY = 'sac_schedule_logs';

// ===================================================
// localStorage helpers
// ===================================================

function loadSchedules(): CampaignSchedule[] {
  try {
    const raw = localStorage.getItem(SCHEDULES_KEY);
    return raw ? (JSON.parse(raw) as CampaignSchedule[]) : [];
  } catch {
    return [];
  }
}

function saveSchedules(schedules: CampaignSchedule[]): void {
  localStorage.setItem(SCHEDULES_KEY, JSON.stringify(schedules));
}

function loadLogs(): ScheduleLog[] {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    return raw ? (JSON.parse(raw) as ScheduleLog[]) : [];
  } catch {
    return [];
  }
}

function saveLogs(logs: ScheduleLog[]): void {
  // Keep at most 200 log entries
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs.slice(0, 200)));
}

// ===================================================
// ID generator
// ===================================================

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

// ===================================================
// Next-run calculation
// ===================================================

/**
 * Given a ScheduleRule, return the next UTC Date when the schedule should run.
 * For simplicity all times are treated as UTC.
 */
export function getNextRunTime(rule: ScheduleRule, from: Date = new Date()): Date {
  const { frequency, dayOfWeek, dayOfMonth, hour, minute } = rule;

  const candidate = new Date(from);
  candidate.setUTCSeconds(0, 0);
  candidate.setUTCHours(hour, minute);

  const advanceByDays = (d: Date, days: number) => {
    d.setUTCDate(d.getUTCDate() + days);
  };

  switch (frequency) {
    case 'daily': {
      // If the time has already passed today, schedule for tomorrow
      if (candidate <= from) advanceByDays(candidate, 1);
      break;
    }

    case 'weekly': {
      const targetDay = dayOfWeek ?? 1; // default Monday
      const currentDay = candidate.getUTCDay();
      let daysUntil = (targetDay - currentDay + 7) % 7;
      if (daysUntil === 0 && candidate <= from) daysUntil = 7;
      advanceByDays(candidate, daysUntil);
      break;
    }

    case 'biweekly': {
      // Like weekly but add 14 days if already passed this week
      const targetDay2 = dayOfWeek ?? 1;
      const currentDay2 = candidate.getUTCDay();
      let daysUntil2 = (targetDay2 - currentDay2 + 7) % 7;
      if (daysUntil2 === 0 && candidate <= from) daysUntil2 = 14;
      else if (daysUntil2 !== 0 && daysUntil2 < 7) {
        // Use nearest upcoming occurrence; biweekly = every 2 weeks
        // no adjustment needed for first occurrence
      }
      advanceByDays(candidate, daysUntil2);
      break;
    }

    case 'monthly': {
      const dom = dayOfMonth ?? 1;
      candidate.setUTCDate(dom);
      if (candidate <= from) {
        // Move to next month
        candidate.setUTCMonth(candidate.getUTCMonth() + 1);
        candidate.setUTCDate(dom);
      }
      break;
    }
  }

  return candidate;
}

// ===================================================
// Performance evaluation
// ===================================================

export interface EvaluationResult {
  shouldPause: boolean;
  shouldBoost: boolean;
  reason: string;
}

/**
 * Evaluate campaign metrics against thresholds.
 */
export function evaluatePerformance(
  metrics: MetricsSnapshot,
  thresholds: PerformanceThreshold = DEFAULT_THRESHOLDS
): EvaluationResult {
  if (metrics.impressions < thresholds.minImpressions) {
    return {
      shouldPause: false,
      shouldBoost: false,
      reason: `Only ${metrics.impressions.toLocaleString()} impressions — needs ${thresholds.minImpressions.toLocaleString()} before evaluation`,
    };
  }

  if (metrics.ctr < thresholds.minCTR) {
    return {
      shouldPause: true,
      shouldBoost: false,
      reason: `CTR ${metrics.ctr.toFixed(2)}% is below the ${thresholds.minCTR}% threshold`,
    };
  }

  if (metrics.roas < thresholds.minROAS) {
    return {
      shouldPause: true,
      shouldBoost: false,
      reason: `ROAS ${metrics.roas.toFixed(2)}x is below the ${thresholds.minROAS}x minimum`,
    };
  }

  if (metrics.roas >= thresholds.boostROASTarget) {
    return {
      shouldPause: false,
      shouldBoost: true,
      reason: `ROAS ${metrics.roas.toFixed(2)}x exceeds boost target of ${thresholds.boostROASTarget}x`,
    };
  }

  return {
    shouldPause: false,
    shouldBoost: false,
    reason: 'Performance within acceptable range',
  };
}

// ===================================================
// Simulated action execution (demo mode)
// ===================================================

const ACTION_MESSAGES: Record<ScheduleAction, string[]> = {
  refresh_copy: [
    'Generated 12 new ad copy variants across selected platforms',
    'AI refreshed headlines and descriptions for 8 campaigns',
    'Created 15 new copy variants with improved CTAs',
  ],
  pause_losers: [
    'Paused 2 underperforming campaigns (CTR below 0.5%)',
    'Paused 1 campaign with ROAS below threshold',
    'No campaigns met pause criteria — all performing well',
  ],
  boost_winners: [
    'Increased budget 20% for 3 high-ROAS campaigns',
    'Boosted budget for TikTok campaign (ROAS 4.2x)',
    'No campaigns exceeded boost threshold this period',
  ],
  update_targeting: [
    'Refreshed audience segments based on 30-day engagement data',
    'Updated lookalike audiences for Meta and TikTok',
    'Expanded targeting to 2 new interest categories',
  ],
  full_refresh: [
    'Rebuilt 3 campaigns with fresh analysis and new copy',
    'Full refresh complete — 18 new creative assets generated',
    'Campaign rebuild complete — targeting and copy updated',
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function simulateMetricsImprovement(before: MetricsSnapshot): MetricsSnapshot {
  const ctrImprove = 1 + (Math.random() * 0.3);       // +0% to +30%
  const roasImprove = 1 + (Math.random() * 0.25);      // +0% to +25%
  const conversionImprove = 1 + (Math.random() * 0.2); // +0% to +20%

  return {
    impressions: Math.round(before.impressions * (1 + Math.random() * 0.1)),
    clicks: Math.round(before.clicks * ctrImprove),
    ctr: parseFloat((before.ctr * ctrImprove).toFixed(2)),
    spend: parseFloat((before.spend * (1 + Math.random() * 0.15)).toFixed(2)),
    roas: parseFloat((before.roas * roasImprove).toFixed(2)),
    conversions: Math.round(before.conversions * conversionImprove),
  };
}

function buildBeforeSnapshot(platforms: AdPlatformId[]): MetricsSnapshot {
  const count = Math.max(1, platforms.length);
  return {
    impressions: Math.round((180_000 + Math.random() * 120_000) * count),
    clicks: Math.round((3_000 + Math.random() * 4_000) * count),
    ctr: parseFloat((1.2 + Math.random() * 1.5).toFixed(2)),
    spend: parseFloat((1_200 + Math.random() * 800).toFixed(2)),
    roas: parseFloat((2.5 + Math.random() * 2).toFixed(2)),
    conversions: Math.round((1_500 + Math.random() * 2_000) * count),
  };
}

/**
 * Execute a scheduled action in demo mode (simulates results).
 * Creates an execution log entry and updates the schedule's lastRunAt.
 */
export function executeScheduledAction(schedule: CampaignSchedule): ScheduleLog {
  const now = new Date();
  const before = buildBeforeSnapshot(schedule.platforms);
  const after = simulateMetricsImprovement(before);
  const messages = ACTION_MESSAGES[schedule.action];
  const shouldSucceed = Math.random() > 0.05; // 95% success rate

  const result: LogResult = shouldSucceed ? 'success' : 'failure';
  const message = shouldSucceed
    ? pickRandom(messages)
    : `Action failed: API rate limit exceeded. Will retry on next scheduled run.`;

  const log: ScheduleLog = {
    id: generateId(),
    scheduleId: schedule.id,
    scheduleName: schedule.name,
    action: schedule.action,
    triggeredAt: now.toISOString(),
    completedAt: new Date(now.getTime() + Math.random() * 8_000 + 2_000).toISOString(),
    result,
    message,
    metricsBeforeSnapshot: before,
    metricsAfterSnapshot: after,
    affectedCampaigns: Math.floor(Math.random() * 5) + 1,
    platforms: schedule.platforms,
  };

  // Persist log
  const logs = loadLogs();
  saveLogs([log, ...logs]);

  // Update schedule
  const updated: CampaignSchedule = {
    ...schedule,
    lastRunAt: now.toISOString(),
    nextRunAt: getNextRunTime(schedule.rule, now).toISOString(),
    runCount: schedule.runCount + 1,
    updatedAt: now.toISOString(),
    status: result === 'failure' ? 'failed' : 'active',
  };
  updateScheduleInStorage(updated);

  return log;
}

// ===================================================
// CRUD operations
// ===================================================

function updateScheduleInStorage(schedule: CampaignSchedule): void {
  const schedules = loadSchedules();
  const idx = schedules.findIndex((s) => s.id === schedule.id);
  if (idx >= 0) {
    schedules[idx] = schedule;
    saveSchedules(schedules);
  }
}

export function createSchedule(
  config: Omit<CampaignSchedule, 'id' | 'createdAt' | 'updatedAt' | 'lastRunAt' | 'nextRunAt' | 'runCount' | 'status'>
): CampaignSchedule {
  const now = new Date().toISOString();
  const schedule: CampaignSchedule = {
    ...config,
    id: generateId(),
    status: 'active',
    createdAt: now,
    updatedAt: now,
    lastRunAt: null,
    nextRunAt: getNextRunTime(config.rule).toISOString(),
    runCount: 0,
  };
  const schedules = loadSchedules();
  saveSchedules([schedule, ...schedules]);
  return schedule;
}

export function updateSchedule(
  id: string,
  updates: Partial<Omit<CampaignSchedule, 'id' | 'createdAt'>>
): CampaignSchedule | null {
  const schedules = loadSchedules();
  const idx = schedules.findIndex((s) => s.id === id);
  if (idx < 0) return null;

  const updated: CampaignSchedule = {
    ...schedules[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
    nextRunAt: updates.rule
      ? getNextRunTime(updates.rule).toISOString()
      : schedules[idx].nextRunAt,
  };
  schedules[idx] = updated;
  saveSchedules(schedules);
  return updated;
}

export function pauseSchedule(id: string): CampaignSchedule | null {
  return updateSchedule(id, { status: 'paused' });
}

export function resumeSchedule(id: string): CampaignSchedule | null {
  const schedules = loadSchedules();
  const schedule = schedules.find((s) => s.id === id);
  if (!schedule) return null;
  return updateSchedule(id, {
    status: 'active',
    nextRunAt: getNextRunTime(schedule.rule).toISOString(),
  });
}

export function deleteSchedule(id: string): boolean {
  const schedules = loadSchedules();
  const filtered = schedules.filter((s) => s.id !== id);
  if (filtered.length === schedules.length) return false;
  saveSchedules(filtered);
  return true;
}

export function getAllSchedules(): CampaignSchedule[] {
  return loadSchedules();
}

export function getAllLogs(): ScheduleLog[] {
  return loadLogs();
}

export function clearLogs(): void {
  saveLogs([]);
}

export function seedSchedules(schedules: CampaignSchedule[]): void {
  const existing = loadSchedules();
  if (existing.length === 0) {
    saveSchedules(schedules);
  }
}

export function seedLogs(logs: ScheduleLog[]): void {
  const existing = loadLogs();
  if (existing.length === 0) {
    saveLogs(logs);
  }
}
