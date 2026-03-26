// ===================================================
// UpgradeModal — Paywall modal shown when user hits a feature limit
// ===================================================

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui';
import { PLANS } from '../../services/payments/plans';
import type { GatedFeature } from '../../services/payments/guards';
import type { BillingPeriod } from '../../services/payments/types';
import { getUpgradeMessage } from '../../services/payments/guards';

interface UpgradeModalProps {
  isOpen: boolean;
  feature: GatedFeature | null;
  isLoading?: boolean;
  onUpgrade: (planId: string, period: BillingPeriod) => void;
  onClose: () => void;
}

export const UpgradeModal = ({
  isOpen,
  feature,
  isLoading,
  onUpgrade,
  onClose,
}: UpgradeModalProps) => {
  if (!feature) return null;

  const message = getUpgradeMessage(feature);
  const targetPlan = PLANS[message.requiredTier];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-surface-elevated border border-surface-border rounded-2xl p-8 max-w-md w-full shadow-2xl">
              {/* Icon */}
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-brand-900/50 border border-brand-800 mx-auto mb-5 text-2xl">
                {targetPlan?.icon ?? '⭐'}
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-white text-center mb-2">
                {message.title}
              </h2>

              {/* Description */}
              <p className="text-gray-400 text-sm text-center mb-6">
                {message.description}
              </p>

              {/* Plan highlight */}
              <div className="rounded-xl border border-brand-700 bg-brand-900/20 p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-brand-300">
                    {targetPlan?.icon} {targetPlan?.name} Plan
                  </span>
                  <span className="text-white font-bold">
                    ${targetPlan?.monthlyPrice}/mo
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {targetPlan?.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-300">
                      <svg className="w-3.5 h-3.5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  onClick={() => onUpgrade(message.requiredTier, 'monthly')}
                  className="w-full"
                >
                  {message.cta} — ${targetPlan?.monthlyPrice}/mo
                </Button>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={onClose}
                  className="w-full"
                >
                  Maybe Later
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
