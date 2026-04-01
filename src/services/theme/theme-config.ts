import type { ThemeColors } from './types';

export const darkColors: ThemeColors = {
  background: '#0f0f13',
  surface: '#0f0f13',
  surfaceCard: '#16161d',
  surfaceElevated: '#1e1e28',
  surfaceBorder: '#2a2a38',
  text: '#ffffff',
  textMuted: '#a1a1aa',
  textSubtle: '#71717a',
  accent: '#a855f7',
  accentHover: '#9333ea',
  accentMuted: '#581c87',
};

export const lightColors: ThemeColors = {
  background: '#f8f9fa',
  surface: '#ffffff',
  surfaceCard: '#f1f3f5',
  surfaceElevated: '#e9ecef',
  surfaceBorder: '#dee2e6',
  text: '#1a1a2e',
  textMuted: '#495057',
  textSubtle: '#868e96',
  accent: '#9333ea',
  accentHover: '#7e22ce',
  accentMuted: '#e9d5ff',
};

export const sharedTokens = {
  borderRadius: {
    sm: '0.375rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },
  transition: {
    default: 'all 0.2s ease',
    slow: 'all 0.4s ease',
  },
  shadow: {
    sm: '0 1px 3px rgba(0,0,0,0.12)',
    md: '0 4px 12px rgba(0,0,0,0.15)',
    lg: '0 8px 32px rgba(0,0,0,0.2)',
    accent: '0 4px 20px rgba(168,85,247,0.3)',
  },
};
