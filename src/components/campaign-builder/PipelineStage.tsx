import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CampaignStep, PlatformCard, PlacedItem } from './types';

interface PipelineStageProps {
  stage: CampaignStep;
  onDrop: (stageId: string, card: PlatformCard) => void;
  onRemoveItem: (stageId: string, itemId: string) => void;
}

export const PipelineStage = ({ stage, onDrop, onRemoveItem }: PipelineStageProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const card: PlatformCard = JSON.parse(e.dataTransfer.getData('application/json'));
      onDrop(stage.id, card);
    } catch {
      // ignore invalid drops
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative rounded-xl border-2 transition-all duration-200 min-h-[120px] p-3 flex flex-col gap-2
        ${isDragOver
          ? 'border-brand-400 bg-brand-900/20 scale-[1.02]'
          : stage.completed
            ? 'border-green-700/50 bg-green-900/10'
            : 'border-surface-border bg-surface-elevated'
        }
      `}
    >
      {/* Stage header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{stage.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white truncate">{stage.label}</p>
          <p className="text-[10px] text-gray-500 truncate">{stage.description}</p>
        </div>
        {stage.completed && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-green-400 text-sm"
          >
            ✓
          </motion.span>
        )}
        {stage.required && !stage.completed && (
          <span className="text-[9px] font-medium text-amber-500 bg-amber-900/30 px-1.5 py-0.5 rounded-full shrink-0">
            Required
          </span>
        )}
      </div>

      {/* Drop zone */}
      {stage.items.length === 0 && (
        <div className={`flex-1 flex items-center justify-center rounded-lg border border-dashed py-4 transition-colors ${
          isDragOver ? 'border-brand-400 text-brand-400' : 'border-surface-border text-gray-600'
        }`}>
          <p className="text-xs text-center px-2">
            {isDragOver ? '📦 Drop here' : 'Drag a card here'}
          </p>
        </div>
      )}

      {/* Placed items */}
      <AnimatePresence>
        {stage.items.map((item: PlacedItem) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.8, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="flex items-center gap-2 bg-surface-card rounded-lg p-2 border border-surface-border group"
          >
            <span className="text-sm">{item.icon}</span>
            <span className="text-xs font-medium text-white flex-1 truncate">{item.label}</span>
            <button
              onClick={() => onRemoveItem(stage.id, item.id)}
              aria-label={`Remove ${item.label}`}
              className="w-5 h-5 rounded-full bg-red-900/40 text-red-400 hover:bg-red-800/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
