// ===================================================
// Payments Service Types
// ===================================================

// ===================================================
// Tiers
// ===================================================

export type PricingTier = 'free' | 'pro' | 'agency';

export type BillingPeriod = 'monthly' | 'yearly';

// ===================================================
// Plan definitions
// ===================================================

export interface PlanFeature {
  id: string;
  label: string;
  tooltip?: string;
  free: boolean | string;   // true = included, false = not included, string = limited value
  pro: boolean | string;
  agency: boolean | string;
}

export interface UsageLimits {
  analysesPerDay: number | null;        // null = unlimited
  platforms: string[];                  // list of platform IDs allowed
  aiCopyGenerationsPerMonth: number | null;
  canExport: boolean;
  exportFormats: string[];
  analyticsWindowDays: number;
  canUseAppleMusic: boolean;
  canManageMultipleCampaigns: boolean;
  canWhiteLabel: boolean;
  canAccessApi: boolean;
  teamSeats: number;
}

export interface SubscriptionPlan {
  id: string;
  tier: PricingTier;
  name: string;
  description: string;
  monthlyPrice: number;  // USD per month
  yearlyPrice: number;   // USD per year (total)
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
  features: string[];    // human-readable feature bullets
  limits: UsageLimits;
  badge?: string;        // e.g. "Most Popular"
  color: string;         // tailwind color token
  icon: string;
}

// ===================================================
// Stripe integration
// ===================================================

export interface PaymentSession {
  sessionId: string;
  url: string;
  planId: string;
  userId: string;
  createdAt: string;
}

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete' | 'none';

export interface UserSubscription {
  userId: string;
  customerId?: string;
  subscriptionId?: string;
  tier: PricingTier;
  status: SubscriptionStatus;
  billingPeriod?: BillingPeriod;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  trialEnd?: string;
}

// ===================================================
// Usage tracking
// ===================================================

export interface UsageRecord {
  userId: string;
  analysesToday: number;
  aiCopyThisMonth: number;
  lastResetDate: string;
  lastMonthlyResetDate: string;
}

// ===================================================
// Webhook event shapes (server-side)
// ===================================================

export type StripeWebhookEvent =
  | { type: 'checkout.session.completed'; data: { object: { id: string; customer: string; subscription: string; metadata: Record<string, string> } } }
  | { type: 'customer.subscription.updated'; data: { object: { id: string; customer: string; status: SubscriptionStatus; current_period_end: number; cancel_at_period_end: boolean } } }
  | { type: 'customer.subscription.deleted'; data: { object: { id: string; customer: string } } };
