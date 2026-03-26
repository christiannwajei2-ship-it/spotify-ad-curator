// ===================================================
// ScheduleCard — Individual schedule display
// ===================================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import type { CampaignSchedule, ScheduleStatus } from '../../services/scheduler/types';
import { SCHEDULE_ACTIONS } from '../../services/scheduler/types';

// ===================================================
// Helpers
// ===================================================

const PLATFORM_ICONS: Record<string, string> = {
  meta: '📘',
  tiktok: '📱',
  youtube: '📺',
  google: '🔍',
};

const FREQUENCY_LABELS: Record<string, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  biweekly: 'Bi-Weekly',
  monthly: 'Monthly',
};

const STATUS_BADGE: Record<ScheduleStatus, { variant: 'green' | 'gray' | 'blue' | 'red' | 'yellow' | 'purple'; label: string }> = {
  active: { variant: 'green', label: 'Active' },
  paused: { variant: 'yellow', label: 'Paused' },
  completed: { variant: 'blue', label: 'Completed' },
  failed: { variant: 'red', label: 'Failed' },
};

/** Format a future date as a relative countdown */
function useCountdown(isoDate: string | null): string {
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (!isoDate) {
      setLabel('—');
      return;
    }

    const update = () => {
      const diff = new Date(isoDate).getTime() - Date.now();
      if (diff <= 0) {
        setLabel('Running now');
        return;
      }
      const days = Math.floor(diff / 86_400_000);
      const hours = Math.floor((diff % 86_400_000) / 3_600_000);
      const mins = Math.floor((diff % 3_600_000) / 60_000);

      if (days > 0) setLabel(`${days}d ${hours}h`);
      else if (hours > 0) setLabel(`${hours}h ${mins}m`);
      else setLabel(`${mins}m`);
    };

    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [isoDate]);

  return label;
}

/** Format a past date as relative time */
function timeAgo(isoDate: string | null): string {
  if (!isoDate) return 'Never';
  const diff = Date.now() - new Date(isoDate).getTime();
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return 'Just now';
}

// ===================================================
// Component
// ===================================================

interface ScheduleCardProps {
  schedule: CampaignSchedule;
  isRunning?: boolean;
  onToggle: (id: string) => void;
  onRunNow: (id: string) => void;
  onEdit: (schedule: CampaignSchedule) => void;
  onDelete: (id: string) => void;
}

export const ScheduleCard = ({
  schedule,
  isRunning,
  onToggle,
  onRunNow,
  onEdit,
  onDelete,
}: ScheduleCardProps) => {
  const countdown = useCountdown(schedule.nextRunAt);
  const actionConfig = SCHEDULE_ACTIONS.find((a) => a.type === schedule.action);
  const status = STATUS_BADGE[schedule.status];

  return (
    <Card elevated className="p-5">
      <div className="flex items-start justify-between gap-4">
        {/* Left: info */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-lg">{actionConfig?.icon ?? '⏰'}</span>
            <h3 className="text-white font-semibold text-sm truncate">{schedule.name}</h3>
            <Badge variant={status.variant}>{status.label}</Badge>
            <Badge variant="gray">{FREQUENCY_LABELS[schedule.rule.frequency]}</Badge>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-xs mb-3 line-clamp-2">{schedule.description}</p>

          {/* Platforms */}
          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
            {schedule.platforms.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface-elevated border border-surface-border rounded-full text-xs text-gray-300"
              >
                {PLATFORM_ICONS[p]} {p.charAt(0).toUpperCase() + p.slice(1)}
              </span>
            ))}
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
            <span>🕐 Next run: <span className="text-gray-300 font-medium">{countdown}</span></span>
            <span>⏱ Last run: <span className="text-gray-300">{timeAgo(schedule.lastRunAt)}</span></span>
            <span>🔢 Runs: <span className="text-gray-300">{schedule.runCount}</span></span>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex flex-col gap-2 shrink-0">
          {/* Toggle */}
          <button
            onClick={() => onToggle(schedule.id)}
            className={clsx(
              'relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none',
              schedule.status === 'active' ? 'bg-brand-600' : 'bg-gray-700'
            )}
            aria-label={schedule.status === 'active' ? 'Pause schedule' : 'Resume schedule'}
          >
            <span
              className={clsx(
                'inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200',
                schedule.status === 'active' ? 'translate-x-4' : 'translate-x-1'
              )}
            />
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-surface-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRunNow(schedule.id)}
          disabled={isRunning || schedule.status !== 'active'}
          className="flex items-center gap-1.5 text-xs"
        >
          {isRunning ? (
            <>
              <span className="inline-block w-3 h-3 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
              Running…
            </>
          ) : (
            <>▶ Run Now</>
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(schedule)}
          className="text-xs"
        >
          ✏️ Edit
        </Button>
        <button
          onClick={() => onDelete(schedule.id)}
          className="ml-auto text-xs text-red-400 hover:text-red-300 transition-colors duration-150 px-2 py-1 rounded hover:bg-red-900/20"
        >
          🗑 Delete
        </button>
      </div>

      {/* Running overlay */}
      {isRunning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-surface/60 rounded-2xl flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-3 border-brand-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-brand-300 text-xs font-medium">Executing…</p>
          </div>
        </motion.div>
      )}
    </Card>
  );
};
