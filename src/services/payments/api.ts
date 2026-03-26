// ===================================================
// Payments Service — Stripe API Integration
// ===================================================
// Demo-safe: all functions gracefully handle missing Stripe keys
// and return mock responses in demo mode.

import type { PaymentSession, UserSubscription, SubscriptionStatus } from './types';
import { PLANS } from './plans';

// ===================================================
// Environment
// ===================================================

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
const IS_DEMO = !STRIPE_PUBLISHABLE_KEY || import.meta.env.VITE_DEMO_MODE === 'true';

// ===================================================
// Demo helpers
// ===================================================

const DEMO_USER_ID = 'demo-user-001';

function demoPause(ms = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function demoSession(planId: string): PaymentSession {
  return {
    sessionId: `demo_cs_${Date.now()}`,
    url: '#demo-checkout',
    planId,
    userId: DEMO_USER_ID,
    createdAt: new Date().toISOString(),
  };
}

function demoSubscription(tier: 'free' | 'pro' | 'agency' = 'free'): UserSubscription {
  return {
    userId: DEMO_USER_ID,
    tier,
    status: tier === 'free' ? 'none' : 'active',
    billingPeriod: tier === 'free' ? undefined : 'monthly',
    currentPeriodEnd: tier === 'free'
      ? undefined
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

// ===================================================
// Public API
// ===================================================

/**
 * Create a Stripe Checkout session for the given plan.
 * In demo mode returns a mock session without calling Stripe.
 */
export async function createCheckoutSession(
  planId: string,
  userId: string
): Promise<PaymentSession> {
  const plan = PLANS[planId];
  if (!plan) throw new Error(`Unknown plan: ${planId}`);
  if (plan.tier === 'free') throw new Error('Cannot checkout free plan');

  if (IS_DEMO) {
    await demoPause();
    return demoSession(planId);
  }

  // Real implementation — requires a backend endpoint that calls Stripe
  const response = await fetch('/api/payments/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId, userId }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message ?? 'Failed to create checkout session');
  }

  return response.json() as Promise<PaymentSession>;
}

/**
 * Create a Stripe Customer Portal session so users can manage their subscription.
 */
export async function createPortalSession(customerId: string): Promise<{ url: string }> {
  if (IS_DEMO) {
    await demoPause(400);
    return { url: '#demo-portal' };
  }

  const response = await fetch('/api/payments/portal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerId }),
  });

  if (!response.ok) {
    throw new Error('Failed to create portal session');
  }

  return response.json() as Promise<{ url: string }>;
}

/**
 * Fetch the current subscription status for a user.
 */
export async function getSubscriptionStatus(userId: string): Promise<UserSubscription> {
  if (IS_DEMO) {
    await demoPause(300);
    return demoSubscription('free');
  }

  const response = await fetch(`/api/payments/subscription?userId=${encodeURIComponent(userId)}`);

  if (!response.ok) {
    // Fall back to free tier on error rather than crashing
    return { userId, tier: 'free', status: 'none' };
  }

  return response.json() as Promise<UserSubscription>;
}

/**
 * Cancel a subscription at period end.
 */
export async function cancelSubscription(subscriptionId: string): Promise<{ cancelAtPeriodEnd: boolean }> {
  if (IS_DEMO) {
    await demoPause(500);
    return { cancelAtPeriodEnd: true };
  }

  const response = await fetch('/api/payments/cancel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscriptionId }),
  });

  if (!response.ok) {
    throw new Error('Failed to cancel subscription');
  }

  return response.json() as Promise<{ cancelAtPeriodEnd: boolean }>;
}

// ===================================================
// Stripe.js loader (lazy, only when needed)
// ===================================================

export function isStripeConfigured(): boolean {
  return Boolean(STRIPE_PUBLISHABLE_KEY);
}

export function isDemoMode(): boolean {
  return IS_DEMO;
}

// ===================================================
// Webhook event validation helpers (server-side use only)
// ===================================================

export const WEBHOOK_EVENTS = {
  CHECKOUT_COMPLETED: 'checkout.session.completed',
  SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
} as const;

export type WebhookEventType = typeof WEBHOOK_EVENTS[keyof typeof WEBHOOK_EVENTS];

export function mapStripeStatus(stripeStatus: string): SubscriptionStatus {
  const map: Record<string, SubscriptionStatus> = {
    active: 'active',
    canceled: 'canceled',
    past_due: 'past_due',
    trialing: 'trialing',
    incomplete: 'incomplete',
    incomplete_expired: 'canceled',
    unpaid: 'past_due',
  };
  return map[stripeStatus] ?? 'none';
}
