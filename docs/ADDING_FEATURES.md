# 🧩 Adding New Features

The app uses a **modular architecture** designed for easy extension.

## Architecture Overview

```
src/
├── services/        ← API integrations (add new platforms here)
├── components/      ← UI components (add new UI here)
├── pages/           ← Routes/pages (add new pages here)
├── hooks/           ← Custom hooks (add new hooks here)
└── store/           ← Global state (extend Zustand store)
```

## Adding a New Ad Platform (e.g., TikTok)

### 1. Create the service

```
src/services/tiktok-ads/
├── api.ts        ← TikTok API calls
├── generator.ts  ← Campaign/creative generation
├── templates.ts  ← TikTok-specific ad copy templates
├── types.ts      ← TypeScript types
└── index.ts      ← Exports
```

### 2. Follow the same pattern as `meta-ads/generator.ts`:

```typescript
// src/services/tiktok-ads/generator.ts
export const generateTikTokCampaign = (
  analysis: PlaylistAnalysis,
  targeting: TargetingRecommendation
): TikTokCampaign => {
  // ...
};
```

### 3. Add a new hook

```typescript
// src/hooks/useTikTokGenerator.ts
export const useTikTokGenerator = () => {
  // Mirror useAdGenerator.ts pattern
};
```

### 4. Add UI

Create a new page or tab in AdGenerator.tsx for the TikTok campaign output.

---

## Adding a New Analysis Module

### Example: BPM/Tempo Analysis

```typescript
// src/services/spotify/tempoAnalyzer.ts
export const analyzeTempoDistribution = (features: SpotifyAudioFeatures[]) => {
  // Group tracks by BPM range
  // Return distribution data
};
```

Then use it in `analyzePlaylist()` in `analyzer.ts`.

---

## Adding a New Page

1. Create `src/pages/MyNewPage.tsx`
2. Add to the `AppStep` union in `src/types/index.ts`
3. Add to `renderPage()` switch in `src/App.tsx`
4. Add to `navItems` in `src/components/layout/Header.tsx`

---

## Adding New Countries to Targeting

Edit `src/services/targeting/countries.ts` and add entries to `GENRE_COUNTRY_MAP`.

## Adding New Genres

1. Add to `GENRE_COUNTRY_MAP` in `countries.ts`
2. Add to `GENRE_DEMOGRAPHICS` in `demographics.ts`
3. Add to `GENRE_INTERESTS` in `demographics.ts`
4. Add to `GENRE_KEYWORD_MAP` in `countries.ts`
