// ===================================================
// ToneSelector — Reusable tone picker component
// ===================================================

import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import type { CopyTone } from '../../services/ai-copy/types';
import { TONE_DESCRIPTIONS } from '../../services/ai-copy/types';

const TONE_ICONS: Record<CopyTone, string> = {
  professional: '👔',
  casual:       '😊',
  'gen-z':      '✌️',
  emotional:    '💜',
  hype:         '🔥',
  minimal:      '⚡',
};

const TONE_LABELS: Record<CopyTone, string> = {
  professional: 'Professional',
  casual:       'Casual',
  'gen-z':      'Gen-Z',
  emotional:    'Emotional',
  hype:         'Hype',
  minimal:      'Minimal',
};

const ALL_TONES: CopyTone[] = ['professional', 'casual', 'gen-z', 'emotional', 'hype', 'minimal'];

interface ToneSelectorProps {
  value: CopyTone;
  onChange: (tone: CopyTone) => void;
  disabled?: boolean;
}

export const ToneSelector = ({ value, onChange, disabled }: ToneSelectorProps) => (
  <div>
    <p className="text-sm font-medium text-gray-300 mb-3">Ad Tone</p>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {ALL_TONES.map((tone) => (
        <motion.button
          key={tone}
          whileHover={{ scale: disabled ? 1 : 1.02 }}
          whileTap={{ scale: disabled ? 1 : 0.97 }}
          disabled={disabled}
          onClick={() => onChange(tone)}
          className={clsx(
            'flex flex-col items-start px-3 py-2.5 rounded-xl border text-left transition-all text-sm',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            value === tone
              ? 'bg-brand-900/50 border-brand-500 text-white shadow-lg shadow-brand-900/30'
              : 'bg-surface border-surface-border text-gray-400 hover:text-white hover:border-brand-700'
          )}
        >
          <span className="text-base mb-0.5">{TONE_ICONS[tone]}</span>
          <span className="font-medium text-inherit">{TONE_LABELS[tone]}</span>
          <span className="text-xs text-gray-500 mt-0.5 leading-tight">{TONE_DESCRIPTIONS[tone]}</span>
        </motion.button>
      ))}
    </div>
  </div>
);
