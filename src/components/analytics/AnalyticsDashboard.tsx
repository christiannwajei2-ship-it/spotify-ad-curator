// ===================================================
// AnalyticsDashboard — Main analytics dashboard
// ===================================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Card, CardHeader } from '../ui/Card';
import { MetricCard } from './MetricCard';
import { GrowthChart } from './GrowthChart';
import { PlatformComparison } from './PlatformComparison';
import { ROICalculator } from './ROICalculator';
import { ExportButton } from './ExportButton';
import { UpgradeModal } from '../payments/UpgradeModal';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useSubscription } from '../../hooks/useSubscription';
import type { TimePeriod } from '../../services/analytics/types';
import type { GatedFeature } from '../../services/payments/guards';

const TIME_PERIODS: { value: TimePeriod; label: string; requiredFeature?: GatedFeature }[] = [
  { value: '7d',  label: '7 Days' },
  { value: '30d', label: '30 Days', requiredFeature: 'analytics-30d' },
  { value: '90d', label: '90 Days', requiredFeature: 'analytics-90d' },
  { value: 'all', label: 'All Time', requiredFeature: 'analytics-90d' },
];

type ChartSeries = 'impressions' | 'clicks' | 'spend' | 'conversions';

const CHART_SERIES: { value: ChartSeries; label: string }[] = [
  { value: 'impressions', label: 'Impressions' },
  { value: 'clicks',      label: 'Clicks' },
  { value: 'spend',       label: 'Spend' },
  { value: 'conversions', label: 'Conversions' },
];

export const AnalyticsDashboard = () => {
  const {
    period,
    setPeriod,
    isDemo,
    getSummary,
    getPlatformComparison,
    getTimeSeries,
    exportJSON,
    exportCSV,
    exportText,
  } = useAnalytics();

  const {
    canAccess,
    upgradeModal,
    openUpgradeModal,
    closeUpgradeModal,
    checkout,
    isLoading: checkoutLoading,
  } = useSubscription();

  const [activeSeries, setActiveSeries] = useState<ChartSeries[]>(['impressions', 'clicks', 'spend']);

  const summary   = getSummary();
  const platforms = getPlatformComparison();
  const series    = getTimeSeries('all');

  const toggleSeries = (key: ChartSeries) => {
    setActiveSeries((prev) => {
      if (prev.includes(key)) {
        // Keep at least one series active
        return prev.length > 1 ? prev.filter((s) => s !== key) : prev;
      }
      return [...prev, key];
    });
  };

  return (
    <div className="space-y-6">

      {/* ── Header ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">
            {summary.periodLabel}
            {isDemo && (
              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-900/30 text-yellow-300 text-xs border border-yellow-800">
                🎭 Demo data
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Period selector */}
          <div className="flex bg-surface-elevated border border-surface-border rounded-xl overflow-hidden">
            {TIME_PERIODS.map((tp) => {
              const isLocked = tp.requiredFeature ? !canAccess(tp.requiredFeature) : false;
              return (
                <button
                  key={tp.value}
                  onClick={() => {
                    if (isLocked && tp.requiredFeature) {
                      openUpgradeModal(tp.requiredFeature);
                      return;
                    }
                    setPeriod(tp.value);
                  }}
                  className={clsx(
                    'px-3 py-1.5 text-xs font-medium transition-colors duration-200',
                    period === tp.value
                      ? 'bg-brand-700 text-white'
                      : isLocked
                        ? 'text-gray-600 hover:text-yellow-400'
                        : 'text-gray-400 hover:text-white'
                  )}
                  title={isLocked ? 'Upgrade to Pro to unlock' : undefined}
                >
                  {tp.label}
                  {isLocked && ' 🔒'}
                </button>
              );
            })}
          </div>

          {/* Export */}
          {canAccess('export') ? (
            <ExportButton
              onExportJSON={exportJSON}
              onExportCSV={exportCSV}
              onExportText={exportText}
            />
          ) : (
            <button
              onClick={() => openUpgradeModal('export')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border border-yellow-800 bg-yellow-900/20 text-yellow-300 hover:bg-yellow-900/30 transition-colors duration-200"
            >
              🔒 Export (Pro)
            </button>
          )}
        </div>
      </div>

      {/* ── Summary metric cards ──────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Total Spend"
          value={`$${summary.totalSpend.toLocaleString()}`}
          trend={summary.trends.spend}
          icon="💰"
          subLabel={`${summary.periodLabel}`}
        />
        <MetricCard
          label="Total Reach"
          value={summary.totalReach.toLocaleString()}
          trend={summary.trends.reach}
          icon="👁️"
          subLabel="Unique people"
        />
        <MetricCard
          label="Avg CTR"
          value={`${summary.avgCtr.toFixed(2)}%`}
          trend={summary.trends.ctr}
          icon="🎯"
          subLabel="Click-through rate"
          highlight
        />
        <MetricCard
          label="Cost / Follower"
          value={`$${summary.costPerFollower.toFixed(2)}`}
          trend={-18.3}
          trendInverted
          icon="👥"
          subLabel="vs. $0.75 industry avg"
          highlight
        />
      </div>

      {/* ── Secondary metrics ────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Impressions"
          value={`${(summary.totalImpressions / 1000).toFixed(0)}k`}
          trend={summary.trends.impressions}
          icon="📣"
        />
        <MetricCard
          label="Clicks"
          value={summary.totalClicks.toLocaleString()}
          trend={summary.trends.clicks}
          icon="🖱️"
        />
        <MetricCard
          label="Conversions"
          value={summary.totalConversions.toLocaleString()}
          trend={summary.trends.conversions}
          icon="✨"
        />
        <MetricCard
          label="Cost / Stream"
          value={`$${summary.costPerStream.toFixed(4)}`}
          trend={-22.5}
          trendInverted
          icon="🎵"
          subLabel="vs. $0.008 avg"
        />
      </div>

      {/* ── Growth Chart ─────────────────────────────── */}
      <Card elevated>
        <CardHeader
          title="Performance Over Time"
          subtitle={`${series.points.length} data points`}
          icon={<span className="text-base">📈</span>}
          action={
            <div className="flex gap-1 flex-wrap justify-end">
              {CHART_SERIES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => toggleSeries(s.value)}
                  className={clsx(
                    'px-2 py-1 text-xs rounded-lg border transition-colors duration-150',
                    activeSeries.includes(s.value)
                      ? 'bg-brand-800/50 border-brand-700 text-brand-300'
                      : 'bg-transparent border-surface-border text-gray-500 hover:text-gray-300'
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          }
        />
        <GrowthChart points={series.points} series={activeSeries} />
      </Card>

      {/* ── Platform comparison + ROI ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Platform comparison — takes 2/3 */}
        <div className="lg:col-span-2">
          <Card elevated>
            <CardHeader
              title="Platform Comparison"
              subtitle="Ranked by ROAS"
              icon={<span className="text-base">🏆</span>}
            />
            <PlatformComparison platforms={platforms} />
          </Card>
        </div>

        {/* ROI Calculator — takes 1/3 */}
        <div>
          <Card elevated>
            <CardHeader
              title="ROI Calculator"
              subtitle="vs. industry benchmarks"
              icon={<span className="text-base">🧮</span>}
            />
            <ROICalculator />
          </Card>
        </div>
      </div>

      {/* ── Best platform callout ─────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-brand-700 bg-brand-900/20 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
      >
        <span className="text-3xl">🏆</span>
        <div className="flex-1">
          <p className="font-semibold text-white">
            {summary.bestPlatformLabel} is your top performer this period
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Highest ROAS across all platforms — consider allocating more budget here for maximum return.
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-gray-400">Best ROAS</p>
          <p className="text-xl font-bold text-brand-300">
            {platforms[0]?.roas.toFixed(1) ?? '—'}x
          </p>
        </div>
      </motion.div>

    </div>

      <UpgradeModal
        isOpen={upgradeModal.isOpen}
        feature={upgradeModal.feature}
        isLoading={checkoutLoading}
        onUpgrade={(planId, period) => checkout(planId, period)}
        onClose={closeUpgradeModal}
      />
  );
};
