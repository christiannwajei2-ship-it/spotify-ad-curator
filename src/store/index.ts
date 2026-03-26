import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PlaylistAnalysis, TargetingRecommendation, AdCampaign, AppStep, SavedCampaign } from '../types';

interface AppStore {
  // UI state
  currentStep: AppStep;
  spotifyUrl: string;
  isLoading: boolean;
  error: string | null;
  isDemoMode: boolean;

  // Data
  analysis: PlaylistAnalysis | null;
  targeting: TargetingRecommendation | null;
  currentCampaign: AdCampaign | null;
  savedCampaigns: SavedCampaign[];

  // Actions
  setStep: (step: AppStep) => void;
  setSpotifyUrl: (url: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setDemoMode: (demo: boolean) => void;
  setAnalysis: (analysis: PlaylistAnalysis | null) => void;
  setTargeting: (targeting: TargetingRecommendation | null) => void;
  setCurrentCampaign: (campaign: AdCampaign | null) => void;
  saveCampaign: (campaign: AdCampaign) => void;
  deleteCampaign: (id: string) => void;
  reset: () => void;
}

const initialState = {
  currentStep: 'landing' as AppStep,
  spotifyUrl: '',
  isLoading: false,
  error: null,
  isDemoMode: import.meta.env.VITE_DEMO_MODE === 'true',
  analysis: null,
  targeting: null,
  currentCampaign: null,
  savedCampaigns: [],
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step) => set({ currentStep: step }),
      setSpotifyUrl: (url) => set({ spotifyUrl: url }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setDemoMode: (demo) => set({ isDemoMode: demo }),
      setAnalysis: (analysis) => set({ analysis }),
      setTargeting: (targeting) => set({ targeting }),
      setCurrentCampaign: (campaign) => set({ currentCampaign: campaign }),

      saveCampaign: (campaign) => {
        const saved: SavedCampaign = {
          ...campaign,
          savedAt: new Date().toISOString(),
        };
        set((state) => ({
          savedCampaigns: [saved, ...state.savedCampaigns.filter((c) => c.id !== campaign.id)],
        }));
      },

      deleteCampaign: (id) => {
        set((state) => ({
          savedCampaigns: state.savedCampaigns.filter((c) => c.id !== id),
        }));
      },

      reset: () => {
        const { isDemoMode, savedCampaigns } = get();
        set({ ...initialState, isDemoMode, savedCampaigns });
      },
    }),
    {
      name: 'spotify-ad-curator',
      partialize: (state) => ({
        savedCampaigns: state.savedCampaigns,
        isDemoMode: state.isDemoMode,
      }),
    }
  )
);
