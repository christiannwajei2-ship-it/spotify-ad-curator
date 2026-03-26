import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { YouTubeCreativeTemplate } from '../../services/youtube-ads/types';
import { Button, Badge } from '../ui';
import { copyToClipboard } from '../../utils/helpers';
import toast from 'react-hot-toast';

interface YouTubeAdPreviewProps {
  template: YouTubeCreativeTemplate;
  playlistImageUrl?: string;
  playlistName?: string;
}

const FORMAT_LABELS: Record<string, string> = {
  INSTREAM_SKIPPABLE: 'In-stream (Skippable)',
  INFEED_VIDEO: 'In-feed Video',
  SHORTS: 'YouTube Shorts',
};

export const YouTubeAdPreview = ({
  template,
  playlistImageUrl,
  playlistName,
}: YouTubeAdPreviewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [headline, setHeadline] = useState(template.headline);
  const [longHeadline, setLongHeadline] = useState(template.longHeadline);
  const [description, setDescription] = useState(template.description);
  const [showPreview, setShowPreview] = useState(false);

  const handleCopy = async () => {
    const content = [
      `HEADLINE (30):\n${headline}`,
      `\nLONG HEADLINE (90):\n${longHeadline}`,
      `\nDESCRIPTION (90):\n${description}`,
      `\nCTA: ${template.callToAction}`,
      `\nFORMAT: ${FORMAT_LABELS[template.format] ?? template.format}`,
      `\nVIDEO SPECS:\n${template.videoSpecs.recommended}`,
    ].join('\n');
    const ok = await copyToClipboard(content);
    if (ok) toast.success('YouTube ad copy copied! 📋');
    else toast.error('Copy failed — try manually selecting the text');
  };

  const isShorts = template.format === 'SHORTS';

  return (
    <div className="bg-surface-elevated rounded-2xl border border-surface-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
        <div>
          <h4 className="font-semibold text-white text-sm">{template.name}</h4>
          <div className="flex gap-1 mt-1 flex-wrap">
            <Badge variant="gray" className="text-xs">
              {FORMAT_LABELS[template.format] ?? template.format}
            </Badge>
            <Badge variant="purple" className="text-xs">
              {isShorts ? '9:16' : '16:9'}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? 'Hide' : '👁 Preview'}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? '✓ Done' : '✏️ Edit'}
          </Button>
          <Button size="sm" variant="secondary" onClick={handleCopy}>
            📋 Copy
          </Button>
        </div>
      </div>

      {/* Visual preview */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-surface-border overflow-hidden"
          >
            <div className="p-4 flex justify-center gap-6 flex-wrap">
              {!isShorts && (
                <YouTubeInstreamPreview
                  headline={headline}
                  description={description}
                  imageUrl={playlistImageUrl}
                  playlistName={playlistName ?? 'Your Playlist'}
                  cta={template.callToAction}
                />
              )}
              {isShorts && (
                <YouTubeShortsPreview
                  longHeadline={longHeadline}
                  description={description}
                  imageUrl={playlistImageUrl}
                  playlistName={playlistName ?? 'Your Playlist'}
                  cta={template.callToAction}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editable fields */}
      <div className="p-5 space-y-4">
        <EditableField
          label="Headline"
          hint="max 30 chars"
          value={headline}
          isEditing={isEditing}
          maxLength={30}
          oneLine
          onChange={setHeadline}
        />
        <EditableField
          label="Long Headline"
          hint="max 90 chars"
          value={longHeadline}
          isEditing={isEditing}
          maxLength={90}
          oneLine
          onChange={setLongHeadline}
        />
        <EditableField
          label="Description"
          hint="max 90 chars"
          value={description}
          isEditing={isEditing}
          maxLength={90}
          onChange={setDescription}
        />

        <div className="bg-surface rounded-xl border border-surface-border p-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">CTA Button</p>
            <p className="text-sm font-semibold text-white mt-0.5">
              🎧 {template.callToAction.replace(/_/g, ' ')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Video Specs</p>
            <p className="text-xs text-gray-300 mt-0.5">{template.videoSpecs.recommended}</p>
          </div>
        </div>

        {template.videoSpecs.companionBanner && (
          <div className="bg-brand-900/20 border border-brand-800 rounded-xl p-3">
            <p className="text-xs text-brand-300">
              🖼️ <strong>Companion Banner:</strong> {template.videoSpecs.companionBanner}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ===================================================
// Shared editable field
// ===================================================

interface EditableFieldProps {
  label: string;
  hint?: string;
  value: string;
  isEditing: boolean;
  maxLength?: number;
  oneLine?: boolean;
  onChange: (v: string) => void;
}

const EditableField = ({
  label,
  hint,
  value,
  isEditing,
  maxLength,
  oneLine,
  onChange,
}: EditableFieldProps) => (
  <div>
    <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
      {label}
      {hint && <span className="normal-case text-gray-600">— {hint}</span>}
    </label>
    {isEditing ? (
      oneLine ? (
        <input
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      ) : (
        <textarea
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      )
    ) : (
      <p className="text-sm text-gray-300 leading-relaxed">{value}</p>
    )}
  </div>
);

// ===================================================
// YouTube In-stream preview (16:9 landscape browser mock)
// ===================================================

interface YouTubeInstreamPreviewProps {
  headline: string;
  description: string;
  imageUrl?: string;
  playlistName: string;
  cta: string;
}

const MAX_USERNAME_LENGTH = 18;

const YouTubeInstreamPreview = ({
  headline,
  description,
  imageUrl,
  playlistName,
  cta,
}: YouTubeInstreamPreviewProps) => (
  <div
    className="relative w-72 rounded-xl overflow-hidden border border-gray-700 shadow-2xl bg-black"
    style={{ aspectRatio: '16/9' }}
    role="region"
    aria-label="YouTube In-stream Ad Preview"
  >
    {/* Video background */}
    {imageUrl ? (
      <img
        src={imageUrl}
        alt="Playlist cover"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
    ) : (
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-gray-900 to-black" />
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

    {/* Skip ad button */}
    <div className="absolute top-2 right-2">
      <span className="bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
        Skip Ad ›
      </span>
    </div>

    {/* Ad indicator */}
    <div className="absolute top-2 left-2">
      <span className="bg-yellow-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded">
        Ad
      </span>
    </div>

    {/* Bottom bar */}
    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90">
      <p className="text-white font-bold text-[11px] mb-0.5 line-clamp-1">{headline}</p>
      <p className="text-gray-300 text-[10px] line-clamp-1 mb-2">{description}</p>
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-[9px]">{playlistName}</p>
        <button className="bg-white text-black text-[10px] font-bold px-2.5 py-1 rounded-sm">
          {cta.replace(/_/g, ' ')}
        </button>
      </div>
    </div>
  </div>
);

// ===================================================
// YouTube Shorts preview (9:16 vertical phone mock)
// ===================================================

interface YouTubeShortsPreviewProps {
  longHeadline: string;
  description: string;
  imageUrl?: string;
  playlistName: string;
  cta: string;
}

const YouTubeShortsPreview = ({
  longHeadline,
  description,
  imageUrl,
  playlistName,
  cta,
}: YouTubeShortsPreviewProps) => (
  <div
    className="relative w-44 rounded-[2rem] border-4 border-gray-700 overflow-hidden shadow-2xl bg-black"
    style={{ aspectRatio: '9/16' }}
    role="region"
    aria-label="YouTube Shorts Ad Preview"
  >
    {imageUrl ? (
      <img
        src={imageUrl}
        alt="Playlist cover"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />
    ) : (
      <div className="absolute inset-0 bg-gradient-to-b from-red-900 via-gray-900 to-black" />
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

    {/* Shorts logo */}
    <div className="absolute top-3 left-3 flex items-center gap-1">
      <span className="text-white text-[11px] font-bold">Shorts</span>
      <span className="bg-yellow-500 text-black text-[8px] font-bold px-1 py-0.5 rounded">
        Ad
      </span>
    </div>

    {/* Right side actions */}
    <div className="absolute right-2 bottom-24 flex flex-col items-center gap-3">
      {[{ icon: '👍', label: '8.4K' }, { icon: '💬', label: '231' }, { icon: '↗️', label: 'Share' }].map(
        ({ icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-0.5">
            <span className="text-xl">{icon}</span>
            <span className="text-white text-[9px] font-semibold">{label}</span>
          </div>
        )
      )}
    </div>

    {/* Bottom content */}
    <div className="absolute bottom-0 left-0 right-0 p-3 pb-4">
      <p className="text-white font-bold text-[10px] mb-0.5">@{playlistName.replace(/\s+/g, '').toLowerCase().slice(0, MAX_USERNAME_LENGTH)}</p>
      <p className="text-white text-[10px] leading-relaxed line-clamp-2 mb-2">{longHeadline}</p>
      <p className="text-gray-400 text-[9px] mb-2 line-clamp-1">{description}</p>
      <button className="w-full bg-white text-black text-[10px] font-bold py-1 rounded-sm">
        {cta.replace(/_/g, ' ')}
      </button>
    </div>
  </div>
);
