// ===================================================
// AICopyGenerator — Main AI copy generation UI
// ===================================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAICopy } from '../../hooks/useAICopy';
import { ToneSelector } from './ToneSelector';
import { CopyVariantCard } from './CopyVariantCard';
import { Button } from '../ui/Button';
import { Card, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { CopyTone, AdPlatformType, AICopyVariant } from '../../services/ai-copy/types';
import { PLATFORM_LABELS } from '../../services/ai-copy/types';
import { copyToClipboard } from '../../utils/helpers';

const PLATFORMS: { id: AdPlatformType; label: string }[] = [
  { id: 'meta',           label: '📘 Meta' },
  { id: 'tiktok',         label: '📱 TikTok' },
  { id: 'youtube',        label: '📺 YouTube' },
  { id: 'google-search',  label: '🔍 Google Search' },
  { id: 'google-display', label: '🖼️ Google Display' },
];

interface AICopyGeneratorProps {
  /** Pre-select a platform tab (e.g. from the parent ad tab) */
  defaultPlatform?: AdPlatformType;
}

export const AICopyGenerator = ({ defaultPlatform = 'meta' }: AICopyGeneratorProps) => {
  const { copyResponse, isLoading, generate, regenerate, updateVariant } = useAICopy();
  const [platform, setPlatform] = useState<AdPlatformType>(defaultPlatform);
  const [tone,     setTone]     = useState<CopyTone>('casual');

  const hasApiKey = Boolean(import.meta.env.VITE_OPENAI_API_KEY);

  const handleGenerate = () => generate(platform, tone);
  const handleRegenerate = () => regenerate(platform, tone);

  const handleUseVariant = async (variant: AICopyVariant) => {
    const text = [
      `PRIMARY TEXT:\n${variant.primaryText}`,
      `HEADLINE: ${variant.headline}`,
      `DESCRIPTION: ${variant.description}`,
      `CTA: ${variant.cta}`,
    ].join('\n\n');
    const ok = await copyToClipboard(text);
    if (ok) toast.success('Copy applied to clipboard! Ready to paste into your campaign 🎉');
    else toast.error('Copy failed');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">🤖 AI Copy Generator</h2>
          <p className="text-sm text-gray-400 mt-1">
            Generate 5 unique ad copy variants powered by{' '}
            {hasApiKey ? 'OpenAI GPT' : 'smart templates'}.
          </p>
        </div>
        {!hasApiKey && (
          <Badge variant="yellow">Demo Mode — No API Key</Badge>
        )}
        {hasApiKey && (
          <Badge variant="green">✨ AI Powered</Badge>
        )}
      </div>

      {/* Config panel */}
      <Card elevated>
        <CardHeader
          title="Configure Generation"
          subtitle="Select the platform and tone for your ad copy"
          icon={<span>⚙️</span>}
        />

        {/* Platform selector */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-300 mb-3">Target Platform</p>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`px-3 py-1.5 rounded-xl border text-sm font-medium transition-all ${
                  platform === p.id
                    ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-900/30'
                    : 'bg-surface border-surface-border text-gray-400 hover:text-white hover:border-brand-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tone selector */}
        <ToneSelector value={tone} onChange={setTone} disabled={isLoading} />

        {/* Generate button */}
        <div className="mt-6 flex gap-3 flex-wrap">
          <Button
            onClick={handleGenerate}
            isLoading={isLoading}
            size="lg"
          >
            🤖 Generate 5 Variants
          </Button>
          {copyResponse && (
            <Button
              variant="secondary"
              onClick={handleRegenerate}
              isLoading={isLoading}
              size="lg"
            >
              🔄 Regenerate
            </Button>
          )}
        </div>

        {/* Loading state */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex items-center gap-3 text-sm text-gray-400"
          >
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-brand-500"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, delay: i * 0.15, repeat: Infinity }}
                />
              ))}
            </div>
            <span>Generating 5 unique variants for {PLATFORM_LABELS[platform]}…</span>
          </motion.div>
        )}
      </Card>

      {/* Results */}
      {copyResponse && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-bold text-white">
                {copyResponse.variants.length} Variants Generated
              </h3>
              <p className="text-sm text-gray-400 mt-0.5">
                Platform: {PLATFORM_LABELS[copyResponse.platform]} •{' '}
                Tone: <span className="capitalize">{copyResponse.tone}</span>
                {copyResponse.isDemo && ' • Demo mode'}
              </p>
            </div>
            <Badge variant={copyResponse.isDemo ? 'yellow' : 'green'}>
              {copyResponse.isDemo ? '📝 Template-based' : '✨ AI-generated'}
            </Badge>
          </div>

          <div className="space-y-4">
            {copyResponse.variants.map((variant, i) => (
              <CopyVariantCard
                key={variant.id}
                variant={variant}
                index={i}
                platform={copyResponse.platform}
                onUpdate={updateVariant}
                onUse={handleUseVariant}
                onRegenerate={() => handleRegenerate()}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {!copyResponse && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <p className="text-5xl mb-4">🤖</p>
          <h3 className="text-lg font-bold text-white mb-2">Ready to Generate</h3>
          <p className="text-gray-400 text-sm max-w-sm">
            Select a platform, choose your tone, and click "Generate 5 Variants" to get
            platform-native ad copy tailored to your playlist.
          </p>
        </motion.div>
      )}
    </div>
  );
};
