import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import type { RealTimeEvent } from '../../services/realtime/types';

interface Props {
  events: RealTimeEvent[];
}

const EVENT_ICONS: Record<string, string> = {
  impression: '👁️',
  click: '🖱️',
  conversion: '✅',
  spend: '💸',
  engagement: '❤️',
};

const PLATFORM_COLORS: Record<string, string> = {
  meta: 'bg-blue-900/40 text-blue-300',
  tiktok: 'bg-pink-900/40 text-pink-300',
  youtube: 'bg-red-900/40 text-red-300',
  google: 'bg-yellow-900/40 text-yellow-300',
};

export const LiveEventFeed = ({ events }: Props) => {
  const [paused, setPaused] = useState(false);
  const [displayed, setDisplayed] = useState<RealTimeEvent[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!paused) {
      setDisplayed(events.slice(0, 100));
    }
  }, [events, paused]);

  useEffect(() => {
    if (!paused && listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [displayed, paused]);

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-elevated p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          Live Events
        </h3>
        <button
          onClick={() => setPaused((p) => !p)}
          className={clsx(
            'text-xs px-2 py-1 rounded-lg border transition-colors',
            paused
              ? 'bg-brand-800/50 border-brand-700 text-brand-300'
              : 'border-surface-border text-gray-400 hover:text-white'
          )}
        >
          {paused ? '▶ Resume' : '⏸ Pause'}
        </button>
      </div>
      <div ref={listRef} className="flex-1 overflow-y-auto space-y-1.5 max-h-64 pr-1">
        {displayed.length === 0 && (
          <p className="text-xs text-gray-500 text-center py-4">Waiting for events…</p>
        )}
        {displayed.map((ev) => (
          <div key={ev.id} className="flex items-center gap-2 text-xs py-1 border-b border-surface-border/50 last:border-0">
            <span className="text-base flex-shrink-0">{EVENT_ICONS[ev.type] ?? '📍'}</span>
            <span className={clsx('px-1.5 py-0.5 rounded text-xs flex-shrink-0', PLATFORM_COLORS[ev.platform] ?? 'bg-gray-800 text-gray-300')}>
              {ev.platform}
            </span>
            <span className="text-gray-300 capitalize flex-1">{ev.type}</span>
            <span className="text-gray-400 flex-shrink-0">{new Date(ev.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
