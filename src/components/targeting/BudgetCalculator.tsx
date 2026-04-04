import { useState } from 'react';
import type { BudgetRecommendation } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/formatters';

interface BudgetCalculatorProps {
  budgetRec: BudgetRecommendation;
  onBudgetChange?: (budget: number) => void;
}

export const BudgetCalculator = ({ budgetRec, onBudgetChange }: BudgetCalculatorProps) => {
  const [budget, setBudget] = useState(budgetRec.dailyBudget);

  const handleChange = (value: number) => {
    setBudget(value);
    onBudgetChange?.(value);
  };

  const multiplier = budget / budgetRec.dailyBudget;

  return (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-medium text-gray-300 block mb-2">
          Daily Budget: <span className="text-brand-300 font-bold">{formatCurrency(budget)}</span>
        </label>
        <input
          type="range"
          min={1}
          max={50}
          step={0.5}
          value={budget}
          onChange={(e) => handleChange(parseFloat(e.target.value))}
          className="w-full accent-brand-500 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>$1/day</span>
          <span>$50/day</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatBox
          label="Est. Reach"
          value={`${formatNumber(Math.round(budgetRec.estimatedReach.min * multiplier))}–${formatNumber(Math.round(budgetRec.estimatedReach.max * multiplier))}`}
          icon="👥"
        />
        <StatBox
          label="Impressions"
          value={`${formatNumber(Math.round(budgetRec.estimatedImpressions.min * multiplier))}–${formatNumber(Math.round(budgetRec.estimatedImpressions.max * multiplier))}`}
          icon="👁️"
        />
        <StatBox
          label="Link Clicks"
          value={`${Math.round(budgetRec.estimatedLinkClicks.min * multiplier)}–${Math.round(budgetRec.estimatedLinkClicks.max * multiplier)}`}
          icon="🖱️"
        />
      </div>

      <div className="space-y-2">
        {budgetRec.notes.map((note, i) => (
          <p key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
            <span className="flex-shrink-0">{note.split(' ')[0]}</span>
            <span>{note.split(' ').slice(1).join(' ')}</span>
          </p>
        ))}
      </div>
    </div>
  );
};

const StatBox = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <div className="bg-surface-elevated rounded-xl border border-surface-border p-3 text-center">
    <div className="text-lg mb-1">{icon}</div>
    <div className="text-white font-bold text-sm">{value}</div>
    <div className="text-gray-500 text-xs mt-0.5">{label}</div>
  </div>
);
