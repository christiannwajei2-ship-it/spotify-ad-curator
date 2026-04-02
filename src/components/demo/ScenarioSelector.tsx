// ===================================================
// ScenarioSelector — Demo scenario picker
// ===================================================

import { motion } from 'framer-motion';
import type { DemoScenario } from '../../services/demo/types';
import { useDemo } from '../../hooks/useDemo';

const DIFFICULTY_COLORS: Record<DemoScenario['difficulty'], string> = {
  beginner: 'text-green-400 bg-green-900/30 border-green-800',
  intermediate: 'text-yellow-400 bg-yellow-900/30 border-yellow-800',
  advanced: 'text-red-400 bg-red-900/30 border-red-800',
};

interface ScenarioSelectorProps {
  onStart?: (scenarioId: string) => void;
}

export const ScenarioSelector = ({ onStart }: ScenarioSelectorProps) => {
  const { scenarios, completedScenarios, startScenario } = useDemo();

  const handleStart = (scenarioId: string) => {
    startScenario(scenarioId);
    onStart?.(scenarioId);
  };

  const completedCount = completedScenarios.length;
  const totalCount = scenarios.length;

  return (
    <div className="space-y-6">
      {/* Progress header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Demo Scenarios</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {completedCount} of {totalCount} completed
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-24 h-1.5 bg-surface-border rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
          <span>{Math.round((completedCount / totalCount) * 100)}%</span>
        </div>
      </div>

      {/* Scenario cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((scenario, i) => {
          const isDone = completedScenarios.includes(scenario.id);
          return (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`relative bg-surface-elevated border rounded-xl p-5 flex flex-col gap-3 transition-all duration-200 hover:border-brand-700 group
                ${isDone ? 'border-green-800/50' : 'border-surface-border'}`}
            >
              {/* Done badge */}
              {isDone && (
                <span className="absolute top-3 right-3 text-xs font-medium text-green-400 bg-green-900/30 border border-green-800 rounded-full px-2 py-0.5">
                  ✓ Done
                </span>
              )}

              <div className="flex items-start gap-3">
                <span className="text-3xl">{scenario.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm leading-tight">{scenario.name}</h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{scenario.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-medium border rounded-full px-2 py-0.5 ${DIFFICULTY_COLORS[scenario.difficulty]}`}>
                  {scenario.difficulty}
                </span>
                <span className="text-xs text-gray-500">
                  ⏱️ {scenario.estimatedMinutes} min
                </span>
                <span className="text-xs text-gray-600">
                  {scenario.steps.length} steps
                </span>
              </div>

              <button
                onClick={() => handleStart(scenario.id)}
                className={`mt-auto w-full py-2 text-xs font-semibold rounded-lg transition-colors duration-200
                  ${isDone
                    ? 'bg-green-900/20 text-green-400 border border-green-800 hover:bg-green-900/40'
                    : 'bg-brand-700 hover:bg-brand-600 text-white'
                  }`}
              >
                {isDone ? '↩ Replay Tour' : '▶ Start Tour'}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
