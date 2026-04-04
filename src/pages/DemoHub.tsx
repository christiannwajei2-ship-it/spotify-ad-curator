// ===================================================
// DemoHub — Central demo hub page
// ===================================================

import { motion } from 'framer-motion';
import { ScenarioSelector } from '../components/demo/ScenarioSelector';
import { FeatureShowcase } from '../components/demo/FeatureShowcase';
import { useDemo } from '../hooks/useDemo';
import { useAppStore } from '../store';
import { Badge } from '../components/ui';

export const DemoHub = () => {
  const { isDemoMode, toggleDemoMode, completedScenarios, exploredFeatures, resetDemoData, scenarios } = useDemo();
  const { setStep } = useAppStore();

  const completedCount = completedScenarios.length;
  const exploredCount = exploredFeatures.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12"
    >
      {/* Hero */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-brand-900/40 border border-brand-800 rounded-full px-4 py-1.5 text-xs font-medium text-brand-300"
        >
          🎮 Demo Mode
        </motion.div>
        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-4xl sm:text-5xl font-bold text-white"
        >
          Explore Spotify Ad Curator
        </motion.h1>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-400 max-w-2xl mx-auto"
        >
          Guided tours, sample data, and interactive demos for all 10 feature modules.
          No account or API keys needed.
        </motion.p>

        {/* Quick stats */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex items-center justify-center flex-wrap gap-3 pt-2"
        >
          <div className="flex items-center gap-2 bg-surface-elevated border border-surface-border rounded-xl px-4 py-2.5">
            <span className="text-2xl font-bold text-brand-400">{exploredCount}</span>
            <span className="text-sm text-gray-400">features explored</span>
          </div>
          <div className="flex items-center gap-2 bg-surface-elevated border border-surface-border rounded-xl px-4 py-2.5">
            <span className="text-2xl font-bold text-brand-400">{completedCount}</span>
            <span className="text-sm text-gray-400">tours completed</span>
          </div>
          <div className="flex items-center gap-2 bg-surface-elevated border border-surface-border rounded-xl px-4 py-2.5">
            <span className="text-2xl font-bold text-brand-400">{scenarios.length}</span>
            <span className="text-sm text-gray-400">scenarios available</span>
          </div>
        </motion.div>

        {/* Demo mode toggle CTA */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-3 pt-1"
        >
          {!isDemoMode ? (
            <button
              onClick={toggleDemoMode}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm rounded-xl transition-colors"
            >
              🎭 Enable Demo Mode
            </button>
          ) : (
            <Badge variant="green" className="text-sm px-4 py-1.5">
              ✓ Demo Mode Active — Sample data loaded
            </Badge>
          )}
          <button
            onClick={() => setStep('landing')}
            className="px-5 py-2.5 text-sm font-medium text-gray-400 border border-surface-border rounded-xl hover:bg-surface-elevated hover:text-white transition-colors"
          >
            Go to App →
          </button>
        </motion.div>
      </div>

      {/* Scenarios */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <ScenarioSelector onStart={() => setStep('landing')} />
      </motion.section>

      {/* Feature Showcase */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <FeatureShowcase />
      </motion.section>

      {/* Reset */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="flex justify-center pt-4 pb-8"
      >
        <button
          onClick={resetDemoData}
          className="text-xs text-gray-600 hover:text-red-400 border border-surface-border hover:border-red-900 px-4 py-2 rounded-lg transition-colors"
        >
          ↺ Reset Demo Data
        </button>
      </motion.div>
    </motion.div>
  );
};
