// ===================================================
// ReelsStudio — Full Reels/Shorts Studio Page
// ===================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store';
import { useReels } from '../hooks/useReels';
import { useSubscription } from '../hooks/useSubscription';
import { TEMPLATE_LIBRARY, FREE_TEMPLATE_IDS } from '../services/reels/templates';
import { TemplateGallery } from '../components/reels/TemplateGallery';
import { TemplateEditor } from '../components/reels/TemplateEditor';
import { TimelinePreview } from '../components/reels/TimelinePreview';
import { VideoPreview } from '../components/reels/VideoPreview';
import { ShotListExport } from '../components/reels/ShotListExport';
import { UpgradeModal } from '../components/payments/UpgradeModal';
import { Card, CardHeader, Button, Badge } from '../components/ui';
import type { VideoTemplate, TemplateSection } from '../services/reels/types';
import type { TemplateOverrides } from '../services/reels/types';
import toast from 'react-hot-toast';

type StudioTab = 'gallery' | 'editor' | 'preview' | 'export';

export const ReelsStudio = () => {
  const { analysis, isDemoMode, setStep } = useAppStore();
  const { upgradeModal, openUpgradeModal, closeUpgradeModal, checkout, isLoading: checkoutLoading } = useSubscription();

  const {
    templates,
    suggestedTemplates,
    selectedTemplate,
    selectedTemplateId,
    isPro,
    selectTemplate,
    customizeTemplate,
    resetCustomization,
    autoGenerateFromCurrentAnalysis,
  } = useReels();

  const [activeTab, setActiveTab] = useState<StudioTab>('gallery');
  const [editableTemplate, setEditableTemplate] = useState<VideoTemplate | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  // Which templates are locked for this user
  const lockedTemplateIds = isPro
    ? []
    : TEMPLATE_LIBRARY.filter((t) => !FREE_TEMPLATE_IDS.includes(t.id)).map((t) => t.id);

  // The template shown in editor/preview/export
  const displayTemplate = editableTemplate ?? selectedTemplate;

  const handleUseTemplate = (id: string) => {
    const template = TEMPLATE_LIBRARY.find((t) => t.id === id);
    if (!template) return;
    if (template.isPro && !isPro) {
      openUpgradeModal('tiktok'); // reuse upgrade modal
      return;
    }
    selectTemplate(id);
    setEditableTemplate(null);
    setActiveTab('editor');
    toast.success(`"${template.name}" loaded — customize it below!`);
  };

  const handleSelectTemplate = (id: string) => {
    selectTemplate(id);
    setEditableTemplate(null);
  };

  const handleTemplateChange = (updated: VideoTemplate) => {
    setEditableTemplate(updated);
    const overrides: TemplateOverrides = {
      colorPalette: updated.colorPalette,
      sections: updated.sections,
    };
    customizeTemplate(overrides);
  };

  const handleAutoGenerate = () => {
    if (!analysis) {
      toast.error('Analyze a playlist first to auto-generate!');
      return;
    }
    autoGenerateFromCurrentAnalysis();
    toast.success('Template filled with your playlist data!');
  };

  const handleSectionClick = (section: TemplateSection) => {
    setActiveSectionId(section.id);
    setActiveTab('editor');
  };

  const tabs: { id: StudioTab; label: string; icon: string }[] = [
    { id: 'gallery', label: 'Templates', icon: '🎬' },
    { id: 'editor', label: 'Editor', icon: '✏️' },
    { id: 'preview', label: 'Preview', icon: '📱' },
    { id: 'export', label: 'Export', icon: '📤' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6"
    >
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">🎬 Reels Studio</h1>
            {isDemoMode && (
              <Badge variant="yellow" className="text-xs">Demo</Badge>
            )}
            {!isPro && (
              <Badge variant="gray" className="text-xs bg-purple-900/40 text-purple-300 border-purple-800">
                Free — 2 templates
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-400">
            Create scroll-stopping TikTok Reels, Instagram Reels &amp; YouTube Shorts for your music campaigns.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {analysis && (
            <Button size="sm" variant="secondary" onClick={handleAutoGenerate}>
              ✨ Auto-Fill from Playlist
            </Button>
          )}
          {!isPro && !isDemoMode && (
            <Button size="sm" onClick={() => setStep('pricing')}>
              🔓 Unlock All Templates
            </Button>
          )}
        </div>
      </div>

      {/* Suggested templates strip */}
      {suggestedTemplates.length > 0 && (
        <Card elevated noPadding>
          <div className="px-5 py-3 border-b border-surface-border flex items-center gap-2">
            <span className="text-sm font-medium text-white">✨ Recommended for your playlist</span>
          </div>
          <div className="flex gap-3 overflow-x-auto px-5 py-3">
            {suggestedTemplates.slice(0, 3).map((t) => (
              <motion.button
                key={t.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleUseTemplate(t.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-colors duration-200
                  ${selectedTemplateId === t.id
                    ? 'border-brand-500 bg-brand-900/20 text-brand-300'
                    : 'border-surface-border bg-surface-elevated text-gray-300 hover:border-brand-700 hover:text-white'
                  }`}
              >
                <span className="font-medium">{t.name}</span>
                <span className="text-xs text-gray-500">{t.totalDurationMs / 1000}s</span>
              </motion.button>
            ))}
          </div>
        </Card>
      )}

      {/* Main layout: gallery left, editor/preview right */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Gallery */}
        <div className="lg:col-span-2">
          <Card elevated noPadding>
            <div className="px-5 py-4 border-b border-surface-border">
              <CardHeader
                title="Template Gallery"
                subtitle={`${templates.length} templates`}
                icon={<span>🎞️</span>}
                className="mb-0"
              />
            </div>
            <div className="p-5 overflow-y-auto max-h-[calc(100vh-280px)]">
              <TemplateGallery
                templates={TEMPLATE_LIBRARY}
                selectedTemplateId={selectedTemplateId}
                lockedTemplateIds={lockedTemplateIds}
                onSelect={handleSelectTemplate}
                onUse={handleUseTemplate}
              />
            </div>
          </Card>
        </div>

        {/* Right: Tabs */}
        <div className="lg:col-span-3 space-y-4">
          {/* Tab bar */}
          <div className="flex gap-1 border-b border-surface-border pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                disabled={!displayTemplate && tab.id !== 'gallery'}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                  ${activeTab === tab.id
                    ? 'bg-brand-900/60 text-brand-300 border border-brand-800'
                    : 'text-gray-400 hover:text-white hover:bg-surface-elevated disabled:opacity-40 disabled:cursor-not-allowed'
                  }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* No template selected state */}
          {!displayTemplate && (
            <Card elevated className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-4xl mb-3">🎬</p>
              <p className="text-white font-medium mb-1">Pick a template to get started</p>
              <p className="text-sm text-gray-400">
                Choose a template from the gallery, then customise it for your campaign.
              </p>
            </Card>
          )}

          {/* Tab content */}
          {displayTemplate && (
            <AnimatePresence mode="wait">
              {activeTab === 'gallery' && (
                <motion.div
                  key="gallery-hint"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-16 text-gray-500 text-sm"
                >
                  <p className="text-3xl mb-2">👈</p>
                  <p>Select a template from the left, then switch to <strong className="text-gray-300">Editor</strong> or <strong className="text-gray-300">Preview</strong>.</p>
                </motion.div>
              )}

              {activeTab === 'editor' && (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Timeline */}
                  <Card elevated>
                    <CardHeader title="Timeline" icon={<span>⏱️</span>} />
                    <TimelinePreview
                      template={displayTemplate}
                      activeSectionId={activeSectionId}
                      onSectionClick={handleSectionClick}
                    />
                  </Card>

                  {/* Editor */}
                  <TemplateEditor
                    template={displayTemplate}
                    onChange={handleTemplateChange}
                  />

                  <Button variant="ghost" size="sm" onClick={resetCustomization}>
                    ↺ Reset to Original
                  </Button>
                </motion.div>
              )}

              {activeTab === 'preview' && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center py-6 gap-6"
                >
                  <VideoPreview template={displayTemplate} />
                  <Card elevated className="w-full">
                    <CardHeader title="Template Info" icon={<span>ℹ️</span>} />
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">Duration</p>
                        <p className="text-white">{displayTemplate.totalDurationMs / 1000}s</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Sections</p>
                        <p className="text-white">{displayTemplate.sections.length}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Platforms</p>
                        <p className="text-white">{displayTemplate.formats.join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Category</p>
                        <p className="text-white capitalize">{displayTemplate.category.replace(/-/g, ' ')}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'export' && (
                <motion.div
                  key="export"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Card elevated>
                    <CardHeader
                      title="Export"
                      subtitle="Download your template in multiple formats"
                      icon={<span>📤</span>}
                    />
                    <ShotListExport template={displayTemplate} />
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModal.isOpen}
        feature={upgradeModal.feature}
        onClose={closeUpgradeModal}
        onUpgrade={(planId, period) => checkout(planId, period)}
        isLoading={checkoutLoading}
      />
    </motion.div>
  );
};
