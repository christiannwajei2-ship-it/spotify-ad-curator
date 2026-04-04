import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from '../store';
import { generateCampaign } from '../services/meta-ads';
import { DEMO_CAMPAIGN } from '../utils/demoData';

export const useAdGenerator = () => {
  const {
    analysis,
    targeting,
    currentCampaign,
    isDemoMode,
    isLoading,
    setLoading,
    setError,
    setCurrentCampaign,
    saveCampaign,
    setStep,
  } = useAppStore();

  const generate = useCallback(async (dailyBudget = 2) => {
    if (!analysis || !targeting) {
      toast.error('Please complete analysis and targeting first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isDemoMode) {
        await new Promise((r) => setTimeout(r, 1000));
        const campaign = { ...DEMO_CAMPAIGN, generatedAt: new Date().toISOString() };
        setCurrentCampaign(campaign);
        setStep('ad-generator');
        toast.success('Ad campaign generated! 📢');
        return;
      }

      const campaign = generateCampaign(analysis, targeting, dailyBudget);
      setCurrentCampaign(campaign);
      setStep('ad-generator');
      toast.success('Ad campaign generated! 📢');

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate ad campaign.';
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [analysis, targeting, isDemoMode, setLoading, setError, setCurrentCampaign, setStep]);

  const save = useCallback(() => {
    if (!currentCampaign) return;
    saveCampaign(currentCampaign);
    toast.success('Campaign saved! 💾');
  }, [currentCampaign, saveCampaign]);

  return { generate, save, isLoading };
};
