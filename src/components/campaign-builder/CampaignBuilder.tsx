import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { DraggableCard } from './DraggableCard';
import { PipelineStage } from './PipelineStage';
import { CampaignSummary } from './CampaignSummary';
import type { CampaignStep, PlatformCard, PlacedItem } from './types';

const availableCards: PlatformCard[] = [
  { id: 'meta', label: 'Meta Ads', icon: '📘', color: 'bg-blue-900/50', type: 'platform', description: 'Facebook & Instagram ads' },
  { id: 'tiktok', label: 'TikTok Ads', icon: '🎵', color: 'bg-pink-900/50', type: 'platform', description: 'Short-form video ads' },
  { id: 'youtube', label: 'YouTube Ads', icon: '📺', color: 'bg-red-900/50', type: 'platform', description: 'Pre-roll & display ads' },
  { id: 'google', label: 'Google Ads', icon: '🔍', color: 'bg-yellow-900/50', type: 'platform', description: 'Search & display network' },
  { id: 'spotify', label: 'Spotify Ads', icon: '🎧', color: 'bg-green-900/50', type: 'platform', description: 'Audio & sponsored content' },
  { id: 'ai-copy', label: 'AI Copy', icon: '🤖', color: 'bg-purple-900/50', type: 'action', description: 'Generate ad copy with AI' },
  { id: 'a-b-test', label: 'A/B Test', icon: '⚗️', color: 'bg-indigo-900/50', type: 'action', description: 'Split test creatives' },
  { id: 'audience', label: 'Audience', icon: '👥', color: 'bg-cyan-900/50', type: 'action', description: 'Target audience segment' },
];

const defaultStages: CampaignStep[] = [
  { id: 'source', label: 'Source', description: 'Pick your music source', icon: '🎵', required: true, completed: false, items: [] },
  { id: 'analysis', label: 'Analysis', description: 'Analyze audience data', icon: '📊', required: true, completed: false, items: [] },
  { id: 'platforms', label: 'Platforms', description: 'Select ad platforms', icon: '📢', required: true, completed: false, items: [] },
  { id: 'creative', label: 'Creative', description: 'Add ad formats', icon: '🎨', required: false, completed: false, items: [] },
  { id: 'schedule', label: 'Schedule', description: 'Set campaign timing', icon: '⏰', required: false, completed: false, items: [] },
  { id: 'launch', label: 'Launch', description: 'Review and go live', icon: '🚀', required: false, completed: false, items: [] },
];

interface CampaignBuilderProps {
  onLaunch?: () => void;
}

export const CampaignBuilder = ({ onLaunch }: CampaignBuilderProps) => {
  const [stages, setStages] = useState<CampaignStep[]>(defaultStages);
  const [activeCard, setActiveCard] = useState<PlatformCard | null>(null);
  const [launched, setLaunched] = useState(false);

  const handleDrop = useCallback((stageId: string, card: PlatformCard) => {
    setStages((prev) =>
      prev.map((stage) => {
        if (stage.id !== stageId) return stage;
        // Avoid duplicates
        if (stage.items.some((i) => i.id === card.id)) return stage;
        const newItem: PlacedItem = {
          id: card.id,
          type: card.type,
          label: card.label,
          icon: card.icon,
          color: card.color,
        };
        const items = [...stage.items, newItem];
        return { ...stage, items, completed: items.length > 0 };
      })
    );
  }, []);

  const handleRemoveItem = useCallback((stageId: string, itemId: string) => {
    setStages((prev) =>
      prev.map((stage) => {
        if (stage.id !== stageId) return stage;
        const items = stage.items.filter((i) => i.id !== itemId);
        return { ...stage, items, completed: items.length > 0 };
      })
    );
  }, []);

  const handleLaunch = () => {
    setLaunched(true);
    onLaunch?.();
  };

  const handleEditStage = (stageId: string) => {
    const el = document.getElementById(`stage-${stageId}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleReset = () => {
    setStages(defaultStages);
    setLaunched(false);
  };

  if (launched) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 px-4 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
          className="text-7xl mb-6"
        >
          🚀
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Campaign Launched!</h2>
        <p className="text-gray-400 mb-8 max-w-sm">
          Your campaign is now live. We'll send you analytics updates as your ads start running.
        </p>
        <button
          onClick={handleReset}
          className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-colors"
        >
          Build Another Campaign
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left: Available cards */}
      <div className="lg:w-64 shrink-0">
        <div className="bg-surface-card rounded-2xl border border-surface-border p-4 lg:sticky lg:top-20">
          <h3 className="font-bold text-white text-sm mb-1">Available Platforms</h3>
          <p className="text-xs text-gray-500 mb-4">Drag cards into the pipeline stages →</p>
          <div className="space-y-2">
            {availableCards.map((card) => (
              <DraggableCard
                key={card.id}
                card={card}
                onDragStart={setActiveCard}
              />
            ))}
          </div>
          {activeCard && (
            <p className="mt-3 text-xs text-brand-400 text-center animate-pulse">
              Dragging: {activeCard.icon} {activeCard.label}
            </p>
          )}
        </div>
      </div>

      {/* Center: Pipeline stages */}
      <div className="flex-1 min-w-0">
        <div className="bg-surface-card rounded-2xl border border-surface-border p-4">
          <div className="flex items-center gap-3 mb-5">
            <div>
              <h3 className="font-bold text-white">Campaign Pipeline</h3>
              <p className="text-xs text-gray-500">Build your campaign flow stage by stage</p>
            </div>
          </div>

          {/* Mobile: vertical, Desktop: responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {stages.map((stage, index) => (
              <div key={stage.id} id={`stage-${stage.id}`} className="relative">
                {/* Arrow between stages (desktop) */}
                {index < stages.length - 1 && (
                  <div className="hidden xl:flex absolute -right-1.5 top-1/2 -translate-y-1/2 z-10 items-center">
                    <div className="w-3 h-3 bg-surface-border rounded-full" />
                  </div>
                )}
                <PipelineStage
                  stage={stage}
                  onDrop={handleDrop}
                  onRemoveItem={handleRemoveItem}
                />
              </div>
            ))}
          </div>

          {/* Reset button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleReset}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-surface-elevated"
            >
              Reset Pipeline
            </button>
          </div>
        </div>
      </div>

      {/* Right: Summary (hidden on small screens, shown as sticky sidebar on lg+) */}
      <div className="lg:w-64 shrink-0">
        <div className="lg:sticky lg:top-20">
          <CampaignSummary
            stages={stages}
            onLaunch={handleLaunch}
            onEditStage={handleEditStage}
          />
        </div>
      </div>
    </div>
  );
};
