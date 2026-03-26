import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, Button, Badge } from '../ui';
import type { YouTubeCampaign, YouTubeAdFormat } from '../../services/youtube-ads/types';

interface YouTubeCampaignBuilderProps {
  campaign: YouTubeCampaign;
  onBudgetChange: (budget: number) => void;
  onExport: () => void;
  onCopy: () => void;
  isLoading?: boolean;
}

const BUDGET_PRESETS = [1, 5, 10, 20, 50, 100];

const FORMAT_LABELS: Record<YouTubeAdFormat, string> = {
  INSTREAM_SKIPPABLE: 'In-stream Skippable',
  INFEED_VIDEO: 'In-feed Video',
  SHORTS: 'YouTube Shorts',
};

const FORMAT_ICONS: Record<YouTubeAdFormat, string> = {
  INSTREAM_SKIPPABLE: '▶️',
  INFEED_VIDEO: '🔍',
  SHORTS: '📱',
};

export const YouTubeCampaignBuilder = ({
  campaign,
  onBudgetChange,
  onExport,
  onCopy,
  isLoading,
}: YouTubeCampaignBuilderProps) => {
  const [budget, setBudget] = useState(campaign.dailyBudget);

  const handleBudgetChange = (value: number) => {
    const clamped = Math.max(1, value);
    setBudget(clamped);
    onBudgetChange(clamped);
  };

  const totalAds = campaign.adGroups.reduce((n, ag) => n + ag.ads.length, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Campaign Overview */}
      <Card>
        <CardHeader
          title="YouTube Campaign Overview"
          subtitle="Ready to launch in Google Ads"
          icon={<span>📺</span>}
          action={
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={onCopy}>
                📋 Copy JSON
              </Button>
              <Button size="sm" variant="secondary" onClick={onExport}>
                📥 Export
              </Button>
            </div>
          }
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <OverviewStat label="Daily Budget" value={`$${budget}/day`} icon="💰" highlight />
          <OverviewStat label="Campaign Type" value={campaign.campaignType.replace(/_/g, ' ')} icon="🎯" />
          <OverviewStat label="Ad Creatives" value={totalAds.toString()} icon="🎨" />
          <OverviewStat label="Status" value={campaign.status} icon="📝" />
        </div>
      </Card>

      {/* Budget Adjuster */}
      <Card>
        <CardHeader
          title="Daily Budget"
          subtitle="Minimum $1/day on Google Ads for YouTube"
          icon={<span>💰</span>}
        />
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={1}
              max={100}
              step={1}
              value={budget}
              onChange={(e) => handleBudgetChange(Number(e.target.value))}
              className="flex-1 accent-brand-500"
              aria-label="Daily budget slider"
            />
            <div className="flex items-center gap-1">
              <span className="text-gray-400 text-sm">$</span>
              <input
                type="number"
                min={1}
                value={budget}
                onChange={(e) => handleBudgetChange(Number(e.target.value))}
                className="w-20 bg-surface border border-surface-border rounded-lg px-2 py-1.5 text-sm text-white text-right focus:outline-none focus:ring-1 focus:ring-brand-500"
                aria-label="Daily budget input"
              />
              <span className="text-gray-400 text-sm">/day</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {BUDGET_PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => handleBudgetChange(preset)}
                className={`py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  budget === preset
                    ? 'bg-brand-600 border-brand-500 text-white'
                    : 'bg-surface border-surface-border text-gray-400 hover:text-white hover:border-brand-700'
                }`}
              >
                ${preset}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Ad Groups by Format */}
      <Card>
        <CardHeader
          title="Ad Groups by Format"
          subtitle="One ad group per YouTube ad format"
          icon={<span>🎬</span>}
        />
        <div className="space-y-4">
          {campaign.adGroups.map((adGroup) => (
            <div
              key={adGroup.name}
              className="bg-surface rounded-xl border border-surface-border p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-white flex items-center gap-1.5">
                    {FORMAT_ICONS[adGroup.adFormat]} {FORMAT_LABELS[adGroup.adFormat]}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{adGroup.ads.length} ad{adGroup.ads.length !== 1 ? 's' : ''}</p>
                </div>
                <Badge variant="purple" className="text-xs">
                  {adGroup.biddingStrategy.replace(/_/g, ' ')}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <ConfigItem label="Locations" value={adGroup.targeting.locations.join(', ')} />
                <ConfigItem label="Bidding" value={`Target CPV: $${((adGroup.targetCpvMicros ?? 50000) / 1_000_000).toFixed(2)}`} />
              </div>
              {adGroup.targeting.topics.topicLabels.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1.5">Topic Targeting</p>
                  <div className="flex flex-wrap gap-1">
                    {adGroup.targeting.topics.topicLabels.map((label) => (
                      <Badge key={label} variant="gray" className="text-xs">
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {adGroup.targeting.audiences.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1.5">Audience Segments</p>
                  <div className="flex flex-wrap gap-1">
                    {adGroup.targeting.audiences.map((a) => (
                      <Badge key={a.id} variant="purple" className="text-xs">
                        {a.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Video Specs */}
      <Card>
        <CardHeader
          title="Video Ad Specs"
          subtitle="Supported formats for YouTube video campaigns"
          icon={<span>🎥</span>}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <VideoSpecCard
            icon="▶️"
            title="In-stream Skippable"
            specs={['16:9 landscape', '1920×1080px', '12–60 sec', 'Skip after 5s', '+ Companion banner 300×60px']}
          />
          <VideoSpecCard
            icon="🔍"
            title="In-feed Video"
            specs={['16:9 landscape', '1920×1080px', 'Any length', 'Appears in search & feed']}
          />
          <VideoSpecCard
            icon="📱"
            title="YouTube Shorts"
            specs={['9:16 vertical', '1080×1920px', 'Up to 60 sec', 'Appears in Shorts feed']}
          />
        </div>
        <div className="mt-4 p-3 bg-brand-900/20 border border-brand-800 rounded-xl">
          <p className="text-xs text-brand-300">
            💡 <strong>Tip:</strong> Hook viewers in the first 5 seconds before the skip option appears.
            YouTube Music targeting reaches music lovers actively listening — ideal for playlist promotion.
          </p>
        </div>
      </Card>

      {isLoading && (
        <div className="flex items-center justify-center py-4 text-gray-400 text-sm">
          <span className="animate-spin mr-2">⏳</span> Generating campaign…
        </div>
      )}
    </motion.div>
  );
};

// ===================================================
// Sub-components
// ===================================================

const OverviewStat = ({
  label,
  value,
  icon,
  highlight,
}: {
  label: string;
  value: string;
  icon: string;
  highlight?: boolean;
}) => (
  <div
    className={`rounded-xl border p-4 ${
      highlight ? 'bg-brand-900/30 border-brand-700' : 'bg-surface border-surface-border'
    }`}
  >
    <p className="text-lg">{icon}</p>
    <p className={`font-bold mt-1 ${highlight ? 'text-brand-300' : 'text-white'}`}>{value}</p>
    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
  </div>
);

const ConfigItem = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-surface-elevated rounded-lg border border-surface-border p-2.5">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-xs font-medium text-white mt-0.5">{value}</p>
  </div>
);

const VideoSpecCard = ({
  icon,
  title,
  specs,
}: {
  icon: string;
  title: string;
  specs: string[];
}) => (
  <div className="bg-surface rounded-xl border border-surface-border p-4">
    <p className="text-xl mb-2">{icon}</p>
    <p className="text-sm font-semibold text-white mb-2">{title}</p>
    <ul className="space-y-1">
      {specs.map((spec) => (
        <li key={spec} className="text-xs text-gray-400 flex items-start gap-1.5">
          <span className="text-brand-500 mt-0.5">•</span>
          {spec}
        </li>
      ))}
    </ul>
  </div>
);
