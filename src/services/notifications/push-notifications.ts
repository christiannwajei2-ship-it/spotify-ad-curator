// ===================================================
// Browser Push Notification Service
// ===================================================

import type { Notification, QuietHours } from './types';

// ── Permission helpers ───────────────────────────

export function isPermissionGranted(): boolean {
  if (typeof Notification === 'undefined') return false;
  return Notification.permission === 'granted';
}

export async function requestPermission(): Promise<NotificationPermission> {
  if (typeof Notification === 'undefined') return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';

  try {
    return await Notification.requestPermission();
  } catch {
    return 'denied';
  }
}

// ── Quiet hours check ─────────────────────────────

function isQuietHoursActive(quietHours: QuietHours): boolean {
  if (!quietHours.enabled) return false;

  const now = new Date();
  const [startH, startM] = quietHours.start.split(':').map(Number);
  const [endH, endM] = quietHours.end.split(':').map(Number);

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (startMinutes <= endMinutes) {
    // e.g. 09:00 – 17:00
    return nowMinutes >= startMinutes && nowMinutes < endMinutes;
  } else {
    // overnight e.g. 22:00 – 08:00
    return nowMinutes >= startMinutes || nowMinutes < endMinutes;
  }
}

// ── Send browser push notification ───────────────

export async function sendPushNotification(
  notification: Notification,
  quietHours?: QuietHours
): Promise<boolean> {
  if (typeof Notification === 'undefined') return false;
  if (quietHours && isQuietHoursActive(quietHours)) return false;

  if (!isPermissionGranted()) {
    const perm = await requestPermission();
    if (perm !== 'granted') return false;
  }

  try {
    const pushNotif = new Notification(notification.title, {
      body: notification.message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: notification.id,
      data: { actionUrl: notification.actionUrl },
    });

    pushNotif.onclick = () => {
      window.focus();
      pushNotif.close();
    };

    return true;
  } catch {
    return false;
  }
}
