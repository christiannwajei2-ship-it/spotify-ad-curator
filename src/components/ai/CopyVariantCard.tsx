// ===================================================
// CopyVariantCard — Individual ad copy variant display
// ===================================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import type { AICopyVariant, AdPlatformType } from '../../services/ai-copy/types';
import { PLATFORM_CHAR_LIMITS, PLATFORM_LABELS } from '../../services/ai-copy/types';
import { copyToClipboard } from '../../utils/helpers';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

// ===================================================
// Character count badge (green / yellow / red)
// ===================================================

const CharBadge = ({ count, max }: { count: number; max: number }) => {
  const ratio = count / max;
  const variant = ratio > 0.9 ? 'red' : ratio > 0.7 ? 'yellow' : 'green';
  return (
    <Badge variant={variant} className="ml-1 tabular-nums">
      {count}/{max}
    </Badge>
  );
};

// ===================================================
// Inline editable field
// ===================================================

interface EditableFieldProps {
  label: string;
  value: string;
  maxChars: number;
  multiline?: boolean;
  onChange: (v: string) => void;
}

const EditableField = ({ label, value, maxChars, multiline, onChange }: EditableFieldProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(value);

  const commit = () => {
    onChange(draft.slice(0, maxChars));
    setEditing(false);
  };

  return (
    <div className="mb-3">
      <div className="flex items-center gap-1 mb-1">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <CharBadge count={value.length} max={maxChars} />
      </div>
      {editing ? (
        <div>
          {multiline ? (
            <textarea
              autoFocus
              value={draft}
              maxLength={maxChars}
              rows={4}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              className="w-full bg-surface border border-brand-500 rounded-lg p-2 text-sm text-white resize-none focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          ) : (
            <input
              autoFocus
              value={draft}
              maxLength={maxChars}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }}
              className="w-full bg-surface border border-brand-500 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          )}
        </div>
      ) : (
        <p
          onClick={() => { setDraft(value); setEditing(true); }}
          className="text-sm text-gray-200 cursor-text hover:text-white whitespace-pre-wrap rounded-lg px-1 py-0.5 hover:bg-surface-elevated transition-colors"
          title="Click to edit"
        >
          {value}
        </p>
      )}
    </div>
  );
};

// ===================================================
// CopyVariantCard
// ===================================================

interface CopyVariantCardProps {
  variant: AICopyVariant;
  index: number;
  platform: AdPlatformType;
  onUpdate: (id: string, updated: Partial<AICopyVariant>) => void;
  onUse: (variant: AICopyVariant) => void;
  onRegenerate: (id: string) => void;
}

export const CopyVariantCard = ({
  variant,
  index,
  platform,
  onUpdate,
  onUse,
}: CopyVariantCardProps) => {
  const limits = PLATFORM_CHAR_LIMITS[platform];

  const handleCopyAll = async () => {
    const text = [
      `PRIMARY TEXT:\n${variant.primaryText}`,
      `HEADLINE: ${variant.headline}`,
      `DESCRIPTION: ${variant.description}`,
      `CTA: ${variant.cta}`,
    ].join('\n\n');
    const ok = await copyToClipboard(text);
    if (ok) toast.success('Variant copied! 📋');
    else toast.error('Copy failed');
  };

  const handleCopyField = async (field: string, value: string) => {
    const ok = await copyToClipboard(value);
    if (ok) toast.success(`${field} copied!`);
    else toast.error('Copy failed');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-surface-card rounded-2xl border border-surface-border p-5"
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-brand-400 bg-brand-900/40 border border-brand-800 rounded-full w-6 h-6 flex items-center justify-center">
            {index + 1}
          </span>
          <Badge variant="purple">{PLATFORM_LABELS[platform]}</Badge>
        </div>
        <div className="flex gap-1.5">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleCopyAll}
          >
            📋 Copy All
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => onUse(variant)}
          >
            ✅ Use This
          </Button>
        </div>
      </div>

      {/* Editable fields */}
      <EditableField
        label="Primary Text"
        value={variant.primaryText}
        maxChars={limits.primaryText}
        multiline
        onChange={(v) => onUpdate(variant.id, { primaryText: v })}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <EditableField
            label="Headline"
            value={variant.headline}
            maxChars={limits.headline}
            onChange={(v) => onUpdate(variant.id, { headline: v })}
          />
        </div>
        <div>
          <EditableField
            label="Description"
            value={variant.description}
            maxChars={limits.description}
            onChange={(v) => onUpdate(variant.id, { description: v })}
          />
        </div>
      </div>

      <div className="flex items-end justify-between mt-1">
        <EditableField
          label="CTA"
          value={variant.cta}
          maxChars={limits.cta}
          onChange={(v) => onUpdate(variant.id, { cta: v })}
        />
        <div className="flex gap-1 mb-3 ml-4">
          <button
            onClick={() => handleCopyField('CTA', variant.cta)}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            title="Copy CTA"
          >
            📋
          </button>
        </div>
      </div>
    </motion.div>
  );
};
