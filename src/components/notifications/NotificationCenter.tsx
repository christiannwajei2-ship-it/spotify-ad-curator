// ===================================================
// NotificationCenter — Dropdown notification panel
// ===================================================

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Notification, NotificationType } from '../../services/notifications/types';
import { NotificationItem } from './NotificationItem';

type Tab = 'all' | 'unread' | 'campaign' | 'system';

const CAMPAIGN_TYPES: NotificationType[] = [
  'campaign-launched',
  'campaign-completed',
  'budget-alert',
  'performance-milestone',
  'schedule-executed',
  'export-ready',
];

interface Props {
  notifications: Notification[];
  unreadCount: number;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export const NotificationCenter = ({
  notifications,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
  onDelete,
  onClearAll,
  onClose,
}: Props) => {
  const [activeTab, setActiveTab] = useState<Tab>('all');

  const filtered = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'campaign') return CAMPAIGN_TYPES.includes(n.type);
    if (activeTab === 'system') return n.type === 'system';
    return true;
  });

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'campaign', label: 'Campaign' },
    { id: 'system', label: 'System' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-surface border border-surface-border rounded-xl shadow-2xl overflow-hidden z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
        <h3 className="font-semibold text-white text-sm">Notifications</h3>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-surface-elevated text-gray-400 hover:text-white transition-colors text-xs"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-3 py-2 border-b border-surface-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-brand-900/60 text-brand-300 border border-brand-800'
                : 'text-gray-400 hover:text-white hover:bg-surface-elevated'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-1 bg-surface-border px-1.5 py-0.5 rounded-full text-[10px]">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="overflow-y-auto max-h-80 divide-y divide-surface-border">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <span className="text-3xl mb-2">🎉</span>
              <p className="text-sm">All caught up!</p>
            </div>
          ) : (
            filtered.map((notif) => (
              <NotificationItem
                key={notif.id}
                notification={notif}
                onMarkRead={onMarkRead}
                onDelete={onDelete}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-surface-border px-4 py-2 flex items-center justify-between">
          <button
            onClick={onClearAll}
            className="text-xs text-gray-500 hover:text-red-400 transition-colors"
          >
            Clear all
          </button>
          <span className="text-xs text-gray-600">{notifications.length} total</span>
        </div>
      )}
    </motion.div>
  );
};
