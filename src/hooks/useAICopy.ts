// ===================================================
// useAICopy — Custom hook for AI ad copy generation
// ===================================================

import { useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from '../store';
import { generateCopyForPlatform, invalidateCache } from '../services/ai-copy/generator';
import type { AICopyResponse, AICopyVariant, AdPlatformType, CopyTone, AICopyRequest } from '../services/ai-copy/types';

export const useAICopy = () => {
  const { analysis, targeting } = useAppStore();
  const [copyResponse, setCopyResponse]   = useState<AICopyResponse | null>(null);
  const [isLoading,     setIsLoading]     = useState(false);
  const [error,         setError]         = useState<string | null>(null);

  // Track current request so we can invalidate cache on regenerate
  const lastRequest = useRef<AICopyRequest | null>(null);

  const generate = useCallback(
    async (platform: AdPlatformType, tone: CopyTone) => {
      if (!analysis || !targeting) {
        toast.error('Please complete analysis and targeting first');
        return;
      }

      setIsLoading(true);
      setError(null);

      // Capture the request for potential cache invalidation
      lastRequest.current = {
        platform,
        genre:        analysis.topGenre,
        mood:         analysis.moodProfile.label.split(' ')[0] ?? 'Energetic',
        playlistName: analysis.playlist.name,
        trackCount:   analysis.playlist.trackCount,
        tone,
      };

      try {
        const response = await generateCopyForPlatform(platform, analysis, targeting, tone);
        setCopyResponse(response);
        if (response.isDemo) {
          toast.success('Copy generated! 🤖 (Demo mode — add VITE_OPENAI_API_KEY for AI variants)');
        } else {
          toast.success('AI copy generated! ✨');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to generate copy.';
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [analysis, targeting]
  );

  const regenerate = useCallback(
    async (platform: AdPlatformType, tone: CopyTone) => {
      // Bust the cache so we get fresh copy
      if (lastRequest.current) {
        invalidateCache(lastRequest.current);
      }
      await generate(platform, tone);
    },
    [generate]
  );

  const updateVariant = useCallback((variantId: string, updated: Partial<AICopyVariant>) => {
    setCopyResponse((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        variants: prev.variants.map((v) =>
          v.id === variantId
            ? {
                ...v,
                ...updated,
                charCounts: {
                  primaryText:  (updated.primaryText  ?? v.primaryText).length,
                  headline:     (updated.headline     ?? v.headline).length,
                  description:  (updated.description  ?? v.description).length,
                  cta:          (updated.cta          ?? v.cta).length,
                },
              }
            : v
        ),
      };
    });
  }, []);

  return {
    copyResponse,
    isLoading,
    error,
    generate,
    regenerate,
    updateVariant,
  };
};
