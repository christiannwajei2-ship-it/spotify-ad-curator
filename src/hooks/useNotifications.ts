// ===================================================
// useNotifications — Custom hook
// ===================================================

import { useState, useCallback, useEffect, useRef } from 'react';
import type { Notification, NotificationPreferences } from '../services/notifications/types';
import { DEFAULT_PREFERENCES } from '../services/notifications/types';
import {
  getNotifications,
  getUnreadCount,
  markAsRead as managerMarkAsRead,
  markAllRead as managerMarkAllRead,
  deleteNotification as managerDelete,
  clearAll as managerClearAll,
  notify,
  seedDemoNotifications,
  generateRandomDemoNotification,
} from '../services/notifications/notification-manager';
import { testSlackWebhook, sendSlackMessage } from '../services/notifications/slack-integration';
import { sendPushNotification } from '../services/notifications/push-notifications';
import { useAppStore } from '../store';

const PREFS_KEY = 'spotify-ad-curator-notification-prefs';
const SLACK_KEY = 'spotify-ad-curator-slack-config';

function loadPreferences(): NotificationPreferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) } : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function savePreferences(prefs: NotificationPreferences): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

function loadSlackWebhook(): string {
  try {
    return localStorage.getItem(SLACK_KEY) ?? '';
  } catch {
    return '';
  }
}

function saveSlackWebhook(url: string): void {
  try {
    if (url) {
      localStorage.setItem(SLACK_KEY, url);
    } else {
      localStorage.removeItem(SLACK_KEY);
    }
  } catch {
    // ignore
  }
}

export const useNotifications = () => {
  const { isDemoMode } = useAppStore();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [preferences, setPreferences] = useState<NotificationPreferences>(loadPreferences);
  const [slackWebhookUrl, setSlackWebhookUrl] = useState(loadSlackWebhook);
  const [slackConnected, setSlackConnected] = useState(() => !!loadSlackWebhook());

  // ── Refresh state from localStorage ───────────

  const refresh = useCallback(() => {
    setNotifications(getNotifications());
    setUnreadCount(getUnreadCount());
  }, []);

  // ── Seed demo notifications on mount ──────────

  useEffect(() => {
    if (isDemoMode) {
      seedDemoNotifications();
    }
    refresh();
  }, [isDemoMode, refresh]);

  // ── Auto-generate demo notifications every 30-60s ──

  const demoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isDemoMode) return;

    const scheduleNext = () => {
      const delay = 30_000 + Math.random() * 30_000; // 30–60 s
      demoTimerRef.current = setTimeout(() => {
        generateRandomDemoNotification();
        refresh();
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => {
      if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
    };
  }, [isDemoMode, refresh]);

  // ── Operations ────────────────────────────────

  const markAsRead = useCallback(
    (id: string) => {
      managerMarkAsRead(id);
      refresh();
    },
    [refresh]
  );

  const markAllRead = useCallback(() => {
    managerMarkAllRead();
    refresh();
  }, [refresh]);

  const deleteNotification = useCallback(
    (id: string) => {
      managerDelete(id);
      refresh();
    },
    [refresh]
  );

  const clearAll = useCallback(() => {
    managerClearAll();
    refresh();
  }, [refresh]);

  const updatePreferences = useCallback((prefs: Partial<NotificationPreferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...prefs };
      savePreferences(next);
      return next;
    });
  }, []);

  // ── Slack ─────────────────────────────────────

  const connectSlack = useCallback(
    async (webhookUrl: string): Promise<{ success: boolean; error?: string }> => {
      const result = await testSlackWebhook(webhookUrl);
      if (result.success) {
        saveSlackWebhook(webhookUrl);
        setSlackWebhookUrl(webhookUrl);
        setSlackConnected(true);
        updatePreferences({ slackWebhookUrl: webhookUrl });
      }
      return result;
    },
    [updatePreferences]
  );

  const disconnectSlack = useCallback(() => {
    saveSlackWebhook('');
    setSlackWebhookUrl('');
    setSlackConnected(false);
    updatePreferences({ slackWebhookUrl: '' });
  }, [updatePreferences]);

  const testSlack = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!slackWebhookUrl) return { success: false, error: 'No webhook URL configured' };
    return testSlackWebhook(slackWebhookUrl);
  }, [slackWebhookUrl]);

  // ── Test notification ─────────────────────────

  const sendTestNotification = useCallback(async () => {
    const notif = notify({
      type: 'system',
      title: '🔔 Test Notification',
      message: 'Notifications are working correctly!',
      priority: 'medium',
      channels: ['in-app', 'browser-push', 'slack'],
    });

    // Try push
    await sendPushNotification(notif, preferences.quietHours);

    // Try Slack
    if (slackConnected && slackWebhookUrl) {
      await sendSlackMessage(
        {
          webhookUrl: slackWebhookUrl,
          channel: '#general',
          username: 'Spotify Ad Curator',
          iconEmoji: ':musical_note:',
        },
        notif
      );
    }

    refresh();
  }, [preferences.quietHours, slackConnected, slackWebhookUrl, refresh]);

  return {
    notifications,
    unreadCount,
    preferences,
    slackConnected,
    slackWebhookUrl,
    // operations
    markAsRead,
    markAllRead,
    deleteNotification,
    clearAll,
    updatePreferences,
    connectSlack,
    disconnectSlack,
    testSlack,
    sendTestNotification,
    refresh,
  };
};
