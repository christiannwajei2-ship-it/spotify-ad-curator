// ===================================================
// Notification Manager — central store (localStorage)
// ===================================================

import type { Notification, NotificationType, NotificationPriority, NotificationChannel } from './types';

const STORAGE_KEY = 'spotify-ad-curator-notifications';
const MAX_NOTIFICATIONS = 100;

// ── Persistence helpers ──────────────────────────

function loadNotifications(): Notification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Notification[]) : [];
  } catch {
    return [];
  }
}

function saveNotifications(notifications: Notification[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.slice(0, MAX_NOTIFICATIONS)));
  } catch {
    // quota exceeded — ignore
  }
}

// ── ID helper ────────────────────────────────────

function generateId(): string {
  return `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ── Core operations ──────────────────────────────

export function notify(
  partial: Omit<Notification, 'id' | 'read' | 'timestamp'>
): Notification {
  const notification: Notification = {
    ...partial,
    id: generateId(),
    read: false,
    timestamp: new Date().toISOString(),
  };

  const notifications = loadNotifications();
  notifications.unshift(notification);
  saveNotifications(notifications);

  return notification;
}

export function markAsRead(id: string): void {
  const notifications = loadNotifications().map((n) =>
    n.id === id ? { ...n, read: true } : n
  );
  saveNotifications(notifications);
}

export function markAllRead(): void {
  const notifications = loadNotifications().map((n) => ({ ...n, read: true }));
  saveNotifications(notifications);
}

export function getUnreadCount(): number {
  return loadNotifications().filter((n) => !n.read).length;
}

export interface NotificationFilter {
  type?: NotificationType;
  priority?: NotificationPriority;
  channel?: NotificationChannel;
  unreadOnly?: boolean;
}

export function getNotifications(filter?: NotificationFilter): Notification[] {
  let notifications = loadNotifications();

  if (filter?.type) {
    notifications = notifications.filter((n) => n.type === filter.type);
  }
  if (filter?.priority) {
    notifications = notifications.filter((n) => n.priority === filter.priority);
  }
  if (filter?.channel) {
    notifications = notifications.filter((n) => n.channels.includes(filter.channel!));
  }
  if (filter?.unreadOnly) {
    notifications = notifications.filter((n) => !n.read);
  }

  return notifications;
}

export function deleteNotification(id: string): void {
  saveNotifications(loadNotifications().filter((n) => n.id !== id));
}

export function clearAll(): void {
  saveNotifications([]);
}

// ── Demo-mode seed ────────────────────────────────

const DEMO_SEEDS: Omit<Notification, 'id' | 'read' | 'timestamp'>[] = [
  {
    type: 'campaign-launched',
    title: 'Campaign Launched! 🚀',
    message: 'Your "Afrobeats Summer" Meta Ads campaign is now live.',
    priority: 'high',
    channels: ['in-app', 'browser-push', 'slack'],
    actionUrl: 'ad-generator',
    metadata: { campaign: 'Afrobeats Summer', platform: 'Meta Ads' },
  },
  {
    type: 'performance-milestone',
    title: 'Milestone Reached 🏆',
    message: 'Your campaign hit 10,000 impressions with a 4.2% CTR.',
    priority: 'medium',
    channels: ['in-app'],
    actionUrl: 'analytics',
    metadata: { impressions: 10000, ctr: 4.2 },
  },
  {
    type: 'budget-alert',
    title: 'Budget Alert ⚠️',
    message: 'TikTok campaign has used 80% of daily budget.',
    priority: 'urgent',
    channels: ['in-app', 'browser-push', 'slack'],
    actionUrl: 'analytics',
    metadata: { platform: 'TikTok', usedPercent: 80 },
  },
  {
    type: 'schedule-executed',
    title: 'Schedule Ran ⏰',
    message: 'Auto-refresh completed for 3 campaigns.',
    priority: 'low',
    channels: ['in-app'],
    actionUrl: 'scheduler',
    metadata: { affectedCampaigns: 3 },
  },
  {
    type: 'export-ready',
    title: 'Export Ready 📄',
    message: 'Your analytics report is ready to download.',
    priority: 'medium',
    channels: ['in-app', 'browser-push'],
    actionUrl: 'analytics',
  },
];

let demoSeeded = false;

export function seedDemoNotifications(): void {
  if (demoSeeded) return;
  demoSeeded = true;

  const existing = loadNotifications();
  if (existing.length > 0) return; // already have notifications

  const now = Date.now();
  DEMO_SEEDS.forEach((seed, i) => {
    const notification: Notification = {
      ...seed,
      id: generateId(),
      read: i > 2, // first 3 unread
      timestamp: new Date(now - i * 1000 * 60 * 15).toISOString(), // 15 min apart
    };
    existing.push(notification);
  });

  saveNotifications(existing);
}

export function generateRandomDemoNotification(): Notification {
  const seed = DEMO_SEEDS[Math.floor(Math.random() * DEMO_SEEDS.length)];
  const notification: Notification = {
    ...seed,
    id: generateId(),
    read: false,
    timestamp: new Date().toISOString(),
  };

  const notifications = loadNotifications();
  notifications.unshift(notification);
  saveNotifications(notifications);

  return notification;
}
