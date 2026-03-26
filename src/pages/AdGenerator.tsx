import { motion } from 'framer-motion';
import { useAppStore } from '../store';
import { useAdGenerator } from '../hooks/useAdGenerator';
import { Button, Card, CardHeader, Badge } from '../components/ui';
import { AdTemplate } from '../components/ads/AdTemplate';
import { copyToClipboard, downloadJson } from '../utils/helpers';
import toast from 'react-hot-toast';

export const AdGenerator = () => {
  const { currentCampaign, analysis, setStep } = useAppStore();
  const { save } = useAdGenerator();

  if (!currentCampaign || !analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <p className="text-4xl mb-4">📢</p>
          <p className="text-gray-400">No campaign yet. Complete the analysis and targeting first.</p>
          <Button className="mt-4" onClick={() => setStep('landing')}>← Start Over</Button>
        </div>
      </div>
    );
  }

  const handleCopyJson = async () => {
    const ok = await copyToClipboard(JSON.stringify(currentCampaign.metaApiPayload ?? currentCampaign, null, 2));
    if (ok) toast.success('Campaign JSON copied! 📋');
    else toast.error('Copy failed');
  };

  const handleExportJson = () => {
    downloadJson(currentCampaign.metaApiPayload ?? currentCampaign, `campaign-${Date.now()}.json`);
    toast.success('Campaign exported! 📥');
  };

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 flex-wrap gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-white">Ad Campaign Generator 📢</h1>
            <p className="text-gray-400 text-sm mt-1">{currentCampaign.name}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="secondary" onClick={handleCopyJson}>📋 Copy JSON</Button>
            <Button variant="secondary" onClick={handleExportJson}>📥 Export JSON</Button>
            <Button onClick={() => { save(); setStep('history'); }}>💾 Save Campaign</Button>
          </div>
        </motion.div>

        {/* Campaign Overview */}
        <Card className="mb-8">
          <CardHeader
            title="Campaign Overview"
            subtitle="Ready to launch in Meta Ads Manager"
            icon={<span>📋</span>}
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <OverviewStat label="Daily Budget" value={`$${currentCampaign.dailyBudget}/day`} icon="💰" highlight />
            <OverviewStat label="Objective" value={currentCampaign.objective.replace(/_/g, ' ')} icon="🎯" />
            <OverviewStat label="Ad Templates" value={currentCampaign.creatives.length.toString()} icon="🎨" />
            <OverviewStat label="Status" value={currentCampaign.status} icon={currentCampaign.status === 'DRAFT' ? '📝' : '🟢'} />
          </div>
        </Card>

        {/* Ad Set Details */}
        {currentCampaign.adSets[0] && (
          <Card className="mb-8">
            <CardHeader
              title="Ad Set Configuration"
              subtitle="Pre-configured targeting based on your playlist analysis"
              icon={<span>⚙️</span>}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <ConfigItem
                label="Countries"
                value={currentCampaign.adSets[0].targeting.geoLocations.countries.join(', ')}
              />
              <ConfigItem
                label="Age Range"
                value={`${currentCampaign.adSets[0].targeting.ageMin}–${currentCampaign.adSets[0].targeting.ageMax}`}
              />
              <ConfigItem
                label="Bid Strategy"
                value={currentCampaign.adSets[0].bidStrategy.replace(/_/g, ' ')}
              />
              <ConfigItem
                label="Platforms"
                value={currentCampaign.adSets[0].targeting.publisherPlatforms.join(' + ')}
              />
              <ConfigItem
                label="Optimization"
                value={currentCampaign.adSets[0].optimizationGoal.replace(/_/g, ' ')}
              />
              <ConfigItem
                label="Interests"
                value={`${currentCampaign.adSets[0].targeting.interests.length} interest groups`}
              />
            </div>

            <div className="mt-4 p-4 bg-surface rounded-xl border border-surface-border">
              <p className="text-xs font-medium text-gray-400 mb-2">Interest Keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {currentCampaign.adSets[0].targeting.interests.map((interest) => (
                  <Badge key={interest.id} variant="purple">{interest.name}</Badge>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Ad Creatives */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-white">Ad Creatives</h2>
              <p className="text-sm text-gray-400 mt-0.5">
                {currentCampaign.creatives.length} templates — click to preview, edit, and copy
              </p>
            </div>
            <Badge variant="green" className="hidden sm:flex">
              A/B Test Ready
            </Badge>
          </div>
          <div className="space-y-5">
            {currentCampaign.creatives.map((template) => (
              <AdTemplate
                key={template.id}
                template={template}
                playlistImageUrl={analysis.playlist.imageUrl}
                playlistName={analysis.playlist.name}
              />
            ))}
          </div>
        </div>

        {/* Meta API Payload */}
        <Card>
          <CardHeader
            title="Meta API Payload"
            subtitle="Ready-to-use JSON for Meta Marketing API or Ads Manager"
            icon={<span>🔧</span>}
            action={
              <Button size="sm" variant="secondary" onClick={handleCopyJson}>
                📋 Copy All
              </Button>
            }
          />
          <pre className="bg-surface rounded-xl border border-surface-border p-4 overflow-auto text-xs text-gray-300 max-h-96 font-mono">
            {JSON.stringify(currentCampaign.metaApiPayload, null, 2)}
          </pre>
        </Card>
      </div>
    </div>
  );
};

const OverviewStat = ({ label, value, icon, highlight }: { label: string; value: string; icon: string; highlight?: boolean }) => (
  <div className={`rounded-xl border p-4 ${highlight ? 'bg-brand-900/30 border-brand-700' : 'bg-surface border-surface-border'}`}>
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
