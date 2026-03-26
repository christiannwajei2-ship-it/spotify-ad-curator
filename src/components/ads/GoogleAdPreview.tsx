import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type {
  GoogleSearchCreativeTemplate,
  GoogleDisplayCreativeTemplate,
} from '../../services/google-ads/types';
import { Button, Badge } from '../ui';
import { copyToClipboard } from '../../utils/helpers';
import toast from 'react-hot-toast';

// ===================================================
// Search Ad Preview
// ===================================================

interface GoogleSearchAdPreviewProps {
  template: GoogleSearchCreativeTemplate;
  playlistName?: string;
}

export const GoogleSearchAdPreview = ({
  template,
  playlistName,
}: GoogleSearchAdPreviewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [headlines, setHeadlines] = useState(template.headlines);
  const [descriptions, setDescriptions] = useState(template.descriptions);
  const [showPreview, setShowPreview] = useState(false);

  const handleCopy = async () => {
    const content = [
      `HEADLINES (30 chars each):\n${headlines.map((h, i) => `  ${i + 1}. ${h}`).join('\n')}`,
      `\nDESCRIPTIONS (90 chars each):\n${descriptions.map((d, i) => `  ${i + 1}. ${d}`).join('\n')}`,
      `\nFINAL URL: ${template.finalUrl}`,
      template.displayPath ? `\nDISPLAY PATH: /${template.displayPath}` : '',
    ]
      .filter(Boolean)
      .join('\n');
    const ok = await copyToClipboard(content);
    if (ok) toast.success('Search ad copy copied! 📋');
    else toast.error('Copy failed — try manually selecting the text');
  };

  return (
    <div className="bg-surface-elevated rounded-2xl border border-surface-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
        <div>
          <h4 className="font-semibold text-white text-sm">{template.name}</h4>
          <div className="flex gap-1 mt-1 flex-wrap">
            <Badge variant="gray" className="text-xs">Search Ad</Badge>
            <Badge variant="purple" className="text-xs">Responsive</Badge>
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

      {/* Search result visual preview */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-surface-border overflow-hidden"
          >
            <div className="p-4 flex justify-center">
              <GoogleSearchResultMockup
                headlines={headlines}
                descriptions={descriptions}
                displayPath={template.displayPath}
                playlistName={playlistName ?? 'Your Playlist'}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editable fields */}
      <div className="p-5 space-y-4">
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            Headlines
            <span className="normal-case text-gray-600">— max 30 chars each</span>
          </label>
          <div className="space-y-2">
            {headlines.map((headline, i) => (
              isEditing ? (
                <input
                  key={i}
                  value={headline}
                  maxLength={30}
                  onChange={(e) => {
                    const updated = [...headlines];
                    updated[i] = e.target.value;
                    setHeadlines(updated);
                  }}
                  className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder={`Headline ${i + 1}`}
                />
              ) : (
                <p key={i} className="text-sm text-gray-300 leading-relaxed">
                  <span className="text-gray-500 text-xs mr-2">{i + 1}.</span>
                  {headline}
                </p>
              )
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            Descriptions
            <span className="normal-case text-gray-600">— max 90 chars each</span>
          </label>
          <div className="space-y-2">
            {descriptions.map((desc, i) => (
              isEditing ? (
                <textarea
                  key={i}
                  value={desc}
                  maxLength={90}
                  rows={2}
                  onChange={(e) => {
                    const updated = [...descriptions];
                    updated[i] = e.target.value;
                    setDescriptions(updated);
                  }}
                  className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              ) : (
                <p key={i} className="text-sm text-gray-300 leading-relaxed">
                  <span className="text-gray-500 text-xs mr-2">{i + 1}.</span>
                  {desc}
                </p>
              )
            ))}
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-surface-border p-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Final URL</p>
            <p className="text-sm text-brand-400 mt-0.5 font-mono truncate max-w-xs">{template.finalUrl}</p>
          </div>
          {template.displayPath && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Display Path</p>
              <p className="text-xs text-gray-300 mt-0.5 font-mono">/{template.displayPath}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ===================================================
// Display Ad Preview
// ===================================================

interface GoogleDisplayAdPreviewProps {
  template: GoogleDisplayCreativeTemplate;
  playlistImageUrl?: string;
  playlistName?: string;
}

export const GoogleDisplayAdPreview = ({
  template,
  playlistImageUrl,
  playlistName,
}: GoogleDisplayAdPreviewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [headlines, setHeadlines] = useState(template.headlines);
  const [longHeadline, setLongHeadline] = useState(template.longHeadline);
  const [descriptions, setDescriptions] = useState(template.descriptions);
  const [showPreview, setShowPreview] = useState(false);

  const handleCopy = async () => {
    const content = [
      `HEADLINES:\n${headlines.map((h, i) => `  ${i + 1}. ${h}`).join('\n')}`,
      `\nLONG HEADLINE:\n  ${longHeadline}`,
      `\nDESCRIPTIONS:\n${descriptions.map((d, i) => `  ${i + 1}. ${d}`).join('\n')}`,
      `\nBUSINESS NAME: ${template.businessName}`,
      `\nCTA: ${template.callToAction}`,
      `\nIMAGE SPECS:\n${template.imageSpecs.map((s) => `  ${s.label} — ${s.recommended}`).join('\n')}`,
    ].join('\n');
    const ok = await copyToClipboard(content);
    if (ok) toast.success('Display ad copy copied! 📋');
    else toast.error('Copy failed — try manually selecting the text');
  };

  return (
    <div className="bg-surface-elevated rounded-2xl border border-surface-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
        <div>
          <h4 className="font-semibold text-white text-sm">{template.name}</h4>
          <div className="flex gap-1 mt-1 flex-wrap">
            <Badge variant="gray" className="text-xs">Display Ad</Badge>
            <Badge variant="green" className="text-xs">Responsive</Badge>
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

      {/* Display banner mockup */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-surface-border overflow-hidden"
          >
            <div className="p-4 flex justify-center gap-6 flex-wrap">
              <GoogleDisplayBannerMockup
                headline={headlines[0] ?? ''}
                description={descriptions[0] ?? ''}
                imageUrl={playlistImageUrl}
                playlistName={playlistName ?? 'Your Playlist'}
                businessName={template.businessName}
                cta={template.callToAction}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editable fields */}
      <div className="p-5 space-y-4">
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            Short Headlines
            <span className="normal-case text-gray-600">— max 30 chars each</span>
          </label>
          <div className="space-y-2">
            {headlines.map((h, i) =>
              isEditing ? (
                <input
                  key={i}
                  value={h}
                  maxLength={30}
                  onChange={(e) => {
                    const updated = [...headlines];
                    updated[i] = e.target.value;
                    setHeadlines(updated);
                  }}
                  className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              ) : (
                <p key={i} className="text-sm text-gray-300 leading-relaxed">
                  <span className="text-gray-500 text-xs mr-2">{i + 1}.</span>
                  {h}
                </p>
              )
            )}
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            Long Headline
            <span className="normal-case text-gray-600">— max 90 chars</span>
          </label>
          {isEditing ? (
            <input
              value={longHeadline}
              maxLength={90}
              onChange={(e) => setLongHeadline(e.target.value)}
              className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          ) : (
            <p className="text-sm text-gray-300 leading-relaxed">{longHeadline}</p>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            Descriptions
            <span className="normal-case text-gray-600">— max 90 chars each</span>
          </label>
          <div className="space-y-2">
            {descriptions.map((d, i) =>
              isEditing ? (
                <textarea
                  key={i}
                  value={d}
                  maxLength={90}
                  rows={2}
                  onChange={(e) => {
                    const updated = [...descriptions];
                    updated[i] = e.target.value;
                    setDescriptions(updated);
                  }}
                  className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              ) : (
                <p key={i} className="text-sm text-gray-300 leading-relaxed">
                  <span className="text-gray-500 text-xs mr-2">{i + 1}.</span>
                  {d}
                </p>
              )
            )}
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-surface-border p-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Business Name</p>
            <p className="text-sm font-semibold text-white mt-0.5">{template.businessName}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">CTA Button</p>
            <p className="text-sm font-semibold text-white mt-0.5">🔍 {template.callToAction}</p>
          </div>
        </div>

        {/* Image specs */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Image Specs</p>
          <div className="grid grid-cols-2 gap-2">
            {template.imageSpecs.map((spec) => (
              <div key={spec.label} className="bg-surface rounded-lg border border-surface-border p-2.5">
                <p className="text-xs font-medium text-white">{spec.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{spec.recommended}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ===================================================
// Google Search Result Mockup
// ===================================================

interface GoogleSearchResultMockupProps {
  headlines: string[];
  descriptions: string[];
  displayPath?: string;
  playlistName: string;
}

const GoogleSearchResultMockup = ({
  headlines,
  descriptions,
  displayPath,
}: GoogleSearchResultMockupProps) => (
  <div
    className="w-full max-w-md bg-white rounded-xl overflow-hidden shadow-xl p-4"
    role="region"
    aria-label="Google Search Ad Preview"
  >
    {/* Google search bar mockup */}
    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
      <span className="text-2xl font-bold text-blue-600">G</span>
      <div className="flex-1 bg-gray-100 rounded-full px-3 py-1.5 text-xs text-gray-500 truncate">
        {headlines[0]?.toLowerCase() ?? 'search query'}
      </div>
    </div>

    {/* Ad label */}
    <div className="flex items-center gap-1.5 mb-1.5">
      <span className="bg-white border border-gray-400 text-gray-600 text-[9px] font-semibold px-1 py-0.5 rounded">
        Sponsored
      </span>
      <span className="text-green-700 text-[11px] truncate">
        open.spotify.com{displayPath ? `/${displayPath}` : '/playlist'}
      </span>
    </div>

    {/* Headline */}
    <p className="text-blue-700 font-semibold text-sm mb-1 line-clamp-2 leading-snug">
      {headlines.filter(Boolean).join(' | ')}
    </p>

    {/* Description */}
    <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
      {descriptions[0]}
    </p>
    {descriptions[1] && (
      <p className="text-gray-500 text-xs leading-relaxed mt-0.5 line-clamp-1">
        {descriptions[1]}
      </p>
    )}
  </div>
);

// ===================================================
// Google Display Banner Mockup (300×250)
// ===================================================

interface GoogleDisplayBannerMockupProps {
  headline: string;
  description: string;
  imageUrl?: string;
  playlistName: string;
  businessName: string;
  cta: string;
}

const GoogleDisplayBannerMockup = ({
  headline,
  description,
  imageUrl,
  playlistName,
  businessName,
  cta,
}: GoogleDisplayBannerMockupProps) => (
  <div
    className="relative w-56 overflow-hidden rounded-xl border border-gray-300 shadow-xl bg-white"
    style={{ aspectRatio: '300/250' }}
    role="region"
    aria-label="Google Display Ad Preview"
  >
    {/* Image area */}
    <div className="relative h-28 w-full bg-gradient-to-br from-green-900 via-gray-900 to-black overflow-hidden">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${playlistName} cover`}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl">🎵</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-2 left-2">
        <span className="bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">
          Ad · {businessName}
        </span>
      </div>
    </div>

    {/* Content area */}
    <div className="p-2.5">
      <p className="text-gray-900 font-bold text-[11px] line-clamp-1 mb-0.5">{headline}</p>
      <p className="text-gray-500 text-[9px] line-clamp-2 mb-2 leading-tight">{description}</p>
      <button className="w-full bg-blue-600 text-white text-[10px] font-bold py-1.5 rounded hover:bg-blue-700 transition-colors">
        {cta}
      </button>
    </div>
  </div>
);
