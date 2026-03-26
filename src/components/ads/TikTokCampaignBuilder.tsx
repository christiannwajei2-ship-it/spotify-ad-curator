import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, Button, Badge } from '../ui';
import type { TikTokCampaign } from '../../services/tiktok-ads/types';

interface TikTokCampaignBuilderProps {
  campaign: TikTokCampaign;
  onBudgetChange: (budget: number) => void;
  onExport: () => void;
  onCopy: () => void;
  isLoading?: boolean;
}

const BUDGET_PRESETS = [5, 10, 20, 50, 75, 100];

export const TikTokCampaignBuilder = ({
  campaign,
  onBudgetChange,
  onExport,
  onCopy,
  isLoading,
}: TikTokCampaignBuilderProps) => {
  const [budget, setBudget] = useState(campaign.dailyBudget);

  const handleBudgetChange = (value: number) => {
    const clamped = Math.max(5, value);
    setBudget(clamped);
    onBudgetChange(clamped);
  };

  const adGroup = campaign.adGroups[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Campaign Overview */}
      <Card>
        <CardHeader
          title="TikTok Campaign Overview"
          subtitle="Ready to launch in TikTok Ads Manager"
          icon={<span>📱</span>}
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
          <OverviewStat label="Objective" value={campaign.objective} icon="🎯" />
          <OverviewStat label="Ad Creatives" value={adGroup?.ads.length.toString() ?? '0'} icon="🎨" />
          <OverviewStat label="Status" value={campaign.status} icon="📝" />
        </div>
      </Card>

      {/* Budget Adjuster */}
      <Card>
        <CardHeader
          title="Daily Budget"
          subtitle="Minimum $5/day on TikTok Ads"
          icon={<span>💰</span>}
        />
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={5}
              max={100}
              step={5}
              value={budget}
              onChange={(e) => handleBudgetChange(Number(e.target.value))}
              className="flex-1 accent-brand-500"
              aria-label="Daily budget slider"
            />
            <div className="flex items-center gap-1">
              <span className="text-gray-400 text-sm">$</span>
              <input
                type="number"
                min={5}
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

      {/* Ad Group Targeting */}
      {adGroup && (
        <Card>
          <CardHeader
            title="Ad Group Targeting"
            subtitle="Auto-configured from your playlist analysis"
            icon={<span>🎯</span>}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ConfigItem
              label="Countries"
              value={adGroup.targeting.locations.join(', ')}
            />
            <ConfigItem
              label="Gender"
              value={adGroup.targeting.gender.replace('GENDER_', '')}
            />
            <ConfigItem
              label="Bid Strategy"
              value="Lowest Cost"
            />
            <ConfigItem
              label="Placements"
              value={adGroup.targeting.placements
                .map((p) =>
                  p === 'PLACEMENT_TIKTOK'
                    ? 'TikTok Feed'
                    : p === 'PLACEMENT_TIKTOK_STORY'
                    ? 'TikTok Story'
                    : p
                )
                .join(', ')}
            />
            <ConfigItem
              label="Optimization"
              value={adGroup.optimizationGoal}
            />
            <ConfigItem
              label="Billing"
              value={adGroup.billingEvent}
            />
          </div>

          <div className="mt-4 p-4 bg-surface rounded-xl border border-surface-border">
            <p className="text-xs font-medium text-gray-400 mb-2">Interest Keywords</p>
            <div className="flex flex-wrap gap-1.5">
              {adGroup.targeting.interests.map((interest) => (
                <Badge key={interest} variant="purple">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Video Specs */}
      <Card>
        <CardHeader
          title="Video Ad Specs"
          subtitle="Recommended format for TikTok ads"
          icon={<span>🎬</span>}
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <OverviewStat label="Aspect Ratio" value="9:16" icon="📐" />
          <OverviewStat label="Orientation" value="Vertical" icon="📱" />
          <OverviewStat label="Duration" value="15–60 sec" icon="⏱️" />
          <OverviewStat label="Format" value="MP4 / MOV" icon="🎥" />
        </div>
        <div className="mt-4 p-3 bg-brand-900/20 border border-brand-800 rounded-xl">
          <p className="text-xs text-brand-300">
            💡 <strong>Tip:</strong> Use 1080×1920px vertical videos. Keep your hook in the first 3 seconds.
            Add captions — 73% of TikTok users watch with sound off in some sessions.
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
  <div className="bg-surface rounded-xl border border-surface-border p-3">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-medium text-white mt-0.5 capitalize">{value.toLowerCase()}</p>
  </div>
);
