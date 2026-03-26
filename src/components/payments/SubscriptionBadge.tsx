// ===================================================
// SubscriptionBadge — Shows current plan in the header
// ===================================================

import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import type { PricingTier } from '../../services/payments/types';

interface SubscriptionBadgeProps {
  tier: PricingTier;
  onClick?: () => void;
  className?: string;
}

const tierConfig: Record<PricingTier, { label: string; icon: string; colorClass: string }> = {
  free: {
    label: 'Free',
    icon: '🎵',
    colorClass: 'bg-gray-800/60 text-gray-300 border-gray-700 hover:border-gray-500',
  },
  pro: {
    label: 'Pro',
    icon: '⭐',
    colorClass: 'bg-brand-900/60 text-brand-300 border-brand-700 hover:border-brand-500',
  },
  agency: {
    label: 'Agency',
    icon: '🏢',
    colorClass: 'bg-yellow-900/40 text-yellow-300 border-yellow-700 hover:border-yellow-500',
  },
};

export const SubscriptionBadge = ({ tier, onClick, className }: SubscriptionBadgeProps) => {
  const config = tierConfig[tier];

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      title="Manage subscription"
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors duration-200 cursor-pointer',
        config.colorClass,
        className
      )}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </motion.button>
  );
};
