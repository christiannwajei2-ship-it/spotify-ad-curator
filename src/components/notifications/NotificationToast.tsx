// ===================================================
// NotificationToast — In-app toast overlay
// ===================================================

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Notification } from '../../services/notifications/types';
import { TYPE_EMOJI } from '../../services/notifications/types';
import { useNotifications } from '../../hooks/useNotifications';

const BORDER_COLOR: Record<string, string> = {
  low:    'border-l-green-500',
  medium: 'border-l-brand-400',
  high:   'border-l-orange-500',
  urgent: 'border-l-red-500',
};

interface ToastProps {
  notification: Notification;
  onDismiss: () => void;
}

const Toast = ({ notification, onDismiss }: ToastProps) => {
  useEffect(() => {
    const t = setTimeout(onDismiss, 5_000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`
        flex items-start gap-3 w-80 bg-surface border border-surface-border rounded-xl p-3 shadow-2xl
        border-l-2 ${BORDER_COLOR[notification.priority]}
        cursor-pointer select-none
      `}
      onClick={onDismiss}
    >
      <span className="text-lg shrink-0 mt-0.5">{TYPE_EMOJI[notification.type]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{notification.title}</p>
        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{notification.message}</p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDismiss(); }}
        className="shrink-0 p-0.5 rounded text-gray-500 hover:text-white transition-colors text-xs"
      >
        ✕
      </button>
    </motion.div>
  );
};

// ── Toast container — renders up to 3 toasts ─────

export const NotificationToastContainer = () => {
  const { notifications } = useNotifications();
  const [shown, setShown] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<Notification[]>([]);

  useEffect(() => {
    const newOnes = notifications
      .filter((n) => !n.read && !shown.has(n.id))
      .slice(0, 3 - active.length);

    if (newOnes.length === 0) return;

    setShown((prev) => {
      const next = new Set(prev);
      newOnes.forEach((n) => next.add(n.id));
      return next;
    });
    setActive((prev) => [...newOnes, ...prev].slice(0, 3));
  }, [notifications]); // eslint-disable-line react-hooks/exhaustive-deps

  const dismiss = (id: string) => {
    setActive((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {active.map((n) => (
          <div key={n.id} className="pointer-events-auto">
            <Toast notification={n} onDismiss={() => dismiss(n.id)} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};
