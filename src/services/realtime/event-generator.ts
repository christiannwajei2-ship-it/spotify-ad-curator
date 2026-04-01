import type { RealTimeEvent, EventType } from './types';

const PLATFORMS = ['meta', 'tiktok', 'youtube', 'google'] as const;

function getPeakMultiplier(): number {
  const hour = new Date().getHours();
  if (hour >= 9 && hour < 12) return 1.8;
  if (hour >= 18 && hour < 21) return 2.0;
  if (hour >= 0 && hour < 6) return 0.4;
  return 1.0;
}

function getPlatformWeight(platform: string): number {
  const hour = new Date().getHours();
  if (platform === 'tiktok' && hour >= 18 && hour < 23) return 2.5;
  if (platform === 'google') return 1.2;
  return 1.0;
}

let _counter = 0;

export function generateEvent(): RealTimeEvent {
  const peak = getPeakMultiplier();
  const platform = PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)];
  const weight = getPlatformWeight(platform);
  const rand = Math.random() * peak * weight;

  let type: EventType;
  let value: number;

  if (rand > 1.5) {
    type = 'impression';
    value = Math.floor(Math.random() * 50) + 10;
  } else if (rand > 0.8) {
    type = 'click';
    value = Math.floor(Math.random() * 5) + 1;
  } else if (rand > 0.5) {
    type = 'engagement';
    value = Math.floor(Math.random() * 3) + 1;
  } else if (rand > 0.2) {
    type = 'spend';
    value = parseFloat((Math.random() * 2 + 0.1).toFixed(2));
  } else {
    type = 'conversion';
    value = 1;
  }

  return {
    id: `evt-${Date.now()}-${_counter++}`,
    type,
    platform,
    timestamp: Date.now(),
    value,
  };
}
