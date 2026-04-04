// ===================================================
// Demo Service — Walkthrough Engine
// ===================================================

import type { DemoScenario, WalkthroughStep } from './types';

const STORAGE_KEY = 'spotify-ad-curator-demo-completed';

// ── Completion tracking (localStorage) ─────────────

export const getCompletedScenarios = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
};

export const markScenarioComplete = (scenarioId: string): void => {
  const completed = getCompletedScenarios();
  if (!completed.includes(scenarioId)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed, scenarioId]));
  }
};

export const resetCompletedScenarios = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

// ── Progress helper ─────────────────────────────────

export const getProgress = (
  scenario: DemoScenario,
  currentStepIndex: number
): number => {
  if (scenario.steps.length === 0) return 100;
  return Math.round((currentStepIndex / scenario.steps.length) * 100);
};

// ── Step helpers ────────────────────────────────────

export const getCurrentStep = (
  scenario: DemoScenario,
  index: number
): WalkthroughStep | null => {
  return scenario.steps[index] ?? null;
};

export const isLastStep = (scenario: DemoScenario, index: number): boolean =>
  index >= scenario.steps.length - 1;

export const isFirstStep = (_scenario: DemoScenario, index: number): boolean =>
  index === 0;
