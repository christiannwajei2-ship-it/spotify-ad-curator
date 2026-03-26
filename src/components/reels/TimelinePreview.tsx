// ===================================================
// TimelinePreview — visual horizontal timeline
// ===================================================

import { motion } from 'framer-motion';
import type { VideoTemplate, TemplateSection } from '../../services/reels/types';

const SECTION_TYPE_COLORS: Record<string, string> = {
  intro: '#4f46e5',
  hook: '#dc2626',
  body: '#7c3aed',
  cta: '#16a34a',
  outro: '#374151',
};

interface TimelinePreviewProps {
  template: VideoTemplate;
  activeSectionId: string | null;
  onSectionClick: (section: TemplateSection) => void;
}

export const TimelinePreview = ({
  template,
  activeSectionId,
  onSectionClick,
}: TimelinePreviewProps) => {
  const totalMs = template.totalDurationMs;

  const formatTime = (ms: number): string => {
    const s = ms / 1000;
    return `${s.toFixed(1)}s`;
  };

  return (
    <div className="space-y-2">
      {/* Track bar */}
      <div className="relative h-10 flex rounded-lg overflow-hidden border border-surface-border">
        {template.sections.map((section) => {
          const pct = (section.durationMs / totalMs) * 100;
          const isActive = activeSectionId === section.id;
          const color = SECTION_TYPE_COLORS[section.type] ?? '#374151';

          return (
            <motion.button
              key={section.id}
              title={`${section.label} (${section.durationMs / 1000}s)`}
              whileHover={{ opacity: 0.9 }}
              onClick={() => onSectionClick(section)}
              className={`h-full flex items-center justify-center text-xs font-medium transition-all duration-200 overflow-hidden border-r border-black/20 last:border-r-0
                ${isActive ? 'ring-2 ring-white ring-inset' : ''}
              `}
              style={{ width: `${pct}%`, backgroundColor: color, minWidth: 8 }}
            >
              {pct > 10 && <span className="truncate px-1 text-white drop-shadow">{section.label}</span>}
            </motion.button>
          );
        })}
      </div>

      {/* Time markers */}
      <div className="relative h-5">
        {template.sections.map((section) => {
          const leftPct = (section.startMs / totalMs) * 100;
          return (
            <span
              key={section.id}
              className="absolute text-xs text-gray-500"
              style={{ left: `${leftPct}%` }}
            >
              {formatTime(section.startMs)}
            </span>
          );
        })}
        {/* End time */}
        <span className="absolute right-0 text-xs text-gray-500">
          {formatTime(totalMs)}
        </span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 pt-1">
        {Object.entries(SECTION_TYPE_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
            <span className="text-xs text-gray-400 capitalize">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
