// ===================================================
// NotificationBell — Header bell with animated badge
// ===================================================

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationCenter } from './NotificationCenter';

export const NotificationBell = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllRead,
    deleteNotification,
    clearAll,
  } = useNotifications();

  const [open, setOpen] = useState(false);
  const [shake, setShake] = useState(false);
  const prevUnread = useRef(unreadCount);
  const containerRef = useRef<HTMLDivElement>(null);

  // Shake on new notification
  useEffect(() => {
    if (unreadCount > prevUnread.current) {
      setShake(true);
      const t = setTimeout(() => setShake(false), 600);
      return () => clearTimeout(t);
    }
    prevUnread.current = unreadCount;
  }, [unreadCount]);

  // Close on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  const badgeCount = unreadCount > 9 ? '9+' : String(unreadCount);

  return (
    <div ref={containerRef} className="relative">
      <motion.button
        animate={shake ? { rotate: [0, -15, 15, -10, 10, 0] } : {}}
        transition={{ duration: 0.5 }}
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-surface-elevated transition-colors"
        title="Notifications"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
      >
        {/* Bell icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {/* Badge */}
        {unreadCount > 0 && (
          <motion.span
            key={unreadCount}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none"
          >
            {badgeCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <NotificationCenter
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkRead={markAsRead}
            onMarkAllRead={markAllRead}
            onDelete={deleteNotification}
            onClearAll={clearAll}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
