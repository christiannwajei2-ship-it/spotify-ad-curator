// ===================================================
// PlatformComparison — Side-by-side platform performance
// ===================================================

import { clsx } from 'clsx';
import type { PlatformMetrics } from '../../services/analytics/types';
import { getBestPerformerPerMetric } from '../../services/analytics/calculator';

interface PlatformComparisonProps {
  platforms: PlatformMetrics[];
}

interface MetricColumn {
  key: keyof PlatformMetrics;
  label: string;
  format: (v: number) => string;
  lowerIsBetter?: boolean;
}

const COLUMNS: MetricColumn[] = [
  { key: 'spend',        label: 'Spend',        format: (v) => `$${v.toFixed(0)}` },
  { key: 'impressions',  label: 'Impressions',   format: (v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v) },
  { key: 'clicks',       label: 'Clicks',        format: (v) => v.toLocaleString() },
  { key: 'ctr',          label: 'CTR',           format: (v) => `${v.toFixed(2)}%` },
  { key: 'cpc',          label: 'CPC',           format: (v) => `$${v.toFixed(2)}`, lowerIsBetter: true },
  { key: 'roas',         label: 'ROAS',          format: (v) => `${v.toFixed(1)}x` },
  { key: 'newFollowers', label: 'Followers',     format: (v) => v.toLocaleString() },
];

export const PlatformComparison = ({ platforms }: PlatformComparisonProps) => {
  const best = getBestPerformerPerMetric(platforms);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-border">
            <th className="text-left py-3 pr-4 text-xs font-medium text-gray-400 uppercase tracking-wide">
              Platform
            </th>
            {COLUMNS.map((col) => (
              <th
                key={col.key as string}
                className="text-right py-3 px-2 text-xs font-medium text-gray-400 uppercase tracking-wide"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {platforms.map((p) => (
            <tr
              key={p.platform}
              className="border-b border-surface-border/50 hover:bg-surface-elevated/30 transition-colors"
            >
              {/* Platform name */}
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: p.color }}
                  />
                  <span className="font-medium text-white">{p.icon} {p.label}</span>
                </div>
              </td>

              {/* Metric cells */}
              {COLUMNS.map((col) => {
                const val      = p[col.key] as number;
                const isBest   = best[col.key as string] === p.platform;
                const isHigher = !col.lowerIsBetter;

                return (
                  <td key={col.key as string} className="py-3 px-2 text-right">
                    <span
                      className={clsx(
                        'font-medium',
                        isBest
                          ? isHigher
                            ? 'text-green-400'
                            : 'text-green-400'
                          : 'text-gray-300'
                      )}
                    >
                      {col.format(val)}
                      {isBest && (
                        <span className="ml-1 text-xs">🏆</span>
                      )}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <p className="mt-3 text-xs text-gray-500">
        🏆 Best performer per metric
      </p>
    </div>
  );
};
