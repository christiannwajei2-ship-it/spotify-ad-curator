// ===================================================
// useReels — Custom hook for Reels/Shorts Templates
// ===================================================

import { useState, useCallback, useMemo } from 'react';
import type { PlaylistAnalysis } from '../types';
import type { VideoTemplate, TemplateOverrides } from '../services/reels/types';
import { TEMPLATE_LIBRARY, FREE_TEMPLATE_IDS } from '../services/reels/templates';
import {
  generateFromPlaylist,
  customizeTemplate,
  suggestTemplate,
} from '../services/reels/generator';
import {
  exportAsJSON,
  exportAsShotList,
  exportAsCSV,
  generateCapCutProject,
  generateFFmpegScript,
} from '../services/reels/export';
import { useAppStore } from '../store';
import { useSubscription } from './useSubscription';

export type ReelsExportFormat = 'json' | 'shot-list' | 'csv' | 'capcut' | 'ffmpeg';

// ===================================================
// Hook
// ===================================================

export const useReels = () => {
  const { analysis, isDemoMode } = useAppStore();
  const { currentTier } = useSubscription();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [customizedTemplate, setCustomizedTemplate] = useState<VideoTemplate | null>(null);
  const [generatedTemplate, setGeneratedTemplate] = useState<VideoTemplate | null>(null);

  // ── Feature-gating ────────────────────────────────

  const isPro = currentTier === 'pro' || currentTier === 'agency' || isDemoMode;

  const availableTemplates: VideoTemplate[] = useMemo(
    () =>
      isPro
        ? TEMPLATE_LIBRARY
        : TEMPLATE_LIBRARY.filter((t) => FREE_TEMPLATE_IDS.includes(t.id)),
    [isPro]
  );

  const templates = isDemoMode ? TEMPLATE_LIBRARY : availableTemplates;

  // ── Suggested templates ──────────────────────────

  const suggestedTemplates: VideoTemplate[] = useMemo(() => {
    if (!analysis) return templates.slice(0, 3);
    return suggestTemplate(analysis).filter((t) => templates.some((at) => at.id === t.id));
  }, [analysis, templates]);

  // ── Selected template ────────────────────────────

  const selectedTemplate: VideoTemplate | null = useMemo(() => {
    if (customizedTemplate) return customizedTemplate;
    if (generatedTemplate) return generatedTemplate;
    if (!selectedTemplateId) return null;
    return TEMPLATE_LIBRARY.find((t) => t.id === selectedTemplateId) ?? null;
  }, [selectedTemplateId, customizedTemplate, generatedTemplate]);

  // ── Actions ───────────────────────────────────────

  const selectTemplate = useCallback((id: string) => {
    setSelectedTemplateId(id);
    setCustomizedTemplate(null);
    setGeneratedTemplate(null);
  }, []);

  const customize = useCallback(
    (overrides: TemplateOverrides) => {
      const base = selectedTemplate ?? TEMPLATE_LIBRARY[0];
      setCustomizedTemplate(customizeTemplate(base, overrides));
    },
    [selectedTemplate]
  );

  const generateFromAnalysis = useCallback(
    (analysisData: PlaylistAnalysis) => {
      const base = selectedTemplate ?? suggestTemplate(analysisData)[0] ?? TEMPLATE_LIBRARY[0];
      const filled = generateFromPlaylist(analysisData, base);
      setGeneratedTemplate(filled);
    },
    [selectedTemplate]
  );

  const resetCustomization = useCallback(() => {
    setCustomizedTemplate(null);
    setGeneratedTemplate(null);
  }, []);

  // ── Export ────────────────────────────────────────

  const exportTemplate = useCallback(
    (format: ReelsExportFormat): string => {
      const template = selectedTemplate ?? TEMPLATE_LIBRARY[0];
      switch (format) {
        case 'json':
          return exportAsJSON(template);
        case 'shot-list':
          return exportAsShotList(template);
        case 'csv':
          return exportAsCSV(template);
        case 'capcut':
          return generateCapCutProject(template);
        case 'ffmpeg':
          return generateFFmpegScript(template);
        default:
          return exportAsJSON(template);
      }
    },
    [selectedTemplate]
  );

  // ── Auto-generate if analysis is available ────────

  const autoGenerateFromCurrentAnalysis = useCallback(() => {
    if (analysis) generateFromAnalysis(analysis);
  }, [analysis, generateFromAnalysis]);

  return {
    // State
    templates,
    suggestedTemplates,
    selectedTemplate,
    selectedTemplateId,
    isPro,

    // Actions
    selectTemplate,
    customizeTemplate: customize,
    resetCustomization,
    generateFromAnalysis,
    autoGenerateFromCurrentAnalysis,
    exportTemplate,
  };
};
