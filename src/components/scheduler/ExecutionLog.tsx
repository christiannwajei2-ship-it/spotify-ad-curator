// ===================================================
// ExecutionLog — Schedule execution history
// ===================================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Card, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { ScheduleLog, LogResult, ScheduleAction } from '../../services/scheduler/types';

// ===================================================
// Helpers
// ===================================================

const RESULT_BADGE: Record<LogResult, { variant: 'green' | 'red' | 'yellow' | 'gray'; label: string; icon: string }> = {
  success: { variant: 'green', label: 'Success', icon: '✅' },
  failure: { variant: 'red', label: 'Failed', icon: '❌' },
  partial: { variant: 'yellow', label: 'Partial', icon: '⚠️' },
  skipped: { variant: 'gray', label: 'Skipped', icon: '⏭️' },
};

const ACTION_ICONS: Record<ScheduleAction, string> = {
  refresh_copy: '✍️',
  pause_losers: '⏸️',
  boost_winners: '🚀',
  update_targeting: '🎯',
  full_refresh: '🔄',
};

const ACTION_LABELS: Record<ScheduleAction, string> = {
  refresh_copy: 'Refresh Copy',
  pause_losers: 'Pause Losers',
  boost_winners: 'Boost Winners',
  update_targeting: 'Update Targeting',
  full_refresh: 'Full Refresh',
};

const PLATFORM_ICONS: Record<string, string> = {
  meta: '📘',
  tiktok: '📱',
  youtube: '📺',
  google: '🔍',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function metricDelta(before: number, after: number, isPercent = false): { label: string; positive: boolean } {
  const delta = after - before;
  const pct = before !== 0 ? ((delta / before) * 100).toFixed(1) : '0.0';
  const sign = delta >= 0 ? '+' : '';
  const label = isPercent ? `${sign}${pct}%` : `${sign}${pct}%`;
  return { label, positive: delta >= 0 };
}

// ===================================================
// Before / After comparison row
// ===================================================

interface MetricRowProps {
  label: string;
  before: number;
  after: number;
  format: (v: number) => string;
}

const MetricRow = ({ label, before, after, format }: MetricRowProps) => {
  const { label: delta, positive } = metricDelta(before, after);
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-surface-border last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400">{format(before)}</span>
        <span className="text-gray-600">→</span>
        <span className="text-xs text-white font-medium">{format(after)}</span>
        <span className={clsx('text-xs font-medium', positive ? 'text-green-400' : 'text-red-400')}>
          {delta}
        </span>
      </div>
    </div>
  );
};

// ===================================================
// Single log entry
// ===================================================

interface LogEntryProps {
  log: ScheduleLog;
  isExpanded: boolean;
  onToggle: () => void;
}

const LogEntry = ({ log, isExpanded, onToggle }: LogEntryProps) => {
  const result = RESULT_BADGE[log.result];
  const hasBefore = log.metricsBeforeSnapshot != null && log.metricsAfterSnapshot != null;

  return (
    <div className="border-b border-surface-border last:border-0">
      {/* Summary row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 py-3 px-4 text-left hover:bg-surface-elevated/50 transition-colors duration-150"
      >
        {/* Timeline dot */}
        <div
          className={clsx(
            'w-2.5 h-2.5 rounded-full shrink-0',
            log.result === 'success' ? 'bg-green-500' :
            log.result === 'failure' ? 'bg-red-500' :
            log.result === 'partial' ? 'bg-yellow-500' : 'bg-gray-600'
          )}
        />

        {/* Icon + action */}
        <span className="text-base shrink-0">{ACTION_ICONS[log.action]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-white">{log.scheduleName}</span>
            <Badge variant={result.variant} className="text-xs">
              {result.icon} {result.label}
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{log.message}</p>
        </div>

        {/* Right meta */}
        <div className="text-right shrink-0">
          <p className="text-xs text-gray-400">{formatDate(log.triggeredAt)}</p>
          <p className="text-xs text-gray-600 mt-0.5">
            {log.platforms.map((p) => PLATFORM_ICONS[p]).join(' ')}
          </p>
        </div>

        {/* Expand indicator */}
        {hasBefore && (
          <span className={clsx('text-gray-600 text-xs ml-2 transition-transform duration-150', isExpanded && 'rotate-180')}>
            ▼
          </span>
        )}
      </button>

      {/* Expanded before/after */}
      {isExpanded && hasBefore && log.metricsBeforeSnapshot && log.metricsAfterSnapshot && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-10 pb-4"
        >
          <div className="bg-surface-elevated rounded-xl p-3 border border-surface-border">
            <p className="text-xs font-medium text-gray-400 mb-2">📊 Before → After Metrics</p>
            <MetricRow
              label="Impressions"
              before={log.metricsBeforeSnapshot.impressions}
              after={log.metricsAfterSnapshot.impressions}
              format={(v) => v.toLocaleString()}
            />
            <MetricRow
              label="CTR"
              before={log.metricsBeforeSnapshot.ctr}
              after={log.metricsAfterSnapshot.ctr}
              format={(v) => `${v.toFixed(2)}%`}
            />
            <MetricRow
              label="ROAS"
              before={log.metricsBeforeSnapshot.roas}
              after={log.metricsAfterSnapshot.roas}
              format={(v) => `${v.toFixed(2)}×`}
            />
            <MetricRow
              label="Spend"
              before={log.metricsBeforeSnapshot.spend}
              after={log.metricsAfterSnapshot.spend}
              format={(v) => `$${v.toLocaleString()}`}
            />
            <MetricRow
              label="Conversions"
              before={log.metricsBeforeSnapshot.conversions}
              after={log.metricsAfterSnapshot.conversions}
              format={(v) => v.toLocaleString()}
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Affected {log.affectedCampaigns} campaign{log.affectedCampaigns !== 1 ? 's' : ''} ·{' '}
            Completed {formatDate(log.completedAt)}
          </p>
        </motion.div>
      )}
    </div>
  );
};

// ===================================================
// Filter bar
// ===================================================

type FilterAction = ScheduleAction | 'all';
type FilterResult = LogResult | 'all';

// ===================================================
// Main component
// ===================================================

interface ExecutionLogProps {
  logs: ScheduleLog[];
}

export const ExecutionLog = ({ logs }: ExecutionLogProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterAction, setFilterAction] = useState<FilterAction>('all');
  const [filterResult, setFilterResult] = useState<FilterResult>('all');

  const filtered = logs.filter((l) => {
    if (filterAction !== 'all' && l.action !== filterAction) return false;
    if (filterResult !== 'all' && l.result !== filterResult) return false;
    return true;
  });

  return (
    <Card elevated noPadding>
      <div className="p-5 pb-0">
        <CardHeader
          title="📋 Execution History"
          subtitle={`${logs.length} total runs`}
        />

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mt-4 pb-4 border-b border-surface-border">
          {/* Action filter */}
          <div className="flex gap-1.5 flex-wrap">
            {(['all', 'refresh_copy', 'pause_losers', 'boost_winners', 'update_targeting', 'full_refresh'] as FilterAction[]).map((a) => (
              <button
                key={a}
                onClick={() => setFilterAction(a)}
                className={clsx(
                  'px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors duration-150',
                  filterAction === a
                    ? 'bg-brand-900/40 border-brand-700 text-brand-300'
                    : 'bg-surface-elevated border-surface-border text-gray-500 hover:text-gray-300'
                )}
              >
                {a === 'all' ? 'All Actions' : `${ACTION_ICONS[a as ScheduleAction]} ${ACTION_LABELS[a as ScheduleAction]}`}
              </button>
            ))}
          </div>

          {/* Result filter */}
          <div className="flex gap-1.5 ml-auto flex-wrap">
            {(['all', 'success', 'failure', 'partial', 'skipped'] as FilterResult[]).map((r) => (
              <button
                key={r}
                onClick={() => setFilterResult(r)}
                className={clsx(
                  'px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors duration-150',
                  filterResult === r
                    ? 'bg-brand-900/40 border-brand-700 text-brand-300'
                    : 'bg-surface-elevated border-surface-border text-gray-500 hover:text-gray-300'
                )}
              >
                {r === 'all' ? 'All Results' : RESULT_BADGE[r as LogResult].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Log entries */}
      {filtered.length === 0 ? (
        <div className="p-8 text-center text-gray-500 text-sm">
          No execution logs match the current filters
        </div>
      ) : (
        <div>
          {filtered.map((log) => (
            <LogEntry
              key={log.id}
              log={log}
              isExpanded={expandedId === log.id}
              onToggle={() => setExpandedId(expandedId === log.id ? null : log.id)}
            />
          ))}
        </div>
      )}
    </Card>
  );
};
