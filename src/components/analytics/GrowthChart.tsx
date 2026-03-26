// ===================================================
// GrowthChart — Time series line chart (using recharts)
// ===================================================

import { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import type { TimeSeriesPoint } from '../../services/analytics/types';

interface GrowthChartProps {
  points: TimeSeriesPoint[];
  series?: Array<'impressions' | 'clicks' | 'spend' | 'conversions'>;
  height?: number;
}

const SERIES_CONFIG = {
  impressions: { label: 'Impressions', color: '#a855f7', yAxisId: 'left' },
  clicks:      { label: 'Clicks',      color: '#22d3ee', yAxisId: 'left' },
  spend:       { label: 'Spend ($)',   color: '#f59e0b', yAxisId: 'right' },
  conversions: { label: 'Conversions', color: '#4ade80', yAxisId: 'left' },
} as const;

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-surface-elevated border border-surface-border rounded-xl p-3 text-xs shadow-xl">
      <p className="text-gray-400 mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: entry.color }} />
          <span className="text-gray-300">{entry.name}:</span>
          <span className="text-white font-semibold">
            {entry.name.includes('Spend')
              ? `$${entry.value.toFixed(2)}`
              : entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export const GrowthChart = ({
  points,
  series = ['impressions', 'clicks', 'spend'],
  height = 280,
}: GrowthChartProps) => {
  const data = useMemo(
    () =>
      points.map((p) => ({
        ...p,
        date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      })),
    [points]
  );

  const hasRight = series.includes('spend');

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: hasRight ? 10 : 0, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a38" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: '#6b7280', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          yAxisId="left"
          tick={{ fill: '#6b7280', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
          width={45}
        />
        {hasRight && (
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `$${v.toFixed(0)}`}
            width={50}
          />
        )}
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 12, color: '#9ca3af', paddingTop: 8 }}
          iconType="circle"
        />
        {series.map((key) => {
          const cfg = SERIES_CONFIG[key];
          return (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={cfg.label}
              stroke={cfg.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              yAxisId={cfg.yAxisId}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};
