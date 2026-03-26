// ===================================================
// TemplateCard — individual template preview card
// ===================================================

import { motion } from 'framer-motion';
import type { VideoTemplate } from '../../services/reels/types';

// ===================================================
// Helpers
// ===================================================

const FORMAT_ICONS: Record<string, string> = {
  'tiktok-reel': '📱',
  'instagram-reel': '📸',
  'youtube-short': '▶️',
  story: '⭕',
  square: '⬛',
};

const CATEGORY_COLORS: Record<string, string> = {
  'new-release': 'bg-yellow-900/40 text-yellow-300 border-yellow-800',
  'playlist-promo': 'bg-green-900/40 text-green-300 border-green-800',
  'artist-spotlight': 'bg-purple-900/40 text-purple-300 border-purple-800',
  concert: 'bg-orange-900/40 text-orange-300 border-orange-800',
  'viral-trend': 'bg-pink-900/40 text-pink-300 border-pink-800',
  'behind-the-scenes': 'bg-blue-900/40 text-blue-300 border-blue-800',
};

const CATEGORY_LABELS: Record<string, string> = {
  'new-release': 'New Release',
  'playlist-promo': 'Playlist Promo',
  'artist-spotlight': 'Artist Spotlight',
  concert: 'Concert',
  'viral-trend': 'Viral Trend',
  'behind-the-scenes': 'Behind The Scenes',
};

// ===================================================
// Component
// ===================================================

interface TemplateCardProps {
  template: VideoTemplate;
  isSelected: boolean;
  isLocked: boolean;
  onSelect: () => void;
  onUse: () => void;
}

export const TemplateCard = ({
  template,
  isSelected,
  isLocked,
  onSelect,
  onUse,
}: TemplateCardProps) => {
  const durationSec = template.totalDurationMs / 1000;

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onClick={onSelect}
      className={`relative rounded-2xl border cursor-pointer transition-all duration-200 overflow-hidden
        ${isSelected
          ? 'border-brand-500 bg-brand-900/20 shadow-lg shadow-brand-900/30'
          : 'border-surface-border bg-surface-card hover:border-brand-700'
        }
        ${isLocked ? 'opacity-70' : ''}
      `}
    >
      {/* Color palette preview strip */}
      <div className="h-2 flex">
        {template.colorPalette.slice(0, 5).map((color, idx) => (
          <div
            key={idx}
            className="flex-1"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-white text-sm truncate">{template.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{template.description}</p>
          </div>
          {isLocked && (
            <span className="flex-shrink-0 text-xs bg-yellow-900/30 text-yellow-400 border border-yellow-800 rounded-md px-1.5 py-0.5">
              PRO
            </span>
          )}
        </div>

        {/* Category badge */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span
            className={`text-xs rounded-md px-2 py-0.5 border ${CATEGORY_COLORS[template.category] ?? 'bg-gray-800 text-gray-300 border-gray-700'}`}
          >
            {CATEGORY_LABELS[template.category] ?? template.category}
          </span>
          <span className="text-xs rounded-md px-2 py-0.5 bg-surface-elevated border border-surface-border text-gray-300">
            {durationSec}s
          </span>
        </div>

        {/* Platform icons */}
        <div className="flex gap-1 mb-3">
          {template.formats.map((fmt) => (
            <span key={fmt} title={fmt} className="text-sm">
              {FORMAT_ICONS[fmt] ?? '📹'}
            </span>
          ))}
        </div>

        {/* Mini timeline */}
        <div className="flex gap-0.5 h-4 rounded overflow-hidden mb-3">
          {template.sections.map((section) => {
            const pct = (section.durationMs / template.totalDurationMs) * 100;
            return (
              <div
                key={section.id}
                title={`${section.label} (${section.durationMs / 1000}s)`}
                className="flex items-center justify-center text-xs font-bold overflow-hidden"
                style={{
                  width: `${pct}%`,
                  backgroundColor: section.backgroundColorHex,
                  minWidth: 4,
                }}
              />
            );
          })}
        </div>

        {/* Section labels */}
        <div className="flex gap-0.5 mb-4">
          {template.sections.map((section) => {
            const pct = (section.durationMs / template.totalDurationMs) * 100;
            return (
              <div
                key={section.id}
                className="text-gray-600 text-xs truncate"
                style={{ width: `${pct}%`, minWidth: 0 }}
              >
                {section.label}
              </div>
            );
          })}
        </div>

        {/* Use button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={(e) => {
            e.stopPropagation();
            if (!isLocked) onUse();
          }}
          className={`w-full py-1.5 rounded-lg text-sm font-medium transition-colors duration-200
            ${isLocked
              ? 'bg-yellow-900/20 text-yellow-500 border border-yellow-800/50 cursor-not-allowed'
              : isSelected
                ? 'bg-brand-600 hover:bg-brand-500 text-white'
                : 'bg-surface-elevated hover:bg-surface-border text-gray-300 border border-surface-border'
            }`}
          disabled={isLocked}
        >
          {isLocked ? '🔒 Pro Only' : isSelected ? '✓ Selected' : 'Use This Template'}
        </motion.button>
      </div>
    </motion.div>
  );
};
