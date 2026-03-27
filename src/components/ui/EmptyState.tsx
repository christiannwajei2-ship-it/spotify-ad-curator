import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
  className?: string;
}

export const EmptyState = ({
  icon = '📭',
  title,
  description,
  action,
  children,
  className = '',
}: EmptyStateProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}
  >
    <motion.div
      initial={{ scale: 0.6 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
      className="text-5xl mb-4 select-none"
    >
      {icon}
    </motion.div>

    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>

    {description && (
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-6">{description}</p>
    )}

    {action && (
      <button
        onClick={action.onClick}
        className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-brand-900/30"
      >
        {action.label}
      </button>
    )}

    {children}
  </motion.div>
);
