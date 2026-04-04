import { motion } from 'framer-motion';
import type { CountryTarget } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface CountryCardProps {
  country: CountryTarget;
  rank: number;
  isTop?: boolean;
}

export const CountryCard = ({ country, rank, isTop }: CountryCardProps) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: rank * 0.05 }}
    className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200
      ${isTop
        ? 'bg-brand-900/30 border-brand-700 shadow-lg shadow-brand-900/20'
        : 'bg-surface-elevated border-surface-border hover:border-brand-800'
      }`}
  >
    <div className="flex-shrink-0 flex items-center gap-2">
      <span className="text-gray-600 text-xs font-mono w-4">#{rank}</span>
      <span className="text-2xl">{country.flag}</span>
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className="font-semibold text-white text-sm">{country.name}</p>
        {isTop && (
          <span className="text-xs bg-brand-800/60 text-brand-300 px-1.5 py-0.5 rounded-full border border-brand-700">
            ⭐ Top Pick
          </span>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-0.5 truncate">{country.primaryReason}</p>
    </div>
    <div className="text-right flex-shrink-0 space-y-0.5">
      <p className="text-xs text-gray-500">CPM</p>
      <p className="text-sm font-bold text-white">{formatCurrency(country.estimatedCpm)}</p>
      <p className="text-xs text-gray-500">{country.audienceSize}</p>
    </div>
    <div className="flex-shrink-0 w-16">
      <div className="text-right text-xs text-gray-500 mb-1">Score</div>
      <div className="h-1.5 w-full bg-surface-border rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-700 to-brand-400 rounded-full"
          style={{ width: `${country.score}%` }}
        />
      </div>
      <div className="text-right text-xs text-brand-400 mt-0.5">{country.score}</div>
    </div>
  </motion.div>
);
