import { motion } from 'framer-motion';
import { useAppStore } from '../store';
import { Button, Card, Badge } from '../components/ui';
import type { SavedCampaign } from '../types';
import { formatCurrency } from '../utils/formatters';

export const History = () => {
  const { savedCampaigns, deleteCampaign, setCurrentCampaign, setStep } = useAppStore();

  const handleView = (campaign: SavedCampaign) => {
    setCurrentCampaign(campaign);
    setStep('ad-generator');
  };

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 flex-wrap gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-white">Campaign History 📋</h1>
            <p className="text-gray-400 text-sm mt-1">
              {savedCampaigns.length} saved campaign{savedCampaigns.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button onClick={() => setStep('landing')}>
            + New Campaign
          </Button>
        </motion.div>

        {savedCampaigns.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📭</p>
            <h2 className="text-xl font-semibold text-white mb-2">No saved campaigns yet</h2>
            <p className="text-gray-400 mb-6">Generate your first campaign to see it here</p>
            <Button onClick={() => setStep('landing')}>🚀 Get Started</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {savedCampaigns.map((campaign, i) => (
              <CampaignRow
                key={campaign.id}
                campaign={campaign}
                index={i}
                onView={() => handleView(campaign)}
                onDelete={() => deleteCampaign(campaign.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface CampaignRowProps {
  campaign: SavedCampaign;
  index: number;
  onView: () => void;
  onDelete: () => void;
}

const CampaignRow = ({ campaign, index, onView, onDelete }: CampaignRowProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
  >
    <Card hoverable noPadding>
      <div className="p-5 flex items-center gap-4 flex-wrap">
        <div className="flex-shrink-0 w-10 h-10 bg-brand-900/50 border border-brand-800 rounded-xl flex items-center justify-center text-xl">
          📢
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm truncate">{campaign.name}</h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge variant="purple">{campaign.genre}</Badge>
            <Badge
              variant={campaign.status === 'ACTIVE' ? 'green' : campaign.status === 'PAUSED' ? 'yellow' : 'gray'}
            >
              {campaign.status}
            </Badge>
            <span className="text-xs text-gray-500">
              {new Date(campaign.savedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-6 flex-shrink-0">
          <div className="text-right">
            <p className="text-xs text-gray-500">Daily Budget</p>
            <p className="text-sm font-bold text-white">{formatCurrency(campaign.dailyBudget)}/day</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Templates</p>
            <p className="text-sm font-bold text-white">{campaign.creatives.length}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button size="sm" variant="secondary" onClick={onView}>View</Button>
          <Button size="sm" variant="danger" onClick={onDelete}>Delete</Button>
        </div>
      </div>
      {campaign.performanceMetrics && (
        <div className="border-t border-surface-border px-5 py-3 grid grid-cols-4 gap-3 bg-surface-elevated">
          <PerfStat label="Impressions" value={campaign.performanceMetrics.impressions.toLocaleString()} />
          <PerfStat label="Clicks" value={campaign.performanceMetrics.clicks.toLocaleString()} />
          <PerfStat label="Spend" value={formatCurrency(campaign.performanceMetrics.spend)} />
          <PerfStat label="Followers" value={`+${campaign.performanceMetrics.followers}`} />
        </div>
      )}
    </Card>
  </motion.div>
);

const PerfStat = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-semibold text-white mt-0.5">{value}</p>
  </div>
);
