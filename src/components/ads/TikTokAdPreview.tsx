import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TikTokCreativeTemplate } from '../../services/tiktok-ads/types';
import { Button, Badge } from '../ui';
import { copyToClipboard } from '../../utils/helpers';
import toast from 'react-hot-toast';

interface TikTokAdPreviewProps {
  template: TikTokCreativeTemplate;
  playlistImageUrl?: string;
  playlistName?: string;
}

export const TikTokAdPreview = ({
  template,
  playlistImageUrl,
  playlistName,
}: TikTokAdPreviewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(template.primaryText);
  const [headline, setHeadline] = useState(template.headline);
  const [showPreview, setShowPreview] = useState(false);

  const handleCopy = async () => {
    const content = [
      `PRIMARY TEXT:\n${text}`,
      `\nHEADLINE:\n${headline}`,
      `\nCTA: ${template.callToAction}`,
      `\nHASHTAGS:\n${template.hashtags.join(' ')}`,
      `\nVIDEO SPECS:\n${template.videoSpecs.recommended}`,
    ].join('\n');
    const ok = await copyToClipboard(content);
    if (ok) toast.success('TikTok ad copy copied! 📋');
    else toast.error('Copy failed — try manually selecting the text');
  };

  const placementLabels: Record<string, string> = {
    PLACEMENT_TIKTOK: 'TikTok Feed',
    PLACEMENT_TOPVIEW: 'TopView',
    PLACEMENT_TIKTOK_STORY: 'TikTok Story',
  };

  return (
    <div className="bg-surface-elevated rounded-2xl border border-surface-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
        <div>
          <h4 className="font-semibold text-white text-sm">{template.name}</h4>
          <div className="flex gap-1 mt-1 flex-wrap">
            {template.placements.map((p) => (
              <Badge key={p} variant="gray" className="text-xs">
                {placementLabels[p] ?? p}
              </Badge>
            ))}
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

      {/* Phone frame preview */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-surface-border overflow-hidden"
          >
            <div className="p-4 flex justify-center">
              <TikTokPhonePreview
                text={text}
                headline={headline}
                imageUrl={playlistImageUrl}
                playlistName={playlistName ?? 'Your Playlist'}
                hashtags={template.hashtags}
                cta={template.callToAction}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editable content */}
      <div className="p-5 space-y-4">
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">
            Primary Text
          </label>
          {isEditing ? (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          ) : (
            <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{text}</p>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">
            Headline
          </label>
          {isEditing ? (
            <input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          ) : (
            <p className="text-sm text-gray-300">{headline}</p>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">
            Hashtags
          </label>
          <div className="flex flex-wrap gap-1.5">
            {template.hashtags.map((tag) => (
              <Badge key={tag} variant="purple" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

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
      </div>
    </div>
  );
};

const formatAsUsername = (name: string): string =>
  name.replace(/\s+/g, '').toLowerCase().slice(0, 20);

// ===================================================
// TikTok phone frame preview (vertical, dark UI)
// ===================================================

interface TikTokPhonePreviewProps {
  text: string;
  headline: string;
  imageUrl?: string;
  playlistName: string;
  hashtags: string[];
  cta: string;
}

const TikTokPhonePreview = ({
  text,
  headline,
  imageUrl,
  playlistName,
  hashtags,
  cta,
}: TikTokPhonePreviewProps) => (
  <div
    className="relative w-56 rounded-[2.5rem] border-4 border-gray-700 overflow-hidden shadow-2xl bg-black"
    style={{ aspectRatio: '9/16' }}
    role="region"
    aria-label="TikTok Ad Preview"
  >
    {/* Background — playlist art or gradient */}
    {imageUrl ? (
      <img
        src={imageUrl}
        alt="Playlist cover"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />
    ) : (
      <div className="absolute inset-0 bg-gradient-to-b from-brand-900 via-brand-800 to-black" />
    )}

    {/* Dark overlay for readability */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

    {/* Sponsored badge */}
    <div className="absolute top-4 left-3">
      <span className="bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">
        Sponsored
      </span>
    </div>

    {/* Right-side action bar */}
    <div className="absolute right-2 bottom-28 flex flex-col items-center gap-4">
      {[
        { icon: '❤️', label: '14.2K' },
        { icon: '💬', label: '342' },
        { icon: '↗️', label: 'Share' },
      ].map(({ icon, label }) => (
        <div key={label} className="flex flex-col items-center gap-0.5">
          <span className="text-xl">{icon}</span>
          <span className="text-white text-[9px] font-semibold">{label}</span>
        </div>
      ))}
    </div>

    {/* Bottom content */}
    <div className="absolute bottom-0 left-0 right-0 p-3 pb-4">
      {/* Account name */}
      <p className="text-white font-bold text-xs mb-1">@{formatAsUsername(playlistName)}</p>

      {/* Caption */}
      <p className="text-white text-[10px] leading-relaxed line-clamp-3 mb-1.5">{text}</p>

      {/* Hashtags */}
      <p className="text-white/70 text-[10px] mb-2">
        {hashtags.slice(0, 3).join(' ')}
      </p>

      {/* CTA button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-[10px]">
            🎵
          </div>
          <p className="text-white text-[10px] font-semibold truncate w-24">{headline}</p>
        </div>
        <button className="bg-[#FE2C55] text-white text-[9px] font-bold px-2.5 py-1 rounded-md flex-shrink-0">
          {cta.replace(/_/g, ' ')}
        </button>
      </div>
    </div>
  </div>
);
