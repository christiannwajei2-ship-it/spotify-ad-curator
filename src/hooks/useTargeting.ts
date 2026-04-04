import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from '../store';
import { generateTargeting } from '../services/targeting';
import { DEMO_TARGETING } from '../utils/demoData';

export const useTargeting = () => {
  const { analysis, isDemoMode, isLoading, setLoading, setError, setTargeting, setStep } = useAppStore();

  const generate = useCallback(async (dailyBudget = 2) => {
    if (!analysis) {
      toast.error('Please analyze a Spotify playlist first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isDemoMode) {
        await new Promise((r) => setTimeout(r, 1200));
        setTargeting({ ...DEMO_TARGETING, generatedAt: new Date().toISOString() });
        setStep('targeting');
        toast.success('Targeting recommendations ready! 🎯');
        return;
      }

      const targeting = generateTargeting(analysis, dailyBudget);
      setTargeting(targeting);
      setStep('targeting');
      toast.success('Targeting recommendations ready! 🎯');

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate targeting recommendations.';
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [analysis, isDemoMode, setLoading, setError, setTargeting, setStep]);

  return { generate, isLoading };
};
