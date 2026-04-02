// ===================================================
// NotificationPreferences — Settings panel
// ===================================================

import { useState } from 'react';
import type { NotificationType, NotificationChannel, NotificationPreferences as NotificationPrefsType } from '../../services/notifications/types';
import { TYPE_EMOJI } from '../../services/notifications/types';

const NOTIFICATION_TYPES: NotificationType[] = [
  'campaign-launched',
  'campaign-completed',
  'budget-alert',
  'performance-milestone',
  'schedule-executed',
  'export-ready',
  'system',
];

const TYPE_LABELS: Record<NotificationType, string> = {
  'campaign-launched':     'Campaign Launched',
  'campaign-completed':    'Campaign Completed',
  'budget-alert':          'Budget Alert',
  'performance-milestone': 'Performance Milestone',
  'schedule-executed':     'Schedule Executed',
  'export-ready':          'Export Ready',
  system:                  'System',
};

const CHANNELS: { id: NotificationChannel; label: string }[] = [
  { id: 'in-app', label: 'In-App' },
  { id: 'browser-push', label: 'Push' },
  { id: 'slack', label: 'Slack' },
];

interface Props {
  preferences: NotificationPrefsType;
  onUpdate: (prefs: Partial<NotificationPrefsType>) => void;
  onTestNotification?: (channel: NotificationChannel) => void;
}

export const NotificationPreferences = ({ preferences, onUpdate, onTestNotification }: Props) => {
  const [saved, setSaved] = useState(false);

  const toggleChannel = (type: NotificationType, channel: NotificationChannel) => {
    const updated = {
      types: {
        ...preferences.types,
        [type]: {
          ...preferences.types[type],
          [channel]: !preferences.types[type][channel],
        },
      },
    };
    onUpdate(updated);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Toggle matrix */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Notification Channels</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left text-gray-400 font-medium py-2 pr-4 min-w-[160px]">
                  Type
                </th>
                {CHANNELS.map((ch) => (
                  <th key={ch.id} className="text-center text-gray-400 font-medium py-2 px-3 w-20">
                    {ch.label}
                    {onTestNotification && (
                      <button
                        onClick={() => onTestNotification(ch.id)}
                        className="block mx-auto mt-1 text-[10px] text-brand-400 hover:text-brand-300 transition-colors"
                      >
                        test
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {NOTIFICATION_TYPES.map((type) => (
                <tr key={type} className="hover:bg-surface-elevated/30 transition-colors">
                  <td className="py-2.5 pr-4">
                    <span className="flex items-center gap-2 text-gray-300">
                      <span>{TYPE_EMOJI[type]}</span>
                      <span>{TYPE_LABELS[type]}</span>
                    </span>
                  </td>
                  {CHANNELS.map((ch) => (
                    <td key={ch.id} className="text-center py-2.5 px-3">
                      <input
                        type="checkbox"
                        checked={preferences.types[type][ch.id]}
                        onChange={() => toggleChannel(type, ch.id)}
                        className="w-4 h-4 rounded border-surface-border accent-brand-500 cursor-pointer"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quiet hours */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Quiet Hours</h3>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.quietHours.enabled}
              onChange={(e) =>
                onUpdate({ quietHours: { ...preferences.quietHours, enabled: e.target.checked } })
              }
              className="w-4 h-4 accent-brand-500"
            />
            <span className="text-sm text-gray-300">Enable quiet hours</span>
          </label>

          {preferences.quietHours.enabled && (
            <>
              <label className="flex items-center gap-2 text-sm text-gray-400">
                From
                <input
                  type="time"
                  value={preferences.quietHours.start}
                  onChange={(e) =>
                    onUpdate({ quietHours: { ...preferences.quietHours, start: e.target.value } })
                  }
                  className="bg-surface-elevated border border-surface-border rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:border-brand-500"
                />
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-400">
                To
                <input
                  type="time"
                  value={preferences.quietHours.end}
                  onChange={(e) =>
                    onUpdate({ quietHours: { ...preferences.quietHours, end: e.target.value } })
                  }
                  className="bg-surface-elevated border border-surface-border rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:border-brand-500"
                />
              </label>
            </>
          )}
        </div>
      </div>

      {/* Save / reset */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {saved ? '✅ Saved!' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};
