import { motion } from 'framer-motion';
import type { CampaignStep } from './types';

interface CampaignSummaryProps {
  stages: CampaignStep[];
  onLaunch: () => void;
  onEditStage: (stageId: string) => void;
}

export const CampaignSummary = ({ stages, onLaunch, onEditStage }: CampaignSummaryProps) => {
  const completedCount = stages.filter((s) => s.completed).length;
  const requiredCount = stages.filter((s) => s.required).length;
  const requiredCompleted = stages.filter((s) => s.required && s.completed).length;
  const allRequiredDone = requiredCompleted >= requiredCount;
  const progress = requiredCount > 0 ? Math.round((requiredCompleted / requiredCount) * 100) : 0;

  const allItems = stages.flatMap((s) => s.items.map((item) => ({ ...item, stageLabel: s.label })));
  const platforms = allItems.filter((i) => i.type === 'platform');
  const estimatedReach = platforms.length * 12500;
  const estimatedCost = platforms.length * 450;

  return (
    <div className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-surface-border">
        <h3 className="font-bold text-white text-sm">Campaign Summary</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          {completedCount}/{stages.length} stages configured
        </p>
      </div>

      {/* Progress bar */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-400">Completion</span>
          <span className="text-xs font-bold text-brand-400">{progress}%</span>
        </div>
        <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Stage checklist */}
      <div className="p-4 space-y-2">
        {stages.map((stage) => (
          <button
            key={stage.id}
            onClick={() => onEditStage(stage.id)}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-elevated transition-colors group text-left"
          >
            <span className={`text-sm w-6 text-center ${stage.completed ? 'text-green-400' : 'text-gray-600'}`}>
              {stage.completed ? '✓' : stage.icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium truncate ${stage.completed ? 'text-white' : 'text-gray-500'}`}>
                {stage.label}
              </p>
              {stage.items.length > 0 && (
                <p className="text-[10px] text-gray-600 truncate">
                  {stage.items.map((i) => i.label).join(', ')}
                </p>
              )}
            </div>
            <svg
              className="w-3 h-3 text-gray-600 group-hover:text-gray-400 shrink-0"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            >
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>

      {/* Estimates */}
      {platforms.length > 0 && (
        <div className="mx-4 mb-4 p-3 bg-surface-elevated rounded-xl border border-surface-border">
          <p className="text-xs font-semibold text-gray-400 mb-2">Estimates</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-500">Est. Reach</p>
              <p className="text-sm font-bold text-white">
                {estimatedReach.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Est. Budget</p>
              <p className="text-sm font-bold text-white">
                ${estimatedCost.toLocaleString()}/mo
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Platforms</p>
              <p className="text-sm font-bold text-white">{platforms.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <p className={`text-sm font-bold ${allRequiredDone ? 'text-green-400' : 'text-amber-400'}`}>
                {allRequiredDone ? 'Ready' : 'Incomplete'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Launch button */}
      <div className="p-4 pt-0">
        <motion.button
          onClick={onLaunch}
          disabled={!allRequiredDone}
          whileHover={allRequiredDone ? { scale: 1.02 } : {}}
          whileTap={allRequiredDone ? { scale: 0.98 } : {}}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200
            ${allRequiredDone
              ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-900/30 hover:from-brand-500 hover:to-brand-400'
              : 'bg-surface-elevated text-gray-600 cursor-not-allowed'
            }`}
        >
          {allRequiredDone ? '🚀 Launch Campaign' : `Complete ${requiredCount - requiredCompleted} more required stage${requiredCount - requiredCompleted !== 1 ? 's' : ''}`}
        </motion.button>
      </div>
    </div>
  );
};
