// ===================================================
// TemplateGallery — grid browser with filters
// ===================================================

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { VideoTemplate, VideoFormat, TemplateCategory } from '../../services/reels/types';
import { TemplateCard } from './TemplateCard';

interface TemplateGalleryProps {
  templates: VideoTemplate[];
  selectedTemplateId: string | null;
  lockedTemplateIds: string[];
  onSelect: (id: string) => void;
  onUse: (id: string) => void;
}

const PLATFORM_OPTIONS: { value: VideoFormat | 'all'; label: string }[] = [
  { value: 'all', label: 'All Platforms' },
  { value: 'tiktok-reel', label: 'TikTok' },
  { value: 'instagram-reel', label: 'Instagram' },
  { value: 'youtube-short', label: 'YouTube Shorts' },
  { value: 'story', label: 'Story' },
];

const DURATION_OPTIONS: { value: number | 0; label: string }[] = [
  { value: 0, label: 'Any Duration' },
  { value: 10, label: '≤ 10s' },
  { value: 15, label: '≤ 15s' },
  { value: 20, label: '≤ 20s' },
  { value: 30, label: '≤ 30s' },
];

const CATEGORY_OPTIONS: { value: TemplateCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'new-release', label: 'New Release' },
  { value: 'playlist-promo', label: 'Playlist Promo' },
  { value: 'artist-spotlight', label: 'Artist Spotlight' },
  { value: 'concert', label: 'Concert' },
  { value: 'viral-trend', label: 'Viral Trend' },
  { value: 'behind-the-scenes', label: 'Behind The Scenes' },
];

export const TemplateGallery = ({
  templates,
  selectedTemplateId,
  lockedTemplateIds,
  onSelect,
  onUse,
}: TemplateGalleryProps) => {
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState<VideoFormat | 'all'>('all');
  const [durationFilter, setDurationFilter] = useState<number>(0);
  const [categoryFilter, setCategoryFilter] = useState<TemplateCategory | 'all'>('all');

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (platformFilter !== 'all' && !t.formats.includes(platformFilter)) return false;
      if (durationFilter > 0 && t.totalDurationMs / 1000 > durationFilter) return false;
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
      return true;
    });
  }, [templates, search, platformFilter, durationFilter, categoryFilter]);

  const filterBtnClass = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors duration-200 ${
      active
        ? 'bg-brand-900/60 text-brand-300 border-brand-700'
        : 'bg-surface-elevated text-gray-400 border-surface-border hover:text-white'
    }`;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Search templates…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-surface-elevated border border-surface-border rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-600"
        />
      </div>

      {/* Platform filter */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Platform</p>
        <div className="flex flex-wrap gap-1.5">
          {PLATFORM_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPlatformFilter(opt.value as VideoFormat | 'all')}
              className={filterBtnClass(platformFilter === opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Duration filter */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Duration</p>
        <div className="flex flex-wrap gap-1.5">
          {DURATION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDurationFilter(opt.value)}
              className={filterBtnClass(durationFilter === opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Category</p>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setCategoryFilter(opt.value as TemplateCategory | 'all')}
              className={filterBtnClass(categoryFilter === opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-500">
        {filtered.length} template{filtered.length !== 1 ? 's' : ''} found
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-3xl mb-2">🎬</p>
          <p className="text-sm">No templates match your filters.</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filtered.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplateId === template.id}
              isLocked={lockedTemplateIds.includes(template.id)}
              onSelect={() => onSelect(template.id)}
              onUse={() => onUse(template.id)}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};
