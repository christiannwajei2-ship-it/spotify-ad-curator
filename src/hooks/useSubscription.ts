// ===================================================
// useSubscription — Custom hook for subscription management
// ===================================================

import { useState, useCallback, useEffect } from 'react';
import type { PricingTier, UserSubscription, BillingPeriod } from '../services/payments/types';
import type { GatedFeature } from '../services/payments/guards';
import {
  createCheckoutSession,
  createPortalSession,
  getSubscriptionStatus,
} from '../services/payments/api';
import {
  canAccessPlatform,
  canGenerateAICopy,
  canExportReport,
  canAnalyze,
  canViewAnalyticsPeriod,
  canUseAppleMusic,
  getRemainingUsage,
  getUpgradeMessage,
} from '../services/payments/guards';
import { PLANS } from '../services/payments/plans';

// ===================================================
// Demo usage state (in-memory, resets on page refresh)
// ===================================================

const DEMO_USAGE = {
  analysesToday: 0,
  aiCopyThisMonth: 0,
};

// ===================================================
// Hook
// ===================================================

export interface UpgradeModalState {
  isOpen: boolean;
  feature: GatedFeature | null;
}

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<UserSubscription>({
    userId: 'demo-user',
    tier: 'free',
    status: 'none',
  });
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [upgradeModal, setUpgradeModal] = useState<UpgradeModalState>({
    isOpen: false,
    feature: null,
  });
  const [usage, setUsage] = useState(DEMO_USAGE);

  // ── Load subscription on mount ──────────────────

  useEffect(() => {
    getSubscriptionStatus('demo-user')
      .then((sub) => setSubscription(sub))
      .catch(() => {/* keep default free tier */});
  }, []);

  // ── Current tier ────────────────────────────────

  const currentTier: PricingTier = subscription.tier;
  const currentPlan = PLANS[currentTier];

  // ── Feature access check ────────────────────────

  const canAccess = useCallback(
    (feature: GatedFeature): boolean => {
      switch (feature) {
        case 'tiktok':
        case 'youtube':
        case 'google-search':
        case 'google-display':
          return canAccessPlatform(currentTier, feature);
        case 'ai-copy':
          return canGenerateAICopy(currentTier, usage.aiCopyThisMonth);
        case 'export':
          return canExportReport(currentTier);
        case 'analytics-30d':
          return canViewAnalyticsPeriod(currentTier, 30);
        case 'analytics-90d':
          return canViewAnalyticsPeriod(currentTier, 90);
        case 'apple-music':
          return canUseAppleMusic(currentTier);
        case 'multi-campaign':
          return PLANS[currentTier]?.limits.canManageMultipleCampaigns ?? false;
        case 'white-label':
          return PLANS[currentTier]?.limits.canWhiteLabel ?? false;
        case 'api':
          return PLANS[currentTier]?.limits.canAccessApi ?? false;
        case 'team':
          return (PLANS[currentTier]?.limits.teamSeats ?? 1) > 1;
        default:
          return false;
      }
    },
    [currentTier, usage]
  );

  // ── Guard helper: show upgrade modal if blocked ──

  const requireAccess = useCallback(
    (feature: GatedFeature): boolean => {
      if (canAccess(feature)) return true;
      setUpgradeModal({ isOpen: true, feature });
      return false;
    },
    [canAccess]
  );

  // ── Checkout ────────────────────────────────────

  const checkout = useCallback(
    async (planId: string, period?: BillingPeriod) => {
      setIsLoading(true);
      try {
        const session = await createCheckoutSession(planId, subscription.userId);
        // In demo mode the URL is '#demo-checkout' — we just show a success simulation
        if (session.url === '#demo-checkout') {
          // Demo: simulate successful upgrade
          const plan = PLANS[planId];
          if (plan) {
            setSubscription({
              userId: subscription.userId,
              tier: plan.tier,
              status: 'active',
              billingPeriod: period ?? billingPeriod,
              currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            });
          }
          setUpgradeModal({ isOpen: false, feature: null });
          return session;
        }
        // Real mode: redirect to Stripe
        window.location.href = session.url;
        return session;
      } finally {
        setIsLoading(false);
      }
    },
    [subscription.userId, billingPeriod]
  );

  // ── Manage subscription ──────────────────────────

  const manageSubscription = useCallback(async () => {
    if (!subscription.customerId) return;
    setIsLoading(true);
    try {
      const portal = await createPortalSession(subscription.customerId);
      if (portal.url !== '#demo-portal') {
        window.location.href = portal.url;
      }
    } finally {
      setIsLoading(false);
    }
  }, [subscription.customerId]);

  // ── Usage tracking helpers ───────────────────────

  const recordAnalysis = useCallback(() => {
    setUsage((prev) => ({ ...prev, analysesToday: prev.analysesToday + 1 }));
  }, []);

  const recordAICopy = useCallback(() => {
    setUsage((prev) => ({ ...prev, aiCopyThisMonth: prev.aiCopyThisMonth + 1 }));
  }, []);

  const canAnalyzeNow = canAnalyze(currentTier, usage.analysesToday);
  const remainingUsage = getRemainingUsage(currentTier, usage);

  // ── Upgrade modal helpers ────────────────────────

  const openUpgradeModal = useCallback((feature: GatedFeature) => {
    setUpgradeModal({ isOpen: true, feature });
  }, []);

  const closeUpgradeModal = useCallback(() => {
    setUpgradeModal({ isOpen: false, feature: null });
  }, []);

  const upgradeMessage = upgradeModal.feature ? getUpgradeMessage(upgradeModal.feature) : null;

  return {
    // State
    subscription,
    currentTier,
    currentPlan,
    billingPeriod,
    setBillingPeriod,
    isLoading,
    isDemo: true,

    // Feature gating
    canAccess,
    requireAccess,

    // Actions
    checkout,
    manageSubscription,

    // Usage
    usage,
    remainingUsage,
    canAnalyzeNow,
    recordAnalysis,
    recordAICopy,

    // Upgrade modal
    upgradeModal,
    upgradeMessage,
    openUpgradeModal,
    closeUpgradeModal,
  };
};
