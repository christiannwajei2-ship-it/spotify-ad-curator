// ===================================================
// WalkthroughOverlay — Guided tour overlay
// ===================================================

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemo } from '../../hooks/useDemo';

export const WalkthroughOverlay = () => {
  const {
    isWalkthroughActive,
    activeScenario,
    currentStep,
    stepNumber,
    totalSteps,
    progress,
    nextStep,
    prevStep,
    skipTour,
  } = useDemo();

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isWalkthroughActive) return;
      if (e.key === 'ArrowRight' || e.key === 'Enter') nextStep();
      if (e.key === 'ArrowLeft') prevStep();
      if (e.key === 'Escape') skipTour();
    },
    [isWalkthroughActive, nextStep, prevStep, skipTour]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isWalkthroughActive || !currentStep || !activeScenario) return null;

  const isFirst = stepNumber === 1;
  const isLast = stepNumber === totalSteps;

  return (
    <AnimatePresence>
      {isWalkthroughActive && (
        <>
          {/* Semi-transparent backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[900] pointer-events-none"
          />

          {/* Progress bar at top */}
          <motion.div
            key="progress-bar"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="fixed top-0 left-0 right-0 z-[950] h-1 bg-surface-border origin-left"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-brand-500 to-brand-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>

          {/* Tooltip bubble — centered */}
          <motion.div
            key="tooltip"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed z-[960] bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md px-4"
            role="dialog"
            aria-label={`Tour step ${stepNumber} of ${totalSteps}`}
          >
            <div className="bg-surface border border-surface-border rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-surface-border">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{activeScenario.icon}</span>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      {activeScenario.name}
                    </p>
                    <h3 className="text-white font-semibold text-sm leading-tight">
                      {currentStep.title}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 tabular-nums">
                    {stepNumber} / {totalSteps}
                  </span>
                  <button
                    onClick={skipTour}
                    className="text-gray-500 hover:text-white transition-colors p-1 rounded-md hover:bg-surface-elevated"
                    aria-label="Exit tour"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="px-5 py-4">
                <p className="text-sm text-gray-300 leading-relaxed">
                  {currentStep.text}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 pb-5">
                <button
                  onClick={skipTour}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Skip tour
                </button>
                <div className="flex items-center gap-2">
                  {!isFirst && (
                    <button
                      onClick={prevStep}
                      className="px-3 py-1.5 text-xs font-medium text-gray-400 border border-surface-border rounded-lg hover:bg-surface-elevated hover:text-white transition-colors"
                    >
                      ← Back
                    </button>
                  )}
                  <button
                    onClick={nextStep}
                    className="px-4 py-1.5 text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-colors"
                  >
                    {isLast ? '🎉 Finish' : 'Next →'}
                  </button>
                </div>
              </div>

              {/* Step dots */}
              <div className="flex justify-center gap-1 pb-4">
                {activeScenario.steps.map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all duration-300 ${
                      i === stepNumber - 1
                        ? 'w-4 h-1.5 bg-brand-400'
                        : i < stepNumber - 1
                          ? 'w-1.5 h-1.5 bg-brand-700'
                          : 'w-1.5 h-1.5 bg-surface-border'
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-center text-xs text-gray-600 mt-2">
              Use ← → arrow keys or Esc to exit
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
