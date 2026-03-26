// ===================================================
// PricingTable — Full pricing comparison table
// ===================================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { PlanCard } from './PlanCard';
import { PLAN_LIST, PLAN_FEATURES } from '../../services/payments/plans';
import type { BillingPeriod, PricingTier } from '../../services/payments/types';

interface PricingTableProps {
  currentTier?: PricingTier;
  isLoading?: boolean;
  onSelectPlan: (planId: string, period: BillingPeriod) => void;
}

const CHECK = (
  <svg className="w-4 h-4 text-green-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const X = (
  <svg className="w-4 h-4 text-gray-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const PricingTable = ({
  currentTier = 'free',
  isLoading,
  onSelectPlan,
}: PricingTableProps) => {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');

  return (
    <div className="w-full">
      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={clsx('text-sm font-medium', billingPeriod === 'monthly' ? 'text-white' : 'text-gray-400')}>
          Monthly
        </span>
        <button
          onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
          className={clsx(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
            billingPeriod === 'yearly' ? 'bg-brand-600' : 'bg-gray-700'
          )}
        >
          <span
            className={clsx(
              'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200',
              billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
            )}
          />
        </button>
        <span className={clsx('text-sm font-medium', billingPeriod === 'yearly' ? 'text-white' : 'text-gray-400')}>
          Yearly
        </span>
        {billingPeriod === 'yearly' && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-2 py-0.5 rounded-full bg-green-900/50 text-green-300 text-xs font-semibold border border-green-800"
          >
            Save 17%
          </motion.span>
        )}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {PLAN_LIST.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            billingPeriod={billingPeriod}
            isCurrentPlan={currentTier === plan.tier}
            isLoading={isLoading}
            onSelect={(planId) => onSelectPlan(planId, billingPeriod)}
          />
        ))}
      </div>

      {/* Feature comparison table */}
      <div className="rounded-2xl border border-surface-border overflow-hidden">
        <div className="grid grid-cols-4 gap-0 bg-surface-elevated border-b border-surface-border">
          <div className="p-4 text-sm font-semibold text-gray-300">Feature</div>
          {PLAN_LIST.map((plan) => (
            <div key={plan.id} className="p-4 text-center text-sm font-semibold text-white">
              {plan.icon} {plan.name}
            </div>
          ))}
        </div>

        {PLAN_FEATURES.map((feature, i) => (
          <div
            key={feature.id}
            className={clsx(
              'grid grid-cols-4 border-b border-surface-border last:border-0',
              i % 2 === 0 ? 'bg-surface-card' : 'bg-surface'
            )}
          >
            <div className="p-4 text-sm text-gray-400">{feature.label}</div>
            {(['free', 'pro', 'agency'] as const).map((tier) => {
              const val = feature[tier];
              return (
                <div key={tier} className="p-4 text-center text-xs text-gray-300">
                  {val === true ? CHECK : val === false ? X : <span>{val as string}</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
