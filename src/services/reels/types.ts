// ===================================================
// Reels/Shorts Template Service Types
// ===================================================

// ===================================================
// Enums / Union Types
// ===================================================

export type VideoFormat =
  | 'tiktok-reel'     // 9:16
  | 'instagram-reel'  // 9:16
  | 'youtube-short'   // 9:16
  | 'story'           // 9:16
  | 'square';         // 1:1

export type SectionType = 'intro' | 'hook' | 'body' | 'cta' | 'outro';

export type AnimationStyle =
  | 'zoom-in'
  | 'pan'
  | 'ken-burns'
  | 'shake'
  | 'pulse'
  | 'glitch'
  | 'neon-glow';

export type TextAnimation = 'fade' | 'slide' | 'bounce' | 'typewriter';

export type TemplateCategory =
  | 'new-release'
  | 'playlist-promo'
  | 'artist-spotlight'
  | 'concert'
  | 'viral-trend'
  | 'behind-the-scenes';

// ===================================================
// Text Overlays
// ===================================================

export type TextPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface TextOverlay {
  id: string;
  content: string;
  position: TextPosition;
  fontSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  color: string;           // hex
  animation: TextAnimation;
  animationDelay?: number; // ms
  bold?: boolean;
  italic?: boolean;
}

// ===================================================
// Music Sync
// ===================================================

export interface MusicSync {
  beatDropMs?: number;    // timestamp to sync a visual beat-drop
  energyPeaks: number[];  // timestamps (ms) for cut suggestions
  recommendedBpmRange: { min: number; max: number };
}

// ===================================================
// Template Section
// ===================================================

export interface TemplateSection {
  id: string;
  type: SectionType;
  label: string;
  startMs: number;
  durationMs: number;
  backgroundColorHex: string;
  textOverlays: TextOverlay[];
  animationStyle: AnimationStyle;
  notes?: string; // production notes
}

// ===================================================
// Video Template
// ===================================================

export interface VideoTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  formats: VideoFormat[];
  totalDurationMs: number;
  sections: TemplateSection[];
  musicSync: MusicSync;
  colorPalette: string[];  // array of hex colors
  textStyles: {
    heading: Partial<TextOverlay>;
    body: Partial<TextOverlay>;
    cta: Partial<TextOverlay>;
  };
  tags: string[];
  isPro: boolean; // true = requires Pro+ subscription
}

// ===================================================
// Template Overrides (for customisation)
// ===================================================

export interface TemplateOverrides {
  sections?: Partial<TemplateSection>[];
  colorPalette?: string[];
  textStyles?: Partial<VideoTemplate['textStyles']>;
}
