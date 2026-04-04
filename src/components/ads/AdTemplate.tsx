import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AdCreativeTemplate } from '../../types';
import { Button, Badge } from '../ui';
import { copyToClipboard } from '../../utils/helpers';
import toast from 'react-hot-toast';

interface AdTemplateProps {
  template: AdCreativeTemplate;
  playlistImageUrl?: string;
  playlistName?: string;
}

export const AdTemplate = ({ template, playlistImageUrl, playlistName }: AdTemplateProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(template.primaryText);
  const [headline, setHeadline] = useState(template.headline);
  const [showPreview, setShowPreview] = useState(false);

  const handleCopy = async () => {
    const content = `PRIMARY TEXT:\n${text}\n\nHEADLINE:\n${headline}\n\nDESCRIPTION:\n${template.description}\n\nCTA: ${template.callToAction}`;
    const ok = await copyToClipboard(content);
    if (ok) toast.success('Ad copy copied! 📋');
    else toast.error('Copy failed — try manually selecting the text');
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
                {p.replace(/_/g, ' ')}
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

      {/* Preview */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-surface-border overflow-hidden"
          >
            <div className="p-4 flex justify-center">
              <FacebookPreview
                text={text}
                headline={headline}
                description={template.description}
                imageUrl={playlistImageUrl}
                playlistName={playlistName ?? 'Your Playlist'}
                cta={template.callToAction}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Primary Text</label>
          {isEditing ? (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              className="w-full bg-surface border border-surface-border rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-600 resize-none"
            />
          ) : (
            <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{text}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Headline</label>
            {isEditing ? (
              <input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            ) : (
              <p className="text-sm font-semibold text-white">{headline}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Description</label>
            <p className="text-sm text-gray-300">{template.description}</p>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-surface-border p-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">CTA Button</p>
            <p className="text-sm font-semibold text-white mt-0.5">🎧 {template.callToAction}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Image Specs</p>
            <p className="text-xs text-gray-300 mt-0.5">{template.imageSpecs.recommended}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Facebook Feed Preview
interface FacebookPreviewProps {
  text: string;
  headline: string;
  description: string;
  imageUrl?: string;
  playlistName: string;
  cta: string;
}

const FacebookPreview = ({ text, headline, description, imageUrl, playlistName, cta }: FacebookPreviewProps) => (
  <article className="w-80 bg-white rounded-xl overflow-hidden shadow-2xl text-left" role="region" aria-label="Facebook Ad Preview">
    {/* Post header */}
    <div className="flex items-center gap-2.5 p-3">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white text-sm flex-shrink-0">
        🎵
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900 leading-tight">{playlistName}</p>
        <p className="text-xs text-gray-500">Sponsored ·</p>
      </div>
    </div>

    {/* Post text */}
    <p className="px-3 pb-2.5 text-xs text-gray-700 line-clamp-3 whitespace-pre-wrap">{text}</p>

    {/* Image */}
    {imageUrl ? (
      <img src={imageUrl} alt="Ad" className="w-full aspect-square object-cover" />
    ) : (
      <div className="w-full aspect-square bg-gradient-to-br from-brand-700 to-brand-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-4xl mb-2">🎵</div>
          <p className="text-sm font-semibold px-4 text-center">{headline}</p>
        </div>
      </div>
    )}

    {/* Link card */}
    <div className="border-t border-gray-200 flex items-center justify-between px-3 py-2.5 bg-gray-50">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 uppercase tracking-wide">open.spotify.com</p>
        <p className="text-sm font-semibold text-gray-900 truncate">{headline}</p>
        <p className="text-xs text-gray-500 truncate">{description}</p>
      </div>
      <button className="ml-3 flex-shrink-0 bg-gray-200 hover:bg-gray-300 text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors">
        {cta}
      </button>
    </div>

    {/* Engagement bar */}
    <div className="flex border-t border-gray-200">
      {['👍 Like', '💬 Comment', '↗️ Share'].map((action) => (
        <button key={action} className="flex-1 py-2.5 text-xs text-gray-500 hover:bg-gray-50 transition-colors font-medium">
          {action}
        </button>
      ))}
    </div>
  </article>
);
