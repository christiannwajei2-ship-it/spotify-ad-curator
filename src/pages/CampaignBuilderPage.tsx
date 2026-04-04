import { motion } from 'framer-motion';
import { CampaignBuilder } from '../components/campaign-builder';
import { useAppStore } from '../store';
import toast from 'react-hot-toast';

export const CampaignBuilderPage = () => {
  const { setStep } = useAppStore();

  const handleLaunch = () => {
    toast.success('🚀 Campaign launched! Check Analytics for results.', { duration: 5000 });
    setTimeout(() => setStep('analytics'), 3000);
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Hero */}
      <div className="border-b border-surface-border bg-gradient-to-b from-brand-950/40 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-brand-800 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-brand-900/40">
                🔧
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Campaign Builder</h1>
                <p className="text-sm text-gray-400">
                  Drag &amp; drop platforms into your campaign pipeline
                </p>
              </div>
            </div>

            {/* Quick tips */}
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                '🖱️ Drag cards from the left panel',
                '📦 Drop them into pipeline stages',
                '🚀 Launch when all required stages are filled',
              ].map((tip) => (
                <span key={tip} className="text-xs text-gray-500 bg-surface-elevated border border-surface-border px-3 py-1 rounded-full">
                  {tip}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Builder */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <CampaignBuilder onLaunch={handleLaunch} />
      </div>
    </div>
  );
};
