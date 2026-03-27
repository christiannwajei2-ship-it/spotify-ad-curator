// ===================================================
// Notification Service Types
// ===================================================

export type NotificationType =
  | 'campaign-launched'
  | 'campaign-completed'
  | 'budget-alert'
  | 'performance-milestone'
  | 'schedule-executed'
  | 'export-ready'
  | 'system';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export type NotificationChannel = 'in-app' | 'browser-push' | 'slack';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  channels: NotificationChannel[];
  read: boolean;
  timestamp: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface ChannelPreferences {
  'in-app': boolean;
  'browser-push': boolean;
  slack: boolean;
}

export interface QuietHours {
  enabled: boolean;
  start: string; // "HH:MM"
  end: string;   // "HH:MM"
  timezone: string;
}

export type NotificationTypePreferences = Record<NotificationType, ChannelPreferences>;

export interface NotificationPreferences {
  types: NotificationTypePreferences;
  quietHours: QuietHours;
  slackWebhookUrl: string;
}

export interface SlackConfig {
  webhookUrl: string;
  channel: string;
  username: string;
  iconEmoji: string;
}

// ===================================================
// Default values
// ===================================================

export const DEFAULT_CHANNEL_PREFS: ChannelPreferences = {
  'in-app': true,
  'browser-push': true,
  slack: false,
};

export const DEFAULT_PREFERENCES: NotificationPreferences = {
  types: {
    'campaign-launched':     { 'in-app': true, 'browser-push': true,  slack: true  },
    'campaign-completed':    { 'in-app': true, 'browser-push': true,  slack: true  },
    'budget-alert':          { 'in-app': true, 'browser-push': true,  slack: true  },
    'performance-milestone': { 'in-app': true, 'browser-push': false, slack: false },
    'schedule-executed':     { 'in-app': true, 'browser-push': false, slack: false },
    'export-ready':          { 'in-app': true, 'browser-push': true,  slack: false },
    system:                  { 'in-app': true, 'browser-push': false, slack: false },
  },
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  slackWebhookUrl: '',
};

// ===================================================
// Type-to-emoji map
// ===================================================

export const TYPE_EMOJI: Record<NotificationType, string> = {
  'campaign-launched':     '🚀',
  'campaign-completed':    '✅',
  'budget-alert':          '⚠️',
  'performance-milestone': '🏆',
  'schedule-executed':     '⏰',
  'export-ready':          '📄',
  system:                  'ℹ️',
};

export const PRIORITY_COLOR: Record<NotificationPriority, string> = {
  low:    '#36a64f',
  medium: '#f0c040',
  high:   '#e8612c',
  urgent: '#e01e5a',
};
