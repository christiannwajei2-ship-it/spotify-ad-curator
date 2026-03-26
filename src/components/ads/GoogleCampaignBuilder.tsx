import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, Button, Badge } from '../ui';
import type { GoogleCampaign, GoogleKeywordMatchType } from '../../services/google-ads/types';

interface GoogleCampaignBuilderProps {
  campaign: GoogleCampaign;
  onBudgetChange: (budget: number) => void;
  onExport: () => void;
  onCopy: () => void;
  isLoading?: boolean;
}

const BUDGET_PRESETS = [1, 3, 5, 10, 20, 50];

const MATCH_TYPE_LABELS: Record<GoogleKeywordMatchType, string> = {
  BROAD: 'Broad',
  PHRASE: 'Phrase',
  EXACT: 'Exact',
};

const MATCH_TYPE_COLORS: Record<GoogleKeywordMatchType, 'gray' | 'purple' | 'green'> = {
  BROAD: 'gray',
  PHRASE: 'purple',
  EXACT: 'green',
};

export const GoogleCampaignBuilder = ({
  campaign,
  onBudgetChange,
  onExport,
  onCopy,
  isLoading,
}: GoogleCampaignBuilderProps) => {
  const [budget, setBudget] = useState(campaign.dailyBudget);

  const handleBudgetChange = (value: number) => {
    const clamped = Math.max(1, value);
    setBudget(clamped);
    onBudgetChange(clamped);
  };

  const searchAdGroup = campaign.adGroups.find((ag) => ag.campaignType === 'SEARCH');
  const displayAdGroup = campaign.adGroups.find((ag) => ag.campaignType === 'DISPLAY');
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
          title="Google Campaign Overview"
          subtitle="Search + Display campaigns ready to launch in Google Ads"
          icon={<span>🔍</span>}
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
          <OverviewStat label="Ad Groups" value={campaign.adGroups.length.toString()} icon="🎯" />
          <OverviewStat label="Ad Creatives" value={totalAds.toString()} icon="🎨" />
          <OverviewStat label="Status" value={campaign.status} icon="📝" />
        </div>
      </Card>

      {/* Budget Adjuster */}
      <Card>
        <CardHeader
          title="Daily Budget"
          subtitle="Minimum $1/day — recommended $1–3/day for Music Promotion"
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

      {/* Search Ad Group */}
      {searchAdGroup && (
        <Card>
          <CardHeader
            title="Search Campaign"
            subtitle="Keyword-targeted ads on Google Search"
            icon={<span>🔍</span>}
          />
          <div className="space-y-4">
            {/* Keywords */}
            {searchAdGroup.targeting.keywords && searchAdGroup.targeting.keywords.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                  Keywords ({searchAdGroup.targeting.keywords.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {searchAdGroup.targeting.keywords.map((kw) => (
                    <span
                      key={`${kw.matchType}-${kw.text}`}
                      className="flex items-center gap-1 bg-surface border border-surface-border rounded-lg px-2 py-1"
                    >
                      <Badge
                        variant={MATCH_TYPE_COLORS[kw.matchType]}
                        className="text-[9px] py-0"
                      >
                        {MATCH_TYPE_LABELS[kw.matchType]}
                      </Badge>
                      <span className="text-xs text-gray-300">{kw.text}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Negative keywords */}
            {searchAdGroup.targeting.negativeKeywords &&
              searchAdGroup.targeting.negativeKeywords.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Negative Keywords ({searchAdGroup.targeting.negativeKeywords.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {searchAdGroup.targeting.negativeKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-xs text-red-400 bg-red-900/20 border border-red-900/40 rounded-lg px-2 py-1"
                      >
                        −{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            <div className="grid grid-cols-2 gap-2">
              <ConfigItem label="Locations" value={searchAdGroup.targeting.locations.join(', ')} />
              <ConfigItem label="Bidding" value={searchAdGroup.biddingStrategy.replace(/_/g, ' ')} />
            </div>
          </div>
        </Card>
      )}

      {/* Display Ad Group */}
      {displayAdGroup && (
        <Card>
          <CardHeader
            title="Display Campaign"
            subtitle="Responsive display ads on music blogs & entertainment sites"
            icon={<span>🖼️</span>}
          />
          <div className="space-y-4">
            {/* Audiences */}
            {displayAdGroup.targeting.audiences && displayAdGroup.targeting.audiences.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                  Audience Targeting
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {displayAdGroup.targeting.audiences.map((audience) => (
                    <Badge
                      key={audience.id}
                      variant={audience.type === 'AFFINITY' ? 'purple' : 'green'}
                      className="text-xs"
                    >
                      {audience.type === 'AFFINITY' ? '❤️' : '🛒'} {audience.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Placements */}
            {displayAdGroup.targeting.placements && displayAdGroup.targeting.placements.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                  Placement Targeting
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {displayAdGroup.targeting.placements.map((site) => (
                    <span
                      key={site}
                      className="text-xs text-blue-400 bg-blue-900/20 border border-blue-900/40 rounded-lg px-2 py-1"
                    >
                      🌐 {site}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <ConfigItem label="Locations" value={displayAdGroup.targeting.locations.join(', ')} />
              <ConfigItem label="Bidding" value={displayAdGroup.biddingStrategy.replace(/_/g, ' ')} />
            </div>
          </div>
        </Card>
      )}

      {/* Ad Specs */}
      <Card>
        <CardHeader
          title="Ad Format Specs"
          subtitle="Google Search & Display Network specifications"
          icon={<span>📐</span>}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdSpecCard
            icon="🔍"
            title="Responsive Search Ad"
            specs={[
              '3 headlines — max 30 chars each',
              '2 descriptions — max 90 chars each',
              'Google rotates best combinations',
              'Match types: Broad / Phrase / Exact',
              'Bidding: Maximize Clicks (Smart)',
            ]}
          />
          <AdSpecCard
            icon="🖼️"
            title="Responsive Display Ad"
            specs={[
              '1–5 short headlines — max 30 chars',
              '1 long headline — max 90 chars',
              '1–5 descriptions — max 90 chars',
              'Images: 300×250, 728×90, 320×50, 160×600',
              'Audience: Affinity + In-Market',
            ]}
          />
        </div>
        <div className="mt-4 p-3 bg-brand-900/20 border border-brand-800 rounded-xl">
          <p className="text-xs text-brand-300">
            💡 <strong>Tip:</strong> Search ads target people actively searching for your genre —
            high intent traffic. Display ads reach music lovers browsing related sites — great for
            brand awareness and playlist discovery.
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

const AdSpecCard = ({
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
