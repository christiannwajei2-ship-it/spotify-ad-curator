// ===================================================
// OnboardingWizard — First-time user onboarding
// ===================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemo } from '../../hooks/useDemo';
import { useAppStore } from '../../store';

const STEPS = [
  {
    id: 'welcome',
    emoji: '🎵',
    title: 'Welcome to Spotify Ad Curator',
    subtitle: 'Turn any playlist into a full ad campaign in minutes.',
    body: 'SpotifyAdCurator analyzes your Spotify playlists and automatically generates optimized ad campaigns for Meta, TikTok, YouTube, Google, and more — all from a single link.',
  },
  {
    id: 'how-it-works',
    emoji: '⚡',
    title: 'How it works',
    subtitle: 'Three steps to your first campaign.',
    body: null,
    steps: [
      { icon: '🔗', label: 'Paste a Spotify link', sub: 'Playlist, album, or artist URL' },
      { icon: '🔍', label: 'AI analyzes the data', sub: 'Genre, mood, tempo, popularity' },
      { icon: '📢', label: 'Export ad campaigns', sub: 'Ready for all 5 platforms' },
    ],
  },
  {
    id: 'choose-path',
    emoji: '🗺️',
    title: 'Choose your path',
    subtitle: 'How would you like to get started?',
    body: null,
  },
  {
    id: 'ready',
    emoji: '🚀',
    title: "You're all set!",
    subtitle: 'Paste your first Spotify link to begin.',
    body: 'Paste any public Spotify playlist URL below to analyze it. Or use Demo Mode to explore with pre-loaded sample data — no API keys needed.',
  },
];

interface OnboardingWizardProps {
  onQuickStart?: () => void;
  onFullTour?: () => void;
}

export const OnboardingWizard = ({ onQuickStart, onFullTour }: OnboardingWizardProps) => {
  const { showOnboarding, dismissOnboarding, startScenario } = useDemo();
  const { setDemoMode } = useAppStore();
  const [step, setStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!showOnboarding) return null;

  const currentStep = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;

  const handleClose = () => {
    if (dontShowAgain) {
      dismissOnboarding();
    } else {
      dismissOnboarding();
    }
  };

  const handleQuickStart = () => {
    dismissOnboarding();
    setDemoMode(true);
    startScenario('quick-start');
    onQuickStart?.();
  };

  const handleFullTour = () => {
    dismissOnboarding();
    setDemoMode(true);
    startScenario('full-campaign');
    onFullTour?.();
  };

  const handleSkip = () => {
    dismissOnboarding();
  };

  return (
    <div
      className="fixed inset-0 z-[980] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Spotify Ad Curator"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-surface border border-surface-border rounded-2xl shadow-2xl shadow-black/60 w-full max-w-lg overflow-hidden"
      >
        {/* Progress dots */}
        <div className="flex justify-center gap-2 pt-5">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`rounded-full transition-all duration-300 ${
                i === step ? 'w-5 h-2 bg-brand-400' : i < step ? 'w-2 h-2 bg-brand-700' : 'w-2 h-2 bg-surface-border'
              }`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="px-8 py-6 text-center"
          >
            <div className="text-5xl mb-4">{currentStep.emoji}</div>
            <h2 className="text-xl font-bold text-white mb-1">{currentStep.title}</h2>
            <p className="text-sm text-gray-400 mb-5">{currentStep.subtitle}</p>

            {currentStep.body && (
              <p className="text-sm text-gray-300 leading-relaxed text-left bg-surface-elevated rounded-xl p-4 border border-surface-border">
                {currentStep.body}
              </p>
            )}

            {currentStep.id === 'how-it-works' && currentStep.steps && (
              <div className="space-y-3 text-left">
                {currentStep.steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-4 bg-surface-elevated rounded-xl p-3.5 border border-surface-border">
                    <div className="w-10 h-10 rounded-xl bg-brand-900/40 border border-brand-800 flex items-center justify-center text-xl flex-shrink-0">
                      {s.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{s.label}</p>
                      <p className="text-xs text-gray-500">{s.sub}</p>
                    </div>
                    <div className="ml-auto text-brand-400 font-bold text-sm">
                      {i + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentStep.id === 'choose-path' && (
              <div className="space-y-3">
                <button
                  onClick={handleQuickStart}
                  className="w-full flex items-center gap-4 bg-brand-900/40 border border-brand-700 hover:border-brand-500 rounded-xl p-4 text-left transition-colors group"
                >
                  <span className="text-2xl">🚀</span>
                  <div>
                    <p className="text-sm font-semibold text-white">Quick Start (2 min)</p>
                    <p className="text-xs text-gray-400">Paste a link → See analysis → Generate one ad</p>
                  </div>
                  <span className="ml-auto text-brand-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button
                  onClick={handleFullTour}
                  className="w-full flex items-center gap-4 bg-surface-elevated border border-surface-border hover:border-brand-700 rounded-xl p-4 text-left transition-colors group"
                >
                  <span className="text-2xl">🗺️</span>
                  <div>
                    <p className="text-sm font-semibold text-white">Full Tour (5 min)</p>
                    <p className="text-xs text-gray-400">All 5 platforms, analytics, and advanced tools</p>
                  </div>
                  <span className="ml-auto text-gray-500 group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button
                  onClick={handleSkip}
                  className="w-full flex items-center gap-4 bg-surface-elevated border border-surface-border hover:border-surface-border/80 rounded-xl p-4 text-left transition-colors group opacity-60 hover:opacity-100"
                >
                  <span className="text-2xl">⏭️</span>
                  <div>
                    <p className="text-sm font-semibold text-white">Skip for now</p>
                    <p className="text-xs text-gray-400">I&apos;ll explore on my own</p>
                  </div>
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        {currentStep.id !== 'choose-path' && (
          <div className="flex items-center justify-between px-8 pb-6">
            <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-3.5 h-3.5 accent-brand-500"
              />
              Don&apos;t show again
            </label>

            <div className="flex items-center gap-2">
              {!isFirst && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="px-3 py-1.5 text-xs text-gray-400 border border-surface-border rounded-lg hover:bg-surface-elevated hover:text-white transition-colors"
                >
                  ← Back
                </button>
              )}
              {!isLast ? (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  className="px-4 py-1.5 text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-colors"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleClose}
                  className="px-4 py-1.5 text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-colors"
                >
                  Get started 🚀
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
