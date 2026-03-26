// ===================================================
// useScheduler — Custom hook for Auto-Refresh Scheduler
// ===================================================

import { useState, useCallback, useEffect } from 'react';
import type { CampaignSchedule, ScheduleLog, ScheduleRule, ScheduleAction, AdPlatformId, PerformanceThreshold } from '../services/scheduler/types';
import { DEFAULT_THRESHOLDS } from '../services/scheduler/types';
import {
  getAllSchedules,
  getAllLogs,
  createSchedule as engineCreate,
  updateSchedule as engineUpdate,
  pauseSchedule as enginePause,
  resumeSchedule as engineResume,
  deleteSchedule as engineDelete,
  executeScheduledAction,
  seedSchedules,
  seedLogs,
} from '../services/scheduler/engine';
import { DEMO_SCHEDULES, DEMO_LOGS } from '../services/scheduler/demo-data';
import { useAppStore } from '../store';

// ===================================================
// New-schedule form shape
// ===================================================

export interface NewScheduleForm {
  name: string;
  description: string;
  rule: ScheduleRule;
  platforms: AdPlatformId[];
  action: ScheduleAction;
  thresholds: PerformanceThreshold;
}

// ===================================================
// Hook
// ===================================================

export const useScheduler = () => {
  const { isDemoMode } = useAppStore();

  const [schedules, setSchedules] = useState<CampaignSchedule[]>([]);
  const [executionHistory, setExecutionHistory] = useState<ScheduleLog[]>([]);
  const [isRunning, setIsRunning] = useState<string | null>(null); // scheduleId being run

  // ── Seed demo data on first load ─────────────────

  useEffect(() => {
    if (isDemoMode) {
      seedSchedules(DEMO_SCHEDULES);
      seedLogs(DEMO_LOGS);
    }
    setSchedules(getAllSchedules());
    setExecutionHistory(getAllLogs());
  }, [isDemoMode]);

  // ── Refresh helpers ───────────────────────────────

  const refreshAll = useCallback(() => {
    setSchedules(getAllSchedules());
    setExecutionHistory(getAllLogs());
  }, []);

  // ── CRUD operations ───────────────────────────────

  const createSchedule = useCallback(
    (form: NewScheduleForm): CampaignSchedule => {
      const created = engineCreate(form);
      refreshAll();
      return created;
    },
    [refreshAll]
  );

  const updateSchedule = useCallback(
    (id: string, updates: Partial<Omit<CampaignSchedule, 'id' | 'createdAt'>>): void => {
      engineUpdate(id, updates);
      refreshAll();
    },
    [refreshAll]
  );

  const toggleSchedule = useCallback(
    (id: string): void => {
      const schedule = schedules.find((s) => s.id === id);
      if (!schedule) return;
      if (schedule.status === 'active') {
        enginePause(id);
      } else {
        engineResume(id);
      }
      refreshAll();
    },
    [schedules, refreshAll]
  );

  const deleteSchedule = useCallback(
    (id: string): void => {
      engineDelete(id);
      refreshAll();
    },
    [refreshAll]
  );

  // ── Run now (simulate immediate execution) ────────

  const runNow = useCallback(
    async (id: string): Promise<ScheduleLog | null> => {
      const schedule = schedules.find((s) => s.id === id);
      if (!schedule) return null;

      setIsRunning(id);
      // Simulate async execution (demo mode)
      await new Promise((resolve) => setTimeout(resolve, 1_500 + Math.random() * 1_000));

      const log = executeScheduledAction(schedule);
      refreshAll();
      setIsRunning(null);
      return log;
    },
    [schedules, refreshAll]
  );

  // ── Derived stats ──────────────────────────────────

  const activeCount = schedules.filter((s) => s.status === 'active').length;
  const pausedCount = schedules.filter((s) => s.status === 'paused').length;

  const nextSchedule = schedules
    .filter((s) => s.status === 'active' && s.nextRunAt != null)
    .sort((a, b) => new Date(a.nextRunAt!).getTime() - new Date(b.nextRunAt!).getTime())[0] ?? null;

  return {
    // Data
    schedules,
    executionHistory,
    // Counts
    activeCount,
    pausedCount,
    nextSchedule,
    // Loading state
    isRunning,
    // Operations
    createSchedule,
    updateSchedule,
    toggleSchedule,
    deleteSchedule,
    runNow,
    refresh: refreshAll,
    // Defaults
    defaultThresholds: DEFAULT_THRESHOLDS,
  };
};
