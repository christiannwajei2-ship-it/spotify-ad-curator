import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: string;
  children: ReactNode;
  placement?: TooltipPlacement;
  delay?: number;
}

const placementClasses: Record<TooltipPlacement, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrowClasses: Record<TooltipPlacement, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-surface-elevated border-x-transparent border-b-transparent border-4',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-surface-elevated border-x-transparent border-t-transparent border-4',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-surface-elevated border-y-transparent border-r-transparent border-4',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-surface-elevated border-y-transparent border-l-transparent border-4',
};

export const Tooltip = ({ content, children, placement = 'top', delay = 300 }: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    showTimer.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    if (showTimer.current) clearTimeout(showTimer.current);
    setVisible(false);
  };

  useEffect(() => () => { if (showTimer.current) clearTimeout(showTimer.current); }, []);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15 }}
            role="tooltip"
            className={`absolute z-50 pointer-events-none whitespace-nowrap ${placementClasses[placement]}`}
          >
            <span className="block bg-surface-elevated text-white text-xs font-medium px-2.5 py-1.5 rounded-lg border border-surface-border shadow-xl">
              {content}
            </span>
            <span className={`absolute ${arrowClasses[placement]}`} aria-hidden="true" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
};
