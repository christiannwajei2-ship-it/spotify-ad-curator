// ===================================================
// PerformanceRules — Auto-optimization rules config
// ===================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { Card, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { PerformanceThreshold } from '../../services/scheduler/types';
import { DEFAULT_THRESHOLDS } from '../../services/scheduler/types';
import { OPTIMIZATION_RULES } from '../../services/scheduler/rules';
import { evaluatePerformance } from '../../services/scheduler/engine';

// ===================================================
// Sample metrics for preview simulation
// ===================================================

const SAMPLE_METRICS = {
  loser: {
    impressions: 2_400,
    clicks: 7,
    ctr: 0.29,
    spend: 48.00,
    roas: 0.8,
    conversions: 4,
  },
  average: {
    impressions: 18_000,
    clicks: 324,
    ctr: 1.80,
    spend: 420.00,
    roas: 2.4,
    conversions: 214,
  },
  winner: {
    impressions: 55_000,
    clicks: 1_210,
    ctr: 2.20,
    spend: 980.00,
    roas: 4.1,
    conversions: 728,
  },
};

// ===================================================
// Component
// ===================================================

interface PerformanceRulesProps {
  thresholds?: PerformanceThreshold;
  onThresholdsChange?: (t: PerformanceThreshold) => void;
}

export const PerformanceRules = ({
  thresholds: externalThresholds,
  onThresholdsChange,
}: PerformanceRulesProps) => {
  const [localThresholds, setLocalThresholds] = useState<PerformanceThreshold>(
    externalThresholds ?? DEFAULT_THRESHOLDS
  );
  const [enabledRules, setEnabledRules] = useState<Set<string>>(
    new Set(OPTIMIZATION_RULES.map((r) => r.id))
  );
  const [expandedRule, setExpandedRule] = useState<string | null>(null);

  const thresholds = externalThresholds ?? localThresholds;

  const updateThreshold = (key: keyof PerformanceThreshold, value: number) => {
    const updated = { ...thresholds, [key]: value };
    if (onThresholdsChange) {
      onThresholdsChange(updated);
    } else {
      setLocalThresholds(updated);
    }
  };

  const toggleRule = (id: string) => {
    setEnabledRules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Preview: what would happen to each sample campaign
  const previews = Object.entries(SAMPLE_METRICS).map(([key, metrics]) => ({
    key,
    label: key === 'loser' ? '🔴 Underperformer' : key === 'winner' ? '🟢 Top Performer' : '🟡 Average',
    metrics,
    eval: evaluatePerformance(metrics, thresholds),
  }));

  return (
    <div className="space-y-6">
      {/* Threshold editor */}
      <Card elevated>
        <CardHeader
          title="⚙️ Performance Thresholds"
          subtitle="Set the trigger points for automatic actions"
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {[
            { key: 'minCTR' as const, label: 'Pause below CTR (%)', min: 0.1, max: 5, step: 0.1 },
            { key: 'minROAS' as const, label: 'Pause below ROAS (×)', min: 0, max: 5, step: 0.1 },
            { key: 'boostROASTarget' as const, label: 'Boost above ROAS (×)', min: 1, max: 10, step: 0.5 },
            { key: 'minImpressions' as const, label: 'Min impressions', min: 100, max: 10000, step: 100 },
          ].map(({ key, label, min, max, step }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
              <input
                type="number"
                min={min}
                max={max}
                step={step}
                value={thresholds[key]}
                onChange={(e) => updateThreshold(key, parseFloat(e.target.value) || 0)}
                className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-600 transition-colors duration-150"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Rules list */}
      <Card elevated>
        <CardHeader
          title="📋 Optimization Rules"
          subtitle="Toggle rules on/off and see what they would do with your current campaigns"
        />
        <div className="space-y-3 mt-6">
          {OPTIMIZATION_RULES.map((rule) => {
            const isEnabled = enabledRules.has(rule.id);
            const isExpanded = expandedRule === rule.id;

            return (
              <div
                key={rule.id}
                className={clsx(
                  'border rounded-xl transition-colors duration-150',
                  isEnabled
                    ? 'border-surface-border bg-surface-elevated/30'
                    : 'border-surface-border/50 bg-surface/20 opacity-60'
                )}
              >
                {/* Header */}
                <div className="flex items-center gap-3 p-4">
                  <span className="text-xl shrink-0">{rule.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-medium text-white">{rule.name}</h4>
                      <Badge variant="gray" className="text-xs">
                        Cooldown: {rule.cooldownHours >= 168
                          ? `${rule.cooldownHours / 168}w`
                          : rule.cooldownHours >= 24
                            ? `${rule.cooldownHours / 24}d`
                            : `${rule.cooldownHours}h`}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{rule.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setExpandedRule(isExpanded ? null : rule.id)}
                      className="text-xs text-gray-500 hover:text-gray-300 px-2 py-1 rounded hover:bg-surface-elevated transition-colors duration-150"
                    >
                      {isExpanded ? 'Hide ▲' : 'Details ▼'}
                    </button>
                    {/* Toggle */}
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className={clsx(
                        'relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200',
                        isEnabled ? 'bg-brand-600' : 'bg-gray-700'
                      )}
                    >
                      <span
                        className={clsx(
                          'inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200',
                          isEnabled ? 'translate-x-4' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 border-t border-surface-border pt-4">
                        {/* Example */}
                        <div className="p-3 bg-brand-900/20 border border-brand-800/50 rounded-xl mb-4">
                          <p className="text-xs text-brand-400 font-medium mb-1">💡 Example</p>
                          <p className="text-xs text-gray-300">{rule.example}</p>
                        </div>

                        {/* Preview against sample campaigns */}
                        <p className="text-xs font-medium text-gray-400 mb-2">
                          🔮 Preview with sample campaigns
                        </p>
                        <div className="space-y-1.5">
                          {previews.map(({ key, label, metrics }) => {
                            const wouldTrigger = rule.check(metrics, thresholds);
                            return (
                              <div
                                key={key}
                                className="flex items-center justify-between bg-surface-elevated rounded-lg p-2.5 text-xs"
                              >
                                <div className="flex items-center gap-2">
                                  <span>{label}</span>
                                  <span className="text-gray-500">
                                    CTR {metrics.ctr.toFixed(2)}% · ROAS {metrics.roas.toFixed(2)}×
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {wouldTrigger ? (
                                    <Badge variant="yellow">
                                      ⚡ Would trigger
                                    </Badge>
                                  ) : (
                                    <Badge variant="gray">No action</Badge>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
