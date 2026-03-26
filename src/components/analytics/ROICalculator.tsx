// ===================================================
// ROICalculator — Interactive ROI calculator
// ===================================================

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { buildROIReport } from '../../services/analytics/calculator';
import { INDUSTRY_BENCHMARKS } from '../../services/analytics/types';

const RATING_LABELS: Record<string, string> = {
  excellent: '🟢 Excellent',
  good:      '🟡 Good',
  average:   '🟠 Average',
  poor:      '🔴 Needs work',
};

const RATING_COLORS: Record<string, string> = {
  excellent: 'text-green-400',
  good:      'text-yellow-400',
  average:   'text-orange-400',
  poor:      'text-red-400',
};

interface InputRowProps {
  label: string;
  icon: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  placeholder?: string;
}

const InputRow = ({ label, icon, value, onChange, prefix, placeholder }: InputRowProps) => (
  <div className="flex items-center gap-3">
    <span className="text-xl w-7 text-center flex-shrink-0">{icon}</span>
    <label className="text-sm text-gray-400 w-36 flex-shrink-0">{label}</label>
    <div className="relative flex-1">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{prefix}</span>
      )}
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? '0'}
        className={clsx(
          'w-full bg-surface-elevated border border-surface-border rounded-xl py-2.5 text-sm text-white',
          'focus:outline-none focus:border-brand-700 focus:ring-1 focus:ring-brand-800',
          prefix ? 'pl-7 pr-4' : 'px-4'
        )}
      />
    </div>
  </div>
);

interface ResultRowProps {
  label: string;
  value: string;
  benchmark?: string;
  rating?: string;
}

const ResultRow = ({ label, value, benchmark, rating }: ResultRowProps) => (
  <div className="flex items-center justify-between py-2 border-b border-surface-border/50 last:border-0">
    <span className="text-sm text-gray-400">{label}</span>
    <div className="text-right">
      <span className="text-sm font-semibold text-white">{value}</span>
      {benchmark && (
        <span className="text-xs text-gray-500 ml-2">(avg: {benchmark})</span>
      )}
      {rating && (
        <div className={clsx('text-xs mt-0.5', RATING_COLORS[rating])}>
          {RATING_LABELS[rating]}
        </div>
      )}
    </div>
  </div>
);

export const ROICalculator = () => {
  const [spend,     setSpend]     = useState('6358');
  const [followers, setFollowers] = useState('6070');
  const [streams,   setStreams]   = useState('138040');

  const report = useMemo(() => {
    const s = parseFloat(spend)     || 0;
    const f = parseInt(followers)   || 0;
    const r = parseInt(streams)     || 0;
    return buildROIReport(s, f, r, 30);
  }, [spend, followers, streams]);

  return (
    <div className="flex flex-col gap-6">
      {/* Inputs */}
      <div className="flex flex-col gap-4">
        <InputRow
          label="Total Ad Spend"
          icon="💰"
          value={spend}
          onChange={setSpend}
          prefix="$"
          placeholder="0.00"
        />
        <InputRow
          label="New Followers"
          icon="👥"
          value={followers}
          onChange={setFollowers}
          placeholder="0"
        />
        <InputRow
          label="New Streams"
          icon="🎵"
          value={streams}
          onChange={setStreams}
          placeholder="0"
        />
      </div>

      {/* Results */}
      <motion.div
        key={`${spend}-${followers}-${streams}`}
        initial={{ opacity: 0.6, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="bg-surface-elevated rounded-xl border border-surface-border p-4"
      >
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
          Results
        </p>

        <ResultRow
          label="Cost per Follower"
          value={report.costPerFollower > 0 ? `$${report.costPerFollower.toFixed(2)}` : '—'}
          benchmark={`$${INDUSTRY_BENCHMARKS.costPerFollower.toFixed(2)}`}
          rating={report.ratings.costPerFollower}
        />
        <ResultRow
          label="Cost per Stream"
          value={report.costPerStream > 0 ? `$${report.costPerStream.toFixed(4)}` : '—'}
          benchmark={`$${INDUSTRY_BENCHMARKS.costPerStream.toFixed(4)}`}
          rating={report.ratings.costPerStream}
        />
        <ResultRow
          label="ROAS"
          value={report.roas > 0 ? `${report.roas.toFixed(2)}x` : '—'}
          benchmark={`${INDUSTRY_BENCHMARKS.roas.toFixed(1)}x`}
          rating={report.ratings.roas}
        />
      </motion.div>

      {/* 30-day projections */}
      {(report.projections.followersAt30Days > 0 || report.projections.streamsAt30Days > 0) && (
        <div className="rounded-xl border border-brand-800 bg-brand-900/20 p-4">
          <p className="text-xs font-medium text-brand-300 uppercase tracking-wide mb-3">
            30-Day Projections
          </p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-lg font-bold text-white">
                {report.projections.followersAt30Days.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Followers</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white">
                {report.projections.streamsAt30Days.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Streams</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white">
                {report.projections.estimatedMonthlyListeners.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Monthly Listeners</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
