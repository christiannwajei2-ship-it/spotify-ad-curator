// ===================================================
// Pricing Page
// ===================================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PricingTable } from '../components/payments/PricingTable';
import { PaymentSuccess } from '../components/payments/PaymentSuccess';
import { useSubscription } from '../hooks/useSubscription';
import type { BillingPeriod, PricingTier } from '../services/payments/types';

const FAQ_ITEMS = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes! You can cancel your subscription at any time from your account settings. You\'ll keep access until the end of your current billing period.',
  },
  {
    q: 'Is there a free trial?',
    a: 'The Free tier is available forever with no credit card required. You can try Pro features risk-free with our 30-day money-back guarantee.',
  },
  {
    q: 'What happens to my data if I downgrade?',
    a: 'Your campaign data and history are always preserved. You just lose access to the features that require a higher tier.',
  },
  {
    q: 'Do I need Stripe / payment details to use the Free tier?',
    a: 'No — the Free tier never requires a credit card. Payment details are only needed when upgrading to Pro or Agency.',
  },
  {
    q: 'Can I switch between monthly and yearly billing?',
    a: 'Yes. You can switch billing periods from the customer portal at any time. Switching to yearly will credit any remaining monthly balance.',
  },
  {
    q: 'What does "white-label export" mean?',
    a: 'Agency tier exports remove SpotifyAdCurator branding so you can present reports directly to your artist clients.',
  },
];

export const Pricing = () => {
  const {
    currentTier,
    checkout,
    isLoading,
    subscription,
  } = useSubscription();

  const [successTier, setSuccessTier] = useState<PricingTier | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSelectPlan = async (planId: string, period: BillingPeriod) => {
    if (planId === 'free') return;
    try {
      await checkout(planId, period);
      // In demo mode checkout() upgrades inline, so show success screen
      setSuccessTier(planId as PricingTier);
    } catch (err) {
      console.error('Checkout error:', err);
    }
  };

  if (successTier) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PaymentSuccess
          tier={successTier}
          onContinue={() => setSuccessTier(null)}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="inline-block px-3 py-1 rounded-full bg-brand-900/60 border border-brand-800 text-brand-300 text-xs font-semibold mb-4">
            💳 Pricing
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Start free. Upgrade when you're ready to scale your music marketing across every platform.
          </p>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-400"
        >
          <span>✅ No credit card required</span>
          <span>✅ 30-day money-back guarantee</span>
          <span>✅ Cancel anytime</span>
        </motion.div>
      </div>

      {/* Current plan notice */}
      {subscription.status === 'active' && (
        <div className="mb-8 flex items-center justify-center">
          <div className="px-4 py-2 rounded-xl bg-green-900/30 border border-green-800 text-green-300 text-sm">
            ✓ You're currently on the <strong>{currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}</strong> plan
          </div>
        </div>
      )}

      {/* Pricing table */}
      <PricingTable
        currentTier={currentTier}
        isLoading={isLoading}
        onSelectPlan={handleSelectPlan}
      />

      {/* Money-back badge */}
      <div className="mt-12 flex items-center justify-center">
        <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-surface-elevated border border-surface-border">
          <span className="text-3xl">🛡️</span>
          <div>
            <p className="text-white font-semibold text-sm">30-Day Money-Back Guarantee</p>
            <p className="text-gray-400 text-xs">
              Not happy? We'll refund you in full — no questions asked.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials placeholder */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          Loved by independent artists & labels
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: "SpotifyAdCurator cut my time spent on ad targeting in half. The AI copy generator is 🔥",
              name: 'DJ Kemi',
              role: 'Afrobeats artist, Lagos',
              avatar: '🎧',
            },
            {
              quote: "We manage 12 artists and the Agency plan saves us hours every week. The export quality is agency-grade.",
              name: 'Tunde A.',
              role: 'Music marketing agency',
              avatar: '🏢',
            },
            {
              quote: "Went from 2k to 40k monthly listeners in 3 months using the targeting recommendations.",
              name: 'Zara M.',
              role: 'R&B singer-songwriter',
              avatar: '🎤',
            },
          ].map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="bg-surface-card border border-surface-border rounded-2xl p-6"
            >
              <p className="text-gray-300 text-sm mb-4 italic">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{t.avatar}</span>
                <div>
                  <p className="text-white text-sm font-semibold">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="max-w-2xl mx-auto space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-surface-border overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left bg-surface-card hover:bg-surface-elevated transition-colors duration-200"
              >
                <span className="text-sm font-medium text-white">{item.q}</span>
                <span className="text-gray-400 text-lg ml-4">
                  {openFaq === i ? '−' : '+'}
                </span>
              </button>
              {openFaq === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-5 pb-4 bg-surface-elevated"
                >
                  <p className="text-sm text-gray-400">{item.a}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
