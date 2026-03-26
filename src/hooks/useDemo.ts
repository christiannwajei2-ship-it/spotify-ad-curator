// ===================================================
// useDemo — Custom hook for demo system
// ===================================================

import { useState, useCallback, useEffect } from 'react';
import type { DemoScenario, WalkthroughStep } from '../services/demo/types';
import {
  DEMO_SCENARIOS,
  getScenarioById,
} from '../services/demo/scenarios';
import {
  getCompletedScenarios,
  markScenarioComplete,
  resetCompletedScenarios,
  getProgress,
  getCurrentStep,
  isLastStep,
  isFirstStep,
} from '../services/demo/walkthrough';
import { useAppStore } from '../store';
import type { AppStep } from '../types';

const STORAGE_ONBOARDING = 'spotify-ad-curator-onboarding-seen';
const STORAGE_EXPLORED = 'spotify-ad-curator-explored-features';

// ── Persist explored features ───────────────────────

const loadExplored = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_EXPLORED);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
};

const saveExplored = (ids: string[]) => {
  localStorage.setItem(STORAGE_EXPLORED, JSON.stringify(ids));
};

// ── Hook ────────────────────────────────────────────

export const useDemo = () => {
  const { isDemoMode, setDemoMode, setStep } = useAppStore();

  // Walkthrough state
  const [activeScenario, setActiveScenario] = useState<DemoScenario | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedScenarios, setCompletedScenarios] = useState<string[]>(() => getCompletedScenarios());

  // Onboarding
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_ONBOARDING) !== 'true';
    } catch {
      return true;
    }
  });

  // Explored features
  const [exploredFeatures, setExploredFeatures] = useState<string[]>(() => loadExplored());

  // ── Demo mode toggle ──────────────────────────────

  const toggleDemoMode = useCallback(() => {
    setDemoMode(!isDemoMode);
  }, [isDemoMode, setDemoMode]);

  // ── Scenario management ───────────────────────────

  const startScenario = useCallback((scenarioId: string) => {
    const scenario = getScenarioById(scenarioId);
    if (!scenario) return;
    setActiveScenario(scenario);
    setCurrentStepIndex(0);
    // Enable demo mode when a scenario starts
    setDemoMode(true);
    // Navigate to the first step's target page if specified
    const firstStep = scenario.steps[0];
    if (firstStep?.navigateTo) {
      setStep(firstStep.navigateTo as AppStep);
    }
  }, [setDemoMode, setStep]);

  const nextStep = useCallback(() => {
    if (!activeScenario) return;
    if (isLastStep(activeScenario, currentStepIndex)) {
      // Complete the scenario
      markScenarioComplete(activeScenario.id);
      setCompletedScenarios(getCompletedScenarios());
      setActiveScenario(null);
      setCurrentStepIndex(0);
      return;
    }
    const nextIndex = currentStepIndex + 1;
    const step = activeScenario.steps[nextIndex];
    if (step?.navigateTo) {
      setStep(step.navigateTo as AppStep);
    }
    setCurrentStepIndex(nextIndex);
  }, [activeScenario, currentStepIndex, setStep]);

  const prevStep = useCallback(() => {
    if (!activeScenario || isFirstStep(activeScenario, currentStepIndex)) return;
    const prevIndex = currentStepIndex - 1;
    const step = activeScenario.steps[prevIndex];
    if (step?.navigateTo) {
      setStep(step.navigateTo as AppStep);
    }
    setCurrentStepIndex(prevIndex);
  }, [activeScenario, currentStepIndex, setStep]);

  const skipTour = useCallback(() => {
    setActiveScenario(null);
    setCurrentStepIndex(0);
  }, []);

  const skipToStep = useCallback((index: number) => {
    if (!activeScenario) return;
    const step = activeScenario.steps[index];
    if (!step) return;
    if (step.navigateTo) {
      setStep(step.navigateTo as AppStep);
    }
    setCurrentStepIndex(index);
  }, [activeScenario, setStep]);

  // ── Onboarding ────────────────────────────────────

  const dismissOnboarding = useCallback(() => {
    localStorage.setItem(STORAGE_ONBOARDING, 'true');
    setShowOnboarding(false);
  }, []);

  // ── Feature exploration tracking ──────────────────

  const markFeatureExplored = useCallback((featureId: string) => {
    setExploredFeatures((prev) => {
      if (prev.includes(featureId)) return prev;
      const updated = [...prev, featureId];
      saveExplored(updated);
      return updated;
    });
  }, []);

  // ── Reset ─────────────────────────────────────────

  const resetDemoData = useCallback(() => {
    resetCompletedScenarios();
    localStorage.removeItem(STORAGE_EXPLORED);
    localStorage.removeItem(STORAGE_ONBOARDING);
    setCompletedScenarios([]);
    setExploredFeatures([]);
    setShowOnboarding(true);
    setActiveScenario(null);
    setCurrentStepIndex(0);
  }, []);

  // ── Derived values ────────────────────────────────

  const currentStep: WalkthroughStep | null = activeScenario
    ? getCurrentStep(activeScenario, currentStepIndex)
    : null;

  const progress: number = activeScenario
    ? getProgress(activeScenario, currentStepIndex)
    : 0;

  const totalSteps: number = activeScenario?.steps.length ?? 0;
  const stepNumber: number = currentStepIndex + 1;

  const isWalkthroughActive = activeScenario !== null;

  // Sync completed scenarios on mount
  useEffect(() => {
    setCompletedScenarios(getCompletedScenarios());
  }, []);

  return {
    // Demo mode
    isDemoMode,
    toggleDemoMode,

    // Scenarios
    scenarios: DEMO_SCENARIOS,
    activeScenario,
    startScenario,
    completedScenarios,

    // Walkthrough
    isWalkthroughActive,
    currentStep,
    currentStepIndex,
    stepNumber,
    totalSteps,
    progress,
    nextStep,
    prevStep,
    skipTour,
    skipToStep,

    // Onboarding
    showOnboarding,
    dismissOnboarding,

    // Features
    exploredFeatures,
    markFeatureExplored,

    // Reset
    resetDemoData,
  };
};
