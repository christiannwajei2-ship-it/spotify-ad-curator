// ===================================================
// NotificationItem — Individual notification row
// ===================================================

import { motion } from 'framer-motion';
import type { Notification } from '../../services/notifications/types';
import { TYPE_EMOJI } from '../../services/notifications/types';
import { useAppStore } from '../../store';

interface Props {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

const PRIORITY_BORDER: Record<string, string> = {
  low:    'border-l-green-500',
  medium: 'border-l-yellow-400',
  high:   'border-l-orange-500',
  urgent: 'border-l-red-500',
};

export const NotificationItem = ({ notification, onMarkRead, onDelete }: Props) => {
  const { setStep } = useAppStore();

  const handleClick = () => {
    onMarkRead(notification.id);
    if (notification.actionUrl) {
      setStep(notification.actionUrl as Parameters<typeof setStep>[0]);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className={`
        group relative flex items-start gap-3 px-4 py-3
        border-l-2 ${PRIORITY_BORDER[notification.priority]}
        cursor-pointer hover:bg-surface-elevated transition-colors
        ${notification.read ? 'opacity-60' : ''}
      `}
      onClick={handleClick}
    >
      {/* Unread dot */}
      {!notification.read && (
        <span className="absolute right-10 top-3.5 w-2 h-2 rounded-full bg-brand-400 shrink-0" />
      )}

      {/* Type icon */}
      <span className="text-xl shrink-0 mt-0.5">{TYPE_EMOJI[notification.type]}</span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{notification.title}</p>
        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{notification.message}</p>
        <p className="text-xs text-gray-500 mt-1">{relativeTime(notification.timestamp)}</p>
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(notification.id);
        }}
        className="shrink-0 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-surface-border text-gray-500 hover:text-red-400 transition-all text-xs"
        title="Delete"
      >
        ✕
      </button>
    </motion.div>
  );
};
