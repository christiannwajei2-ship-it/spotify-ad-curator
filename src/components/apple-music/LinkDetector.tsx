// ===================================================
// LinkDetector — Universal Spotify + Apple Music input
// ===================================================

import { useState, useCallback } from 'react';
import { detectLink } from '../../services/apple-music/parser';
import type { MusicPlatform } from '../../services/apple-music/types';
import { Input } from '../ui';

interface LinkDetectorProps {
  value: string;
  onChange: (url: string) => void;
  onSubmit: (url: string, platform: MusicPlatform) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const PLATFORM_META: Record<MusicPlatform, { icon: string; label: string; color: string }> = {
  spotify: { icon: '🎵', label: 'Spotify', color: 'text-green-400' },
  'apple-music': { icon: '🍎', label: 'Apple Music', color: 'text-pink-400' },
  unknown: { icon: '🔗', label: '', color: 'text-gray-400' },
};

export const LinkDetector = ({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  disabled = false,
  placeholder = 'Paste a Spotify or Apple Music link…',
  className = '',
}: LinkDetectorProps) => {
  const [detectedPlatform, setDetectedPlatform] = useState<MusicPlatform>('unknown');

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const url = e.target.value;
      onChange(url);
      if (url.trim()) {
        const { platform } = detectLink(url);
        setDetectedPlatform(platform);
      } else {
        setDetectedPlatform('unknown');
      }
    },
    [onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && value.trim()) {
      onSubmit(value, detectedPlatform);
    }
  };

  const meta = PLATFORM_META[detectedPlatform];
  const showBadge = detectedPlatform !== 'unknown' && value.trim().length > 0;

  return (
    <div className={`w-full ${className}`}>
      <Input
        placeholder={disabled ? '🎭 Demo mode — click Analyze to see it in action' : placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled || isLoading}
        leftIcon={<span>{showBadge ? meta.icon : '🔗'}</span>}
        rightElement={
          showBadge ? (
            <span className={`text-xs font-semibold px-3 py-1 rounded-lg ${meta.color} bg-surface-elevated`}>
              {meta.label}
            </span>
          ) : undefined
        }
        className="text-base py-4"
        aria-label="Music platform URL input"
      />
      {!disabled && showBadge && (
        <p className={`mt-1.5 text-xs ${meta.color}`}>
          {meta.icon} {meta.label} link detected
        </p>
      )}
    </div>
  );
};
