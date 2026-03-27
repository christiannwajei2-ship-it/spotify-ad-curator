import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';

interface Props {
  label: string;
  value: number;
  format?: 'number' | 'currency' | 'percent';
  delta?: number;
  icon: string;
  sparkline?: number[];
  pulse?: boolean;
}

function formatValue(v: number, fmt: Props['format']): string {
  if (fmt === 'currency') return `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (fmt === 'percent') return `${v.toFixed(2)}%`;
  return v.toLocaleString();
}

export const LiveMetricCard = ({ label, value, format = 'number', delta, icon, sparkline = [], pulse }: Props) => {
  const [displayed, setDisplayed] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const diff = value - prevRef.current;
    if (diff === 0) return;
    const steps = 20;
    const step = diff / steps;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed((p) => {
        const next = p + step;
        return diff > 0 ? Math.min(next, value) : Math.max(next, value);
      });
      if (i >= steps) clearInterval(id);
    }, 30);
    prevRef.current = value;
    return () => clearInterval(id);
  }, [value]);

  const maxSpark = Math.max(...sparkline, 1);
  const sparkHeight = 28;

  return (
    <div className={clsx(
      'rounded-2xl border p-4 bg-surface-elevated border-surface-border transition-all duration-300',
      pulse && 'ring-1 ring-brand-500/50'
    )}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-base">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{formatValue(displayed, format)}</p>
      {delta !== undefined && (
        <p className={clsx('text-xs font-medium', delta >= 0 ? 'text-green-400' : 'text-red-400')}>
          {delta >= 0 ? '↑' : '↓'} {Math.abs(delta).toFixed(1)}% vs last hr
        </p>
      )}
      {sparkline.length > 1 && (
        <svg className="w-full mt-2" height={sparkHeight} style={{ overflow: 'visible' }}>
          <polyline
            points={sparkline
              .map((v, i) => `${(i / (sparkline.length - 1)) * 100}%,${sparkHeight - (v / maxSpark) * sparkHeight}`)
              .join(' ')}
            fill="none"
            stroke="#7c3aed"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
};
