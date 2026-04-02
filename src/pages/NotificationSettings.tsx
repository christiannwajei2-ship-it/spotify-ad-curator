// ===================================================
// NotificationSettings — Full notification settings page
// ===================================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationPreferences } from '../components/notifications/NotificationPreferences';
import { SlackSetupWizard } from '../components/notifications/SlackSetupWizard';
import { NotificationItem } from '../components/notifications/NotificationItem';
import { requestPermission, isPermissionGranted } from '../services/notifications/push-notifications';
import type { NotificationChannel } from '../services/notifications/types';

export const NotificationSettings = () => {
  const {
    notifications,
    unreadCount,
    preferences,
    slackConnected,
    slackWebhookUrl,
    markAsRead,
    deleteNotification,
    clearAll,
    updatePreferences,
    connectSlack,
    disconnectSlack,
    testSlack,
    sendTestNotification,
  } = useNotifications();

  const [pushPermission, setPushPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  );

  const handleRequestPush = async () => {
    const perm = await requestPermission();
    setPushPermission(perm);
  };

  const handleTestChannel = async (channel: NotificationChannel) => {
    if (channel === 'slack') {
      await testSlack();
    } else {
      await sendTestNotification();
    }
  };

  const recentHistory = notifications.slice(0, 50);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">🔔 Notification Settings</h1>
        <p className="text-gray-400 mt-1">
          Configure how and when you receive notifications about your campaigns.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: notifications.length },
          { label: 'Unread', value: unreadCount, highlight: unreadCount > 0 },
          { label: 'Slack', value: slackConnected ? '✅ On' : '⛔ Off' },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-elevated border border-surface-border rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${stat.highlight ? 'text-brand-400' : 'text-white'}`}>
              {stat.value}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Push notification permission */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-elevated border border-surface-border rounded-xl p-6"
      >
        <h2 className="text-base font-semibold text-white mb-4">📲 Browser Push Notifications</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-300">
              Status:{' '}
              <span
                className={
                  pushPermission === 'granted'
                    ? 'text-green-400'
                    : pushPermission === 'denied'
                      ? 'text-red-400'
                      : 'text-yellow-400'
                }
              >
                {pushPermission === 'granted' ? '✅ Granted' : pushPermission === 'denied' ? '⛔ Denied' : '⏳ Not yet asked'}
              </span>
            </p>
            {pushPermission === 'denied' && (
              <p className="text-xs text-gray-500 mt-1">
                To enable, go to your browser settings and allow notifications for this site.
              </p>
            )}
          </div>
          {!isPermissionGranted() && pushPermission !== 'denied' && (
            <button
              onClick={handleRequestPush}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Enable Push Notifications
            </button>
          )}
          {isPermissionGranted() && (
            <button
              onClick={sendTestNotification}
              className="px-4 py-2 border border-surface-border text-gray-300 rounded-lg text-sm hover:text-white transition-colors"
            >
              Send Test
            </button>
          )}
        </div>
      </motion.section>

      {/* Slack setup */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-surface-elevated border border-surface-border rounded-xl p-6"
      >
        <h2 className="text-base font-semibold text-white mb-4">💬 Slack Integration</h2>
        <SlackSetupWizard
          connected={slackConnected}
          webhookUrl={slackWebhookUrl}
          onConnect={connectSlack}
          onDisconnect={disconnectSlack}
          onTest={testSlack}
        />
      </motion.section>

      {/* Preferences matrix */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface-elevated border border-surface-border rounded-xl p-6"
      >
        <h2 className="text-base font-semibold text-white mb-4">⚙️ Preferences</h2>
        <NotificationPreferences
          preferences={preferences}
          onUpdate={updatePreferences}
          onTestNotification={handleTestChannel}
        />
      </motion.section>

      {/* Notification history */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-surface-elevated border border-surface-border rounded-xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
          <h2 className="text-base font-semibold text-white">📋 Recent Notifications</h2>
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-gray-500 hover:text-red-400 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {recentHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <span className="text-4xl mb-3">🎉</span>
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            {recentHistory.map((notif) => (
              <NotificationItem
                key={notif.id}
                notification={notif}
                onMarkRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
};
