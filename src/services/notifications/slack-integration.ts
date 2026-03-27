// ===================================================
// Slack Integration — Block Kit webhook sender
// ===================================================

import type { Notification, SlackConfig } from './types';
import { TYPE_EMOJI, PRIORITY_COLOR } from './types';

// ── Block Kit payload builder ────────────────────

export function formatForSlack(notification: Notification, config?: Partial<SlackConfig>) {
  const emoji = TYPE_EMOJI[notification.type] ?? 'ℹ️';
  const color = PRIORITY_COLOR[notification.priority] ?? '#36a64f';

  return {
    username: config?.username ?? 'Spotify Ad Curator',
    icon_emoji: config?.iconEmoji ?? ':musical_note:',
    channel: config?.channel ?? '#general',
    attachments: [
      {
        color,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `${emoji}  ${notification.title}`,
              emoji: true,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: notification.message,
            },
            fields: [
              {
                type: 'mrkdwn',
                text: `*Type:*\n${notification.type.replace(/-/g, ' ')}`,
              },
              {
                type: 'mrkdwn',
                text: `*Priority:*\n${notification.priority.toUpperCase()}`,
              },
              {
                type: 'mrkdwn',
                text: `*Time:*\n${new Date(notification.timestamp).toLocaleString()}`,
              },
              ...(notification.metadata
                ? Object.entries(notification.metadata)
                    .slice(0, 1)
                    .map(([k, v]) => ({
                      type: 'mrkdwn',
                      text: `*${k}:*\n${String(v)}`,
                    }))
                : []),
            ],
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: { type: 'plain_text', text: '👁️ View in App', emoji: true },
                style: 'primary',
                url: 'https://github.com/christiannwajei2-ship-it/spotify-ad-curator',
              },
              {
                type: 'button',
                text: { type: 'plain_text', text: '✕ Dismiss', emoji: true },
                value: `dismiss-${notification.id}`,
              },
            ],
          },
        ],
      },
    ],
  };
}

// ── Send to real webhook ──────────────────────────

export async function sendSlackMessage(
  config: SlackConfig,
  notification: Notification
): Promise<{ success: boolean; error?: string; payload?: unknown }> {
  const payload = formatForSlack(notification, config);

  // Demo/dev guard: if webhook URL looks fake, simulate
  if (!config.webhookUrl.startsWith('https://hooks.slack.com/')) {
    console.info('[SlackIntegration] Demo mode — simulated Slack send:', payload);
    return { success: true, payload };
  }

  try {
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
    }

    return { success: true, payload };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error';
    return { success: false, error: message };
  }
}

// ── Test webhook ──────────────────────────────────

export async function testSlackWebhook(
  webhookUrl: string
): Promise<{ success: boolean; error?: string }> {
  const testNotification: Notification = {
    id: 'test-001',
    type: 'system',
    title: '✅ Slack Connected!',
    message:
      'Spotify Ad Curator is now connected to your Slack workspace. You will receive campaign notifications here.',
    priority: 'medium',
    channels: ['slack'],
    read: false,
    timestamp: new Date().toISOString(),
  };

  const config: SlackConfig = {
    webhookUrl,
    channel: '#general',
    username: 'Spotify Ad Curator',
    iconEmoji: ':musical_note:',
  };

  return sendSlackMessage(config, testNotification);
}
