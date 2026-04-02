export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceCard: string;
  surfaceElevated: string;
  surfaceBorder: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  accent: string;
  accentHover: string;
  accentMuted: string;
}

export interface ThemeConfig {
  mode: ThemeMode;
  resolved: 'light' | 'dark';
  colors: ThemeColors;
}
