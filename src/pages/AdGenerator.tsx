import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store';
import { useAdGenerator } from '../hooks/useAdGenerator';
import { useTikTokAds } from '../hooks/useTikTokAds';
import { useYouTubeAds } from '../hooks/useYouTubeAds';
import { useGoogleAds } from '../hooks/useGoogleAds';
import { useSubscription } from '../hooks/useSubscription';
import { Button, Card, CardHeader, Badge } from '../components/ui';
import { AdTemplate } from '../components/ads/AdTemplate';
import { TikTokAdPreview } from '../components/ads/TikTokAdPreview';
import { TikTokCampaignBuilder } from '../components/ads/TikTokCampaignBuilder';
import { YouTubeAdPreview } from '../components/ads/YouTubeAdPreview';
import { YouTubeCampaignBuilder } from '../components/ads/YouTubeCampaignBuilder';
import { GoogleSearchAdPreview, GoogleDisplayAdPreview } from '../components/ads/GoogleAdPreview';
import { GoogleCampaignBuilder } from '../components/ads/GoogleCampaignBuilder';
import { AICopyGenerator } from '../components/ai/AICopyGenerator';
import { UpgradeModal } from '../components/payments/UpgradeModal';
import { copyToClipboard, downloadJson } from '../utils/helpers';
import toast from 'react-hot-toast';

type AdPlatform = 'meta' | 'tiktok' | 'youtube' | 'google' | 'ai-copy';

export const AdGenerator = () => {
  const { currentCampaign, analysis, setStep } = useAppStore();
  const { save } = useAdGenerator();
  const { tikTokCampaign, setTikTokCampaign, generate: generateTikTok, isLoading: tikTokLoading } = useTikTokAds();
  const { youtubeCampaign, setYouTubeCampaign, generate: generateYouTube, isLoading: youtubeLoading } = useYouTubeAds();
  const { googleCampaign, setGoogleCampaign, generate: generateGoogle, isLoading: googleLoading } = useGoogleAds();
  const { canAccess, upgradeModal, openUpgradeModal, closeUpgradeModal, checkout, isLoading: checkoutLoading } = useSubscription();
  const [activePlatform, setActivePlatform] = useState<AdPlatform>('meta');
  const [tikTokBudget, setTikTokBudget] = useState(5);
  const [youtubeBudget, setYoutubeBudget] = useState(5);
  const [googleBudget, setGoogleBudget] = useState(3);

  const handlePlatformClick = (platform: AdPlatform) => {
    const gatedMap: Record<string, 'tiktok' | 'youtube' | 'google-search'> = {
      tiktok: 'tiktok',
      youtube: 'youtube',
      google: 'google-search',
    };
    const gated = gatedMap[platform];
    if (gated && !canAccess(gated)) {
      openUpgradeModal(gated);
      return;
    }
    setActivePlatform(platform);
  };

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

  const handleCopyMetaJson = async () => {
    const ok = await copyToClipboard(JSON.stringify(currentCampaign.metaApiPayload ?? currentCampaign, null, 2));
    if (ok) toast.success('Campaign JSON copied! 📋');
    else toast.error('Copy failed');
  };

  const handleExportMetaJson = () => {
    downloadJson(currentCampaign.metaApiPayload ?? currentCampaign, `meta-campaign-${Date.now()}.json`);
    toast.success('Campaign exported! 📥');
  };

  const handleCopyTikTokJson = async () => {
    if (!tikTokCampaign) return;
    const ok = await copyToClipboard(JSON.stringify(tikTokCampaign.tiktokApiPayload ?? tikTokCampaign, null, 2));
    if (ok) toast.success('TikTok campaign JSON copied! 📋');
    else toast.error('Copy failed');
  };

  const handleExportTikTokJson = () => {
    if (!tikTokCampaign) return;
    downloadJson(tikTokCampaign.tiktokApiPayload ?? tikTokCampaign, `tiktok-campaign-${Date.now()}.json`);
    toast.success('TikTok campaign exported! 📥');
  };

  const handleTikTokBudgetChange = (budget: number) => {
    setTikTokBudget(budget);
    if (tikTokCampaign) {
      setTikTokCampaign({ ...tikTokCampaign, dailyBudget: budget });
    }
  };

  const handleCopyYouTubeJson = async () => {
    if (!youtubeCampaign) return;
    const ok = await copyToClipboard(JSON.stringify(youtubeCampaign.youtubeApiPayload ?? youtubeCampaign, null, 2));
    if (ok) toast.success('YouTube campaign JSON copied! 📋');
    else toast.error('Copy failed');
  };

  const handleExportYouTubeJson = () => {
    if (!youtubeCampaign) return;
    downloadJson(youtubeCampaign.youtubeApiPayload ?? youtubeCampaign, `youtube-campaign-${Date.now()}.json`);
    toast.success('YouTube campaign exported! 📥');
  };

  const handleYouTubeBudgetChange = (budget: number) => {
    setYoutubeBudget(budget);
    if (youtubeCampaign) {
      setYouTubeCampaign({ ...youtubeCampaign, dailyBudget: budget });
    }
  };

  const handleCopyGoogleJson = async () => {
    if (!googleCampaign) return;
    const ok = await copyToClipboard(JSON.stringify(googleCampaign.googleAdsApiPayload ?? googleCampaign, null, 2));
    if (ok) toast.success('Google campaign JSON copied! 📋');
    else toast.error('Copy failed');
  };

  const handleExportGoogleJson = () => {
    if (!googleCampaign) return;
    downloadJson(googleCampaign.googleAdsApiPayload ?? googleCampaign, `google-campaign-${Date.now()}.json`);
    toast.success('Google campaign exported! 📥');
  };

  const handleGoogleBudgetChange = (budget: number) => {
    setGoogleBudget(budget);
    if (googleCampaign) {
      setGoogleCampaign({ ...googleCampaign, dailyBudget: budget });
    }
  };

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6 flex-wrap gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-white">Ad Campaign Generator 📢</h1>
            <p className="text-gray-400 text-sm mt-1">{currentCampaign.name}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {activePlatform === 'meta' ? (
              <>
                <Button variant="secondary" onClick={handleCopyMetaJson}>📋 Copy JSON</Button>
                <Button variant="secondary" onClick={handleExportMetaJson}>📥 Export JSON</Button>
                <Button onClick={() => { save(); setStep('history'); }}>💾 Save Campaign</Button>
              </>
            ) : activePlatform === 'tiktok' ? (
              <>
                {tikTokCampaign && (
                  <>
                    <Button variant="secondary" onClick={handleCopyTikTokJson}>📋 Copy JSON</Button>
                    <Button variant="secondary" onClick={handleExportTikTokJson}>📥 Export JSON</Button>
                  </>
                )}
                {!tikTokCampaign && (
                  <Button onClick={() => generateTikTok(tikTokBudget)} isLoading={tikTokLoading}>
                    📱 Generate TikTok Campaign
                  </Button>
                )}
              </>
            ) : activePlatform === 'youtube' ? (
              <>
                {youtubeCampaign && (
                  <>
                    <Button variant="secondary" onClick={handleCopyYouTubeJson}>📋 Copy JSON</Button>
                    <Button variant="secondary" onClick={handleExportYouTubeJson}>📥 Export JSON</Button>
                  </>
                )}
                {!youtubeCampaign && (
                  <Button onClick={() => generateYouTube(youtubeBudget)} isLoading={youtubeLoading}>
                    📺 Generate YouTube Campaign
                  </Button>
                )}
              </>
            ) : (
              <>
                {googleCampaign && (
                  <>
                    <Button variant="secondary" onClick={handleCopyGoogleJson}>📋 Copy JSON</Button>
                    <Button variant="secondary" onClick={handleExportGoogleJson}>📥 Export JSON</Button>
                  </>
                )}
                {!googleCampaign && (
                  <Button onClick={() => generateGoogle(googleBudget)} isLoading={googleLoading}>
                    🔍 Generate Google Campaign
                  </Button>
                )}
              </>
            )}
            <Button variant="ghost" onClick={() => setStep('analytics')}>📈 View Analytics</Button>
            <Button variant="ghost" onClick={() => setStep('scheduler')}>⏰ Schedule Auto-Refresh</Button>
          </div>
        </motion.div>

        {/* Platform Tabs */}
        <div className="flex gap-2 mb-8 border-b border-surface-border pb-4 flex-wrap">
          {(
          [
              { id: 'meta', label: '📘 Meta Ads', desc: 'Facebook & Instagram', gated: false },
              { id: 'tiktok', label: '📱 TikTok Ads', desc: 'Short-form video', gated: !canAccess('tiktok') },
              { id: 'youtube', label: '📺 YouTube Ads', desc: 'Video campaigns', gated: !canAccess('youtube') },
              { id: 'google', label: '🔍 Google Ads', desc: 'Search & Display', gated: !canAccess('google-search') },
              { id: 'ai-copy', label: '🤖 AI Copy', desc: 'Generate ad copy', gated: false },
            ] as { id: AdPlatform; label: string; desc: string; gated: boolean }[]
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => handlePlatformClick(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                activePlatform === tab.id
                  ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-900/30'
                  : tab.gated
                    ? 'bg-surface border-surface-border text-gray-500 hover:text-gray-300 hover:border-yellow-700'
                    : 'bg-surface border-surface-border text-gray-400 hover:text-white hover:border-brand-700'
              }`}
            >
              {tab.label}
              {tab.gated && <span className="text-yellow-500 text-xs">🔒</span>}
              <span className="hidden sm:inline text-xs ml-1 opacity-70">— {tab.desc}</span>
            </button>
          ))}
        </div>

        {/* ======================== META ADS TAB ======================== */}
        {activePlatform === 'meta' && (
          <>
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
                  <Button size="sm" variant="secondary" onClick={handleCopyMetaJson}>
                    📋 Copy All
                  </Button>
                }
              />
              <pre className="bg-surface rounded-xl border border-surface-border p-4 overflow-auto text-xs text-gray-300 max-h-96 font-mono">
                {JSON.stringify(currentCampaign.metaApiPayload, null, 2)}
              </pre>
            </Card>
          </>
        )}

        {/* ======================== TIKTOK ADS TAB ======================== */}
        {activePlatform === 'tiktok' && (
          <>
            {!tikTokCampaign ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <p className="text-5xl mb-4">📱</p>
                <h2 className="text-xl font-bold text-white mb-2">Generate Your TikTok Campaign</h2>
                <p className="text-gray-400 text-sm mb-6 max-w-md">
                  Auto-generate TikTok ad creatives optimised for short-form vertical video, based on your Spotify
                  playlist analysis.
                </p>
                <Button onClick={() => generateTikTok(tikTokBudget)} isLoading={tikTokLoading} size="lg">
                  📱 Generate TikTok Campaign
                </Button>
              </motion.div>
            ) : (
              <>
                <TikTokCampaignBuilder
                  campaign={tikTokCampaign}
                  onBudgetChange={handleTikTokBudgetChange}
                  onExport={handleExportTikTokJson}
                  onCopy={handleCopyTikTokJson}
                  isLoading={tikTokLoading}
                />

                {/* TikTok Ad Creatives */}
                <div className="mt-8 mb-8">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-xl font-bold text-white">TikTok Ad Creatives</h2>
                      <p className="text-sm text-gray-400 mt-0.5">
                        {tikTokCampaign.adGroups[0]?.ads.length ?? 0} templates — optimised for short-form
                        vertical video
                      </p>
                    </div>
                    <Badge variant="green" className="hidden sm:flex">
                      A/B Test Ready
                    </Badge>
                  </div>
                  <div className="space-y-5">
                    {tikTokCampaign.adGroups[0]?.ads.map((ad) => (
                      <TikTokAdPreview
                        key={ad.creative.id}
                        template={ad.creative}
                        playlistImageUrl={analysis.playlist.imageUrl}
                        playlistName={analysis.playlist.name}
                      />
                    ))}
                  </div>
                </div>

                {/* TikTok API Payload */}
                <Card>
                  <CardHeader
                    title="TikTok API Payload"
                    subtitle="Ready-to-use JSON for TikTok Ads Manager API"
                    icon={<span>🔧</span>}
                    action={
                      <Button size="sm" variant="secondary" onClick={handleCopyTikTokJson}>
                        📋 Copy All
                      </Button>
                    }
                  />
                  <pre className="bg-surface rounded-xl border border-surface-border p-4 overflow-auto text-xs text-gray-300 max-h-96 font-mono">
                    {JSON.stringify(tikTokCampaign.tiktokApiPayload, null, 2)}
                  </pre>
                </Card>
              </>
            )}
          </>
        )}

        {/* ======================== YOUTUBE ADS TAB ======================== */}
        {activePlatform === 'youtube' && (
          <>
            {!youtubeCampaign ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <p className="text-5xl mb-4">📺</p>
                <h2 className="text-xl font-bold text-white mb-2">Generate Your YouTube Campaign</h2>
                <p className="text-gray-400 text-sm mb-6 max-w-md">
                  Auto-generate YouTube video ad campaigns (In-stream, In-feed &amp; Shorts) optimised for
                  music lovers, based on your Spotify playlist analysis.
                </p>
                <Button onClick={() => generateYouTube(youtubeBudget)} isLoading={youtubeLoading} size="lg">
                  📺 Generate YouTube Campaign
                </Button>
              </motion.div>
            ) : (
              <>
                <YouTubeCampaignBuilder
                  campaign={youtubeCampaign}
                  onBudgetChange={handleYouTubeBudgetChange}
                  onExport={handleExportYouTubeJson}
                  onCopy={handleCopyYouTubeJson}
                  isLoading={youtubeLoading}
                />

                {/* YouTube Ad Creatives */}
                <div className="mt-8 mb-8">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-xl font-bold text-white">YouTube Ad Creatives</h2>
                      <p className="text-sm text-gray-400 mt-0.5">
                        {youtubeCampaign.adGroups.reduce((n, ag) => n + ag.ads.length, 0)} templates — In-stream, In-feed &amp; Shorts
                      </p>
                    </div>
                    <Badge variant="green" className="hidden sm:flex">
                      A/B Test Ready
                    </Badge>
                  </div>
                  <div className="space-y-5">
                    {youtubeCampaign.adGroups.flatMap((ag) =>
                      ag.ads.map((ad) => (
                        <YouTubeAdPreview
                          key={ad.creative.id}
                          template={ad.creative}
                          playlistImageUrl={analysis.playlist.imageUrl}
                          playlistName={analysis.playlist.name}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* YouTube API Payload */}
                <Card>
                  <CardHeader
                    title="Google Ads API Payload"
                    subtitle="Ready-to-use JSON for Google Ads API (YouTube campaigns)"
                    icon={<span>🔧</span>}
                    action={
                      <Button size="sm" variant="secondary" onClick={handleCopyYouTubeJson}>
                        📋 Copy All
                      </Button>
                    }
                  />
                  <pre className="bg-surface rounded-xl border border-surface-border p-4 overflow-auto text-xs text-gray-300 max-h-96 font-mono">
                    {JSON.stringify(youtubeCampaign.youtubeApiPayload, null, 2)}
                  </pre>
                </Card>
              </>
            )}
          </>
        )}

        {/* ======================== GOOGLE ADS TAB ======================== */}
        {activePlatform === 'google' && (
          <>
            {!googleCampaign ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <p className="text-5xl mb-4">🔍</p>
                <h2 className="text-xl font-bold text-white mb-2">Generate Your Google Campaign</h2>
                <p className="text-gray-400 text-sm mb-6 max-w-md">
                  Auto-generate Google Search &amp; Display ad campaigns targeting genre keywords and
                  music lovers on the web, based on your Spotify playlist analysis.
                </p>
                <Button onClick={() => generateGoogle(googleBudget)} isLoading={googleLoading} size="lg">
                  🔍 Generate Google Campaign
                </Button>
              </motion.div>
            ) : (
              <>
                <GoogleCampaignBuilder
                  campaign={googleCampaign}
                  onBudgetChange={handleGoogleBudgetChange}
                  onExport={handleExportGoogleJson}
                  onCopy={handleCopyGoogleJson}
                  isLoading={googleLoading}
                />

                {/* Google Search Creatives */}
                {(() => {
                  const searchGroup = googleCampaign.adGroups.find((ag) => ag.campaignType === 'SEARCH');
                  if (!searchGroup) return null;
                  return (
                    <div className="mt-8 mb-8">
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <h2 className="text-xl font-bold text-white">Search Ad Creatives</h2>
                          <p className="text-sm text-gray-400 mt-0.5">
                            {searchGroup.ads.length} responsive search ads — keyword-targeted
                          </p>
                        </div>
                        <Badge variant="green" className="hidden sm:flex">
                          A/B Test Ready
                        </Badge>
                      </div>
                      <div className="space-y-5">
                        {searchGroup.ads.map((ad) =>
                          ad.searchCreative ? (
                            <GoogleSearchAdPreview
                              key={ad.searchCreative.id}
                              template={ad.searchCreative}
                              playlistName={analysis.playlist.name}
                            />
                          ) : null
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Google Display Creatives */}
                {(() => {
                  const displayGroup = googleCampaign.adGroups.find((ag) => ag.campaignType === 'DISPLAY');
                  if (!displayGroup) return null;
                  return (
                    <div className="mt-8 mb-8">
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <h2 className="text-xl font-bold text-white">Display Ad Creatives</h2>
                          <p className="text-sm text-gray-400 mt-0.5">
                            {displayGroup.ads.length} responsive display ads — music blogs &amp; entertainment sites
                          </p>
                        </div>
                        <Badge variant="purple" className="hidden sm:flex">
                          Responsive
                        </Badge>
                      </div>
                      <div className="space-y-5">
                        {displayGroup.ads.map((ad) =>
                          ad.displayCreative ? (
                            <GoogleDisplayAdPreview
                              key={ad.displayCreative.id}
                              template={ad.displayCreative}
                              playlistImageUrl={analysis.playlist.imageUrl}
                              playlistName={analysis.playlist.name}
                            />
                          ) : null
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Google API Payload */}
                <Card>
                  <CardHeader
                    title="Google Ads API Payload"
                    subtitle="Ready-to-use JSON for Google Ads API (Search + Display)"
                    icon={<span>🔧</span>}
                    action={
                      <Button size="sm" variant="secondary" onClick={handleCopyGoogleJson}>
                        📋 Copy All
                      </Button>
                    }
                  />
                  <pre className="bg-surface rounded-xl border border-surface-border p-4 overflow-auto text-xs text-gray-300 max-h-96 font-mono">
                    {JSON.stringify(googleCampaign.googleAdsApiPayload, null, 2)}
                  </pre>
                </Card>
              </>
            )}
          </>
        )}

        {/* ======================== AI COPY TAB ======================== */}
        {activePlatform === 'ai-copy' && (
          <AICopyGenerator />
        )}
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModal.isOpen}
        feature={upgradeModal.feature}
        isLoading={checkoutLoading}
        onUpgrade={(planId, period) => checkout(planId, period)}
        onClose={closeUpgradeModal}
      />
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
