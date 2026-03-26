// ===================================================
// MetricCard — Individual metric display card
// ===================================================

import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface MetricCardProps {
  label: string;
  value: string;
  subLabel?: string;
  trend?: number;       // % change, positive = up, negative = down
  trendInverted?: boolean; // For metrics where down is good (e.g. CPC)
  icon?: string;
  highlight?: boolean;
  className?: string;
}

export const MetricCard = ({
  label,
  value,
  subLabel,
  trend,
  trendInverted = false,
  icon,
  highlight,
  className,
}: MetricCardProps) => {
  const isPositive = trend !== undefined && (trendInverted ? trend < 0 : trend > 0);
  const isNegative = trend !== undefined && (trendInverted ? trend > 0 : trend < 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        'rounded-2xl border p-5 flex flex-col gap-3',
        highlight
          ? 'bg-brand-900/30 border-brand-700'
          : 'bg-surface-card border-surface-border',
        className
      )}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
        {icon && (
          <span className="text-lg">{icon}</span>
        )}
      </div>

      {/* Main value */}
      <div className="flex items-end justify-between gap-2">
        <span
          className={clsx(
            'text-2xl font-bold tracking-tight',
            highlight ? 'text-brand-300' : 'text-white'
          )}
        >
          {value}
        </span>

        {/* Trend badge */}
        {trend !== undefined && (
          <span
            className={clsx(
              'flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full',
              isPositive && 'bg-green-900/40 text-green-400',
              isNegative && 'bg-red-900/40 text-red-400',
              !isPositive && !isNegative && 'bg-gray-800 text-gray-400'
            )}
          >
            {isPositive && '↑'}
            {isNegative && '↓'}
            {!isPositive && !isNegative && '→'}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>

      {/* Sub label */}
      {subLabel && (
        <p className="text-xs text-gray-500">{subLabel}</p>
      )}

      {/* Sparkline placeholder — subtle brand gradient bar */}
      <div className="h-1 rounded-full bg-surface-border overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.abs(trend ?? 70))}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={clsx(
            'h-full rounded-full',
            highlight
              ? 'bg-gradient-to-r from-brand-700 to-brand-400'
              : 'bg-gradient-to-r from-brand-900 to-brand-600'
          )}
        />
      </div>
    </motion.div>
  );
};
