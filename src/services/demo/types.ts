// ===================================================
// Demo Service — TypeScript Types
// ===================================================

export interface DemoConfig {
  enabled: boolean;
  showTooltips: boolean;
  autoProgress: boolean;
}

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'center';

export interface WalkthroughStep {
  id: string;
  title: string;
  text: string;
  targetSelector?: string; // CSS selector for spotlight target
  position: TooltipPosition;
  action?: 'click' | 'navigate' | 'observe';
  navigateTo?: string; // AppStep to navigate to
  highlightColor?: string;
}

export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  estimatedMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
  steps: WalkthroughStep[];
  completionCriteria?: string;
}

export interface FeatureTour {
  featureId: string;
  label: string;
  icon: string;
  description: string;
  navigateTo: string;
  order: number;
}

export interface DemoState {
  activeScenarioId: string | null;
  currentStepIndex: number;
  completedScenarioIds: string[];
  exploredFeatureIds: string[];
  showOnboarding: boolean;
  onboardingStep: number;
}
