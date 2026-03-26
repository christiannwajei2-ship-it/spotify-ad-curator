// ===================================================
// PlanCard — Individual pricing plan card
// ===================================================

import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Button } from '../ui';
import type { SubscriptionPlan, BillingPeriod } from '../../services/payments/types';
import { getYearlySavingsPercent } from '../../services/payments/plans';

interface PlanCardProps {
  plan: SubscriptionPlan;
  billingPeriod: BillingPeriod;
  isCurrentPlan: boolean;
  isLoading?: boolean;
  onSelect: (planId: string) => void;
}

const CHECK_ICON = (
  <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const tierBorderClass: Record<string, string> = {
  gray: 'border-gray-700',
  brand: 'border-brand-600',
  yellow: 'border-yellow-600',
};

const tierAccentClass: Record<string, string> = {
  gray: 'text-gray-300',
  brand: 'text-brand-300',
  yellow: 'text-yellow-300',
};

const tierBadgeClass: Record<string, string> = {
  gray: 'bg-gray-800 text-gray-300',
  brand: 'bg-brand-900 text-brand-300',
  yellow: 'bg-yellow-900/50 text-yellow-300',
};

export const PlanCard = ({
  plan,
  billingPeriod,
  isCurrentPlan,
  isLoading,
  onSelect,
}: PlanCardProps) => {
  const price = billingPeriod === 'yearly' && plan.yearlyPrice > 0
    ? Math.round(plan.yearlyPrice / 12)
    : plan.monthlyPrice;

  const savingsPercent = getYearlySavingsPercent(plan);
  const isHighlighted = plan.tier === 'pro';

  const ctaLabel = isCurrentPlan
    ? 'Current Plan'
    : plan.tier === 'free'
    ? 'Get Started Free'
    : plan.tier === 'pro'
    ? 'Upgrade to Pro'
    : 'Go Agency';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        'relative flex flex-col rounded-2xl border p-6 transition-all duration-200',
        isHighlighted
          ? 'bg-brand-900/20 border-brand-600 shadow-xl shadow-brand-900/30 scale-105'
          : 'bg-surface-card border-surface-border hover:border-gray-600',
        tierBorderClass[plan.color]
      )}
    >
      {/* Badge */}
      {plan.badge && (
        <div className={clsx(
          'absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold',
          tierBadgeClass[plan.color]
        )}>
          {plan.badge}
        </div>
      )}

      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{plan.icon}</span>
          <h3 className={clsx('text-lg font-bold', tierAccentClass[plan.color])}>
            {plan.name}
          </h3>
        </div>
        <p className="text-xs text-gray-400">{plan.description}</p>
      </div>

      {/* Price */}
      <div className="mb-5">
        <div className="flex items-end gap-1">
          <span className="text-4xl font-extrabold text-white">${price}</span>
          <span className="text-gray-400 text-sm mb-1">/mo</span>
        </div>
        {billingPeriod === 'yearly' && plan.monthlyPrice > 0 && (
          <p className="text-xs text-gray-400 mt-1">
            Billed yearly — ${plan.yearlyPrice}/year
            {savingsPercent > 0 && (
              <span className="ml-1 text-green-400 font-medium">Save {savingsPercent}%</span>
            )}
          </p>
        )}
        {billingPeriod === 'monthly' && plan.monthlyPrice > 0 && (
          <p className="text-xs text-gray-500 mt-1">or ${plan.yearlyPrice}/year</p>
        )}
        {plan.monthlyPrice === 0 && (
          <p className="text-xs text-gray-500 mt-1">Free forever</p>
        )}
      </div>

      {/* CTA */}
      <Button
        variant={isHighlighted ? 'primary' : 'secondary'}
        size="md"
        isLoading={isLoading}
        disabled={isCurrentPlan}
        onClick={() => !isCurrentPlan && onSelect(plan.id)}
        className="w-full mb-6"
      >
        {ctaLabel}
      </Button>

      {/* Features */}
      <ul className="space-y-2.5 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-gray-300">
            {CHECK_ICON}
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};
