// ===================================================
// PaymentSuccess — Post-checkout success page/banner
// ===================================================

import { motion } from 'framer-motion';
import { Button } from '../ui';
import type { PricingTier } from '../../services/payments/types';
import { PLANS } from '../../services/payments/plans';

interface PaymentSuccessProps {
  tier: PricingTier;
  onContinue: () => void;
}

const CONFETTI = ['🎉', '🎊', '🎵', '⭐', '🚀', '💜', '🎶', '✨'];

export const PaymentSuccess = ({ tier, onContinue }: PaymentSuccessProps) => {
  const plan = PLANS[tier];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="text-center max-w-lg mx-auto py-12 px-4"
    >
      {/* Animated confetti */}
      <div className="flex items-center justify-center gap-2 text-3xl mb-6 flex-wrap">
        {CONFETTI.map((emoji, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 200 }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-3xl font-extrabold text-white mb-3">
          Welcome to {plan?.name}! {plan?.icon}
        </h1>
        <p className="text-gray-400 mb-8">
          Your subscription is now active. Here's what you've just unlocked:
        </p>
      </motion.div>

      {/* Feature highlights */}
      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-left space-y-3 bg-surface-elevated border border-surface-border rounded-2xl p-6 mb-8"
      >
        {plan?.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-gray-300">
            <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </motion.ul>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Button
          variant="primary"
          size="lg"
          onClick={onContinue}
          className="w-full"
        >
          🚀 Start Creating Ads
        </Button>
        <p className="text-xs text-gray-500 mt-4">
          30-day money-back guarantee — no questions asked.
        </p>
      </motion.div>
    </motion.div>
  );
};
