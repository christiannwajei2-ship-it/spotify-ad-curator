// ===================================================
// FeatureShowcase — Interactive feature grid
// ===================================================

import { motion } from 'framer-motion';
import { ALL_FEATURES } from '../../services/demo/sample-data';
import { useDemo } from '../../hooks/useDemo';
import { useAppStore } from '../../store';
import type { AppStep } from '../../types';

const TIER_COLORS = {
  free: 'text-green-400 bg-green-900/20 border-green-900',
  pro: 'text-brand-400 bg-brand-900/20 border-brand-900',
  agency: 'text-yellow-400 bg-yellow-900/20 border-yellow-900',
};

export const FeatureShowcase = () => {
  const { exploredFeatures, markFeatureExplored } = useDemo();
  const { setStep } = useAppStore();

  const exploredCount = exploredFeatures.length;
  const totalCount = ALL_FEATURES.length;

  const handleFeatureClick = (featureId: string, navigateTo: string) => {
    markFeatureExplored(featureId);
    setStep(navigateTo as AppStep);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">All Features</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {exploredCount} of {totalCount} explored
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-24 h-1.5 bg-surface-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-500"
              style={{ width: `${(exploredCount / totalCount) * 100}%` }}
            />
          </div>
          <span>Explore all features</span>
        </div>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {ALL_FEATURES.map((feature, i) => {
          const isExplored = exploredFeatures.includes(feature.id);
          return (
            <motion.button
              key={feature.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleFeatureClick(feature.id, feature.navigateTo)}
              className={`relative text-left bg-surface-elevated border rounded-xl p-4 flex flex-col gap-2.5 transition-all duration-200 hover:border-brand-700 hover:-translate-y-0.5 group
                ${isExplored ? 'border-brand-800/50' : 'border-surface-border'}`}
            >
              {/* Check mark */}
              {isExplored && (
                <span className="absolute top-2 right-2 text-xs text-brand-400">✓</span>
              )}

              <span className="text-2xl">{feature.icon}</span>

              <div>
                <p className="text-xs font-semibold text-white leading-tight">{feature.label}</p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{feature.description}</p>
              </div>

              <span className={`self-start text-xs font-medium border rounded-full px-2 py-0.5 ${TIER_COLORS[feature.tier]}`}>
                {feature.tier}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
