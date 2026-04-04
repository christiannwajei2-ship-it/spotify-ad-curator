// ===================================================
// ScheduleBuilder — Create / edit schedule form
// ===================================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type {
  CampaignSchedule,
  ScheduleFrequency,
  ScheduleAction,
  AdPlatformId,
  DayOfWeek,
} from '../../services/scheduler/types';
import { SCHEDULE_ACTIONS, DEFAULT_THRESHOLDS } from '../../services/scheduler/types';
import type { NewScheduleForm } from '../../hooks/useScheduler';

// ===================================================
// Static config
// ===================================================

const FREQUENCY_OPTIONS: { value: ScheduleFrequency; label: string; desc: string }[] = [
  { value: 'daily', label: 'Daily', desc: 'Runs every day at the chosen time' },
  { value: 'weekly', label: 'Weekly', desc: 'Runs once a week on the chosen day' },
  { value: 'biweekly', label: 'Bi-Weekly', desc: 'Runs every two weeks' },
  { value: 'monthly', label: 'Monthly', desc: 'Runs once a month on the chosen date' },
];

const DAYS_OF_WEEK: { value: DayOfWeek; label: string; short: string }[] = [
  { value: 0, label: 'Sunday', short: 'Sun' },
  { value: 1, label: 'Monday', short: 'Mon' },
  { value: 2, label: 'Tuesday', short: 'Tue' },
  { value: 3, label: 'Wednesday', short: 'Wed' },
  { value: 4, label: 'Thursday', short: 'Thu' },
  { value: 5, label: 'Friday', short: 'Fri' },
  { value: 6, label: 'Saturday', short: 'Sat' },
];

const PLATFORMS: { id: AdPlatformId; label: string; icon: string }[] = [
  { id: 'meta', label: 'Meta', icon: '📘' },
  { id: 'tiktok', label: 'TikTok', icon: '📱' },
  { id: 'youtube', label: 'YouTube', icon: '📺' },
  { id: 'google', label: 'Google', icon: '🔍' },
];

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const h = i === 0 ? 12 : i > 12 ? i - 12 : i;
  const ampm = i < 12 ? 'AM' : 'PM';
  return { value: i, label: `${h}:00 ${ampm}` };
});

// ===================================================
// Helpers
// ===================================================

function buildPreview(form: NewScheduleForm): string {
  const action = SCHEDULE_ACTIONS.find((a) => a.type === form.action);
  const platforms = form.platforms.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(', ');
  const hourLabel = HOURS[form.rule.hour]?.label ?? `${form.rule.hour}:00`;

  let when = '';
  switch (form.rule.frequency) {
    case 'daily':
      when = `every day at ${hourLabel}`;
      break;
    case 'weekly': {
      const day = DAYS_OF_WEEK.find((d) => d.value === form.rule.dayOfWeek);
      when = `every ${day?.label ?? 'Monday'} at ${hourLabel}`;
      break;
    }
    case 'biweekly': {
      const day2 = DAYS_OF_WEEK.find((d) => d.value === form.rule.dayOfWeek);
      when = `every other ${day2?.label ?? 'Monday'} at ${hourLabel}`;
      break;
    }
    case 'monthly':
      when = `on the ${form.rule.dayOfMonth ?? 1}${ordinal(form.rule.dayOfMonth ?? 1)} of each month at ${hourLabel}`;
      break;
  }

  if (!platforms) return `This schedule will run ${when}`;
  return `This schedule will run ${when} and ${action?.description?.toLowerCase() ?? 'execute the action'} for ${platforms} campaigns.`;
}

function ordinal(n: number): string {
  if (n >= 11 && n <= 13) return 'th';
  return ['th', 'st', 'nd', 'rd', 'th'][Math.min(n % 10, 4)];
}

// ===================================================
// Component
// ===================================================

interface ScheduleBuilderProps {
  initial?: CampaignSchedule | null;
  onSave: (form: NewScheduleForm) => void;
  onCancel: () => void;
}

const DEFAULT_FORM: NewScheduleForm = {
  name: '',
  description: '',
  rule: { frequency: 'weekly', dayOfWeek: 1, hour: 9, minute: 0 },
  platforms: ['meta', 'tiktok'],
  action: 'refresh_copy',
  thresholds: DEFAULT_THRESHOLDS,
};

export const ScheduleBuilder = ({ initial, onSave, onCancel }: ScheduleBuilderProps) => {
  const [form, setForm] = useState<NewScheduleForm>(
    initial
      ? {
          name: initial.name,
          description: initial.description,
          rule: initial.rule,
          platforms: initial.platforms,
          action: initial.action,
          thresholds: initial.thresholds,
        }
      : DEFAULT_FORM
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (form.platforms.length === 0) e.platforms = 'Select at least one platform';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (validate()) onSave(form);
  };

  const togglePlatform = (id: AdPlatformId) => {
    setForm((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(id)
        ? prev.platforms.filter((p) => p !== id)
        : [...prev.platforms, id],
    }));
  };

  const preview = buildPreview(form);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card elevated>
        <CardHeader
          title={initial ? '✏️ Edit Schedule' : '➕ New Schedule'}
          subtitle="Configure when and how your campaigns should be automatically refreshed"
        />

        <div className="space-y-6 mt-6">
          {/* Name & description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Schedule Name *</label>
              <Input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Weekly Copy Refresh"
                error={errors.name}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Description</label>
              <Input
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Brief description of what this schedule does"
              />
            </div>
          </div>

          {/* Action */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Action</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {SCHEDULE_ACTIONS.map((a) => (
                <button
                  key={a.type}
                  onClick={() => setForm((p) => ({ ...p, action: a.type as ScheduleAction }))}
                  className={clsx(
                    'flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all duration-150',
                    form.action === a.type
                      ? 'bg-brand-900/40 border-brand-700 text-white'
                      : 'bg-surface-elevated border-surface-border text-gray-400 hover:border-gray-600'
                  )}
                >
                  <span className="text-lg mt-0.5">{a.icon}</span>
                  <div>
                    <p className="text-xs font-medium leading-tight">{a.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-tight">{a.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Frequency</label>
            <div className="flex gap-2 flex-wrap">
              {FREQUENCY_OPTIONS.map((f) => (
                <button
                  key={f.value}
                  onClick={() =>
                    setForm((p) => ({
                      ...p,
                      rule: { ...p.rule, frequency: f.value },
                    }))
                  }
                  className={clsx(
                    'px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-150',
                    form.rule.frequency === f.value
                      ? 'bg-brand-900/40 border-brand-700 text-brand-300'
                      : 'bg-surface-elevated border-surface-border text-gray-400 hover:border-gray-600'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Day of week (weekly / biweekly) */}
          {(form.rule.frequency === 'weekly' || form.rule.frequency === 'biweekly') && (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Day of Week</label>
              <div className="flex gap-2 flex-wrap">
                {DAYS_OF_WEEK.map((d) => (
                  <button
                    key={d.value}
                    onClick={() =>
                      setForm((p) => ({ ...p, rule: { ...p.rule, dayOfWeek: d.value } }))
                    }
                    className={clsx(
                      'px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150',
                      form.rule.dayOfWeek === d.value
                        ? 'bg-brand-900/40 border-brand-700 text-brand-300'
                        : 'bg-surface-elevated border-surface-border text-gray-400 hover:border-gray-600'
                    )}
                  >
                    {d.short}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Day of month (monthly) */}
          {form.rule.frequency === 'monthly' && (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Day of Month</label>
              <div className="flex gap-1.5 flex-wrap max-w-md">
                {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                  <button
                    key={day}
                    onClick={() =>
                      setForm((p) => ({ ...p, rule: { ...p.rule, dayOfMonth: day } }))
                    }
                    className={clsx(
                      'w-8 h-8 rounded-lg border text-xs font-medium transition-all duration-150',
                      form.rule.dayOfMonth === day
                        ? 'bg-brand-900/40 border-brand-700 text-brand-300'
                        : 'bg-surface-elevated border-surface-border text-gray-500 hover:border-gray-600'
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Time */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Time (UTC)</label>
            <select
              value={form.rule.hour}
              onChange={(e) =>
                setForm((p) => ({ ...p, rule: { ...p.rule, hour: Number(e.target.value) } }))
              }
              className="bg-surface-elevated border border-surface-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-600 transition-colors duration-150"
            >
              {HOURS.map((h) => (
                <option key={h.value} value={h.value}>
                  {h.label}
                </option>
              ))}
            </select>
          </div>

          {/* Platforms */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Platforms {errors.platforms && <span className="text-red-400 ml-1">{errors.platforms}</span>}
            </label>
            <div className="flex gap-2 flex-wrap">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => togglePlatform(p.id)}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150',
                    form.platforms.includes(p.id)
                      ? 'bg-brand-900/40 border-brand-700 text-brand-300'
                      : 'bg-surface-elevated border-surface-border text-gray-400 hover:border-gray-600'
                  )}
                >
                  {p.icon} {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Performance thresholds (shown for performance-based actions) */}
          {(form.action === 'pause_losers' || form.action === 'boost_winners') && (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-3">Performance Thresholds</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Min CTR (%)</label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={form.thresholds.minCTR}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        thresholds: { ...p.thresholds, minCTR: parseFloat(e.target.value) || 0 },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Min ROAS (×)</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.thresholds.minROAS}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        thresholds: { ...p.thresholds, minROAS: parseFloat(e.target.value) || 0 },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Boost ROAS (×)</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.thresholds.boostROASTarget}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        thresholds: { ...p.thresholds, boostROASTarget: parseFloat(e.target.value) || 0 },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Budget Cap ($)</label>
                  <Input
                    type="number"
                    min="0"
                    step="10"
                    value={form.thresholds.maxBudgetCap}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        thresholds: { ...p.thresholds, maxBudgetCap: parseFloat(e.target.value) || 0 },
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          <div className="p-4 bg-brand-900/20 border border-brand-800 rounded-xl">
            <p className="text-xs font-medium text-brand-400 mb-1">📅 Schedule Preview</p>
            <p className="text-sm text-gray-300">{preview}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button variant="primary" onClick={handleSave}>
              {initial ? 'Update Schedule' : 'Create Schedule'}
            </Button>
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
