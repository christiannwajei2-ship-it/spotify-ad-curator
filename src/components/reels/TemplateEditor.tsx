// ===================================================
// TemplateEditor — section-by-section template editor
// ===================================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { VideoTemplate, TemplateSection, TextOverlay, AnimationStyle } from '../../services/reels/types';
import { Button, Card, CardHeader } from '../ui';

const ANIMATION_STYLES: AnimationStyle[] = [
  'zoom-in', 'pan', 'ken-burns', 'shake', 'pulse', 'glitch', 'neon-glow',
];

const TEXT_ANIMATIONS: TextOverlay['animation'][] = ['fade', 'slide', 'bounce', 'typewriter'];

interface TemplateEditorProps {
  template: VideoTemplate;
  onChange: (updated: VideoTemplate) => void;
}

export const TemplateEditor = ({ template, onChange }: TemplateEditorProps) => {
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [activeOverlayIdx, setActiveOverlayIdx] = useState(0);

  const activeSection: TemplateSection = template.sections[activeSectionIdx];
  const activeOverlay: TextOverlay | undefined = activeSection?.textOverlays[activeOverlayIdx];

  // ── Helpers ───────────────────────────────────────

  const updateSection = (idx: number, patch: Partial<TemplateSection>) => {
    const sections = template.sections.map((s, i) => (i === idx ? { ...s, ...patch } : s));
    onChange({ ...template, sections });
  };

  const updateOverlay = (sIdx: number, oIdx: number, patch: Partial<TextOverlay>) => {
    const sections = template.sections.map((s, i) => {
      if (i !== sIdx) return s;
      const textOverlays = s.textOverlays.map((o, j) =>
        j === oIdx ? { ...o, ...patch } : o
      );
      return { ...s, textOverlays };
    });
    onChange({ ...template, sections });
  };

  const updateColorPalette = (idx: number, color: string) => {
    const palette = template.colorPalette.map((c, i) => (i === idx ? color : c));
    onChange({ ...template, colorPalette: palette });
  };

  if (!activeSection) return null;

  return (
    <div className="space-y-4">
      {/* Section Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {template.sections.map((section, idx) => (
          <button
            key={section.id}
            onClick={() => { setActiveSectionIdx(idx); setActiveOverlayIdx(0); }}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors duration-200
              ${activeSectionIdx === idx
                ? 'bg-brand-900/60 text-brand-300 border-brand-700'
                : 'bg-surface-elevated text-gray-400 border-surface-border hover:text-white'
              }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Section settings */}
      <Card elevated className="space-y-4">
        <CardHeader
          title={activeSection.label}
          subtitle="Section settings"
          icon={<span>🎬</span>}
        />

        {/* Background colour */}
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-400 w-32">Background</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={activeSection.backgroundColorHex}
              onChange={(e) => updateSection(activeSectionIdx, { backgroundColorHex: e.target.value })}
              className="w-9 h-9 rounded-lg border border-surface-border cursor-pointer bg-transparent"
            />
            <span className="text-xs text-gray-500 font-mono">{activeSection.backgroundColorHex}</span>
          </div>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-400 w-32">Duration</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={500}
              max={15000}
              step={500}
              value={activeSection.durationMs}
              onChange={(e) =>
                updateSection(activeSectionIdx, { durationMs: Number(e.target.value) })
              }
              className="w-32 accent-brand-500"
            />
            <span className="text-sm text-white w-12">{activeSection.durationMs / 1000}s</span>
          </div>
        </div>

        {/* Animation style */}
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-400 w-32">Animation</label>
          <select
            value={activeSection.animationStyle}
            onChange={(e) =>
              updateSection(activeSectionIdx, {
                animationStyle: e.target.value as AnimationStyle,
              })
            }
            className="bg-surface-elevated border border-surface-border text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-600"
          >
            {ANIMATION_STYLES.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Text Overlay Editor */}
      {activeSection.textOverlays.length > 0 && (
        <Card elevated className="space-y-4">
          <CardHeader
            title="Text Overlays"
            subtitle={`Section: ${activeSection.label}`}
            icon={<span>✍️</span>}
          />

          {/* Overlay tabs */}
          <div className="flex gap-1">
            {activeSection.textOverlays.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveOverlayIdx(idx)}
                className={`px-2.5 py-1 rounded-md text-xs border transition-colors duration-200
                  ${activeOverlayIdx === idx
                    ? 'bg-brand-900/60 text-brand-300 border-brand-700'
                    : 'bg-surface-elevated text-gray-400 border-surface-border'
                  }`}
              >
                Text {idx + 1}
              </button>
            ))}
          </div>

          {activeOverlay && (
            <motion.div key={`${activeSectionIdx}-${activeOverlayIdx}`} className="space-y-3"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Content */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Content</label>
                <input
                  type="text"
                  value={activeOverlay.content}
                  onChange={(e) =>
                    updateOverlay(activeSectionIdx, activeOverlayIdx, { content: e.target.value })
                  }
                  className="w-full bg-surface-elevated border border-surface-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-600"
                />
              </div>

              {/* Color + Animation row */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-400 block mb-1">Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={activeOverlay.color}
                      onChange={(e) =>
                        updateOverlay(activeSectionIdx, activeOverlayIdx, { color: e.target.value })
                      }
                      className="w-9 h-9 rounded-lg border border-surface-border cursor-pointer bg-transparent"
                    />
                    <span className="text-xs text-gray-500 font-mono">{activeOverlay.color}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-400 block mb-1">Animation</label>
                  <select
                    value={activeOverlay.animation}
                    onChange={(e) =>
                      updateOverlay(activeSectionIdx, activeOverlayIdx, {
                        animation: e.target.value as TextOverlay['animation'],
                      })
                    }
                    className="w-full bg-surface-elevated border border-surface-border text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-600"
                  >
                    {TEXT_ANIMATIONS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Bold / Italic */}
              <div className="flex gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeOverlay.bold ?? false}
                    onChange={(e) =>
                      updateOverlay(activeSectionIdx, activeOverlayIdx, { bold: e.target.checked })
                    }
                    className="accent-brand-500"
                  />
                  Bold
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeOverlay.italic ?? false}
                    onChange={(e) =>
                      updateOverlay(activeSectionIdx, activeOverlayIdx, { italic: e.target.checked })
                    }
                    className="accent-brand-500"
                  />
                  Italic
                </label>
              </div>
            </motion.div>
          )}
        </Card>
      )}

      {/* Color Palette */}
      <Card elevated>
        <CardHeader title="Color Palette" icon={<span>🎨</span>} />
        <div className="flex gap-2 flex-wrap mt-2">
          {template.colorPalette.map((color, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <input
                type="color"
                value={color}
                onChange={(e) => updateColorPalette(idx, e.target.value)}
                className="w-9 h-9 rounded-lg border border-surface-border cursor-pointer bg-transparent"
              />
              <span className="text-xs text-gray-600 font-mono">{color}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Reset button */}
      <Button variant="ghost" size="sm" onClick={() => onChange(template)}>
        Reset Changes
      </Button>
    </div>
  );
};
