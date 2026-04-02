# 🏗️ Spotify Ad Curator — Technical Architecture

## Module Dependency Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        App.tsx                              │
│  (step-based router + OnboardingWizard + WalkthroughOverlay)│
└──────────────────────────┬──────────────────────────────────┘
                           │
              ┌────────────▼────────────┐
              │       Header.tsx        │
              │  (nav + DemoModeToggle) │
              └────────────┬────────────┘
                           │
        ┌──────────────────┼──────────────────────┐
        │                  │                      │
   ┌────▼────┐       ┌─────▼──────┐        ┌─────▼──────┐
   │ Landing │       │  Dashboard │        │  DemoHub   │
   │  Page   │       │   Page     │        │   Page     │
   └────┬────┘       └─────┬──────┘        └─────┬──────┘
        │                  │                     │
        │          ┌───────┼───────┐             │
        │          │       │       │             │
        │      Target  AdGen  Analytics      ScenarioSelector
        │                               FeatureShowcase
        │
   SpotifyInput ──► useSpotifyAnalysis ──► services/spotify/
```

## Data Flow

```
User pastes Spotify URL
        │
        ▼
useSpotifyAnalysis.ts
        │
        ├── services/spotify/api.ts    (fetch playlist + tracks + audio features)
        ├── services/spotify/analysis.ts  (compute genre dist, mood profile)
        │
        ▼
AppStore.analysis (Zustand)
        │
        ├──► useTargeting.ts ──► services/targeting/
        │         └── TargetingRecommendation
        │
        ├──► useAdGenerator.ts ──► Meta / TikTok / YouTube / Google ad builders
        │         └── AdCampaign
        │
        ├──► useAICopy.ts ──► services/ai-copy/ (GPT)
        │
        ├──► useAnalytics.ts ──► services/analytics/
        │
        ├──► useScheduler.ts ──► services/scheduler/
        │
        └──► useReels.ts ──► services/reels/
```

## Service Layer Patterns

Every service module follows the same structure:

```
src/services/<feature>/
├── types.ts         # TypeScript interfaces for this feature
├── api.ts           # External API calls (or engine.ts for local logic)
├── templates.ts     # Pre-built data or templates (optional)
├── demo-data.ts     # Sample data for demo mode (optional)
└── index.ts         # Barrel export: export * from './types', etc.
```

## Component Hierarchy

```
App.tsx
├── Header (DemoModeToggle, SubscriptionBadge, nav items)
├── Pages (one per AppStep)
│   ├── Landing        → SpotifyInput, DemoAnalysisBanner
│   ├── Dashboard      → PlaylistCard, GenreChart, MoodRadar, ArtistList
│   ├── Targeting      → TargetingPanel, CountrySelector, InterestPicker
│   ├── AdGenerator    → TabBar → [MetaAdBuilder, TikTokCampaignBuilder,
│   │                             YouTubeAdBuilder, GoogleAdBuilder, AICopyGenerator]
│   ├── Analytics      → AnalyticsDashboard → [KPICards, PlatformChart, ...]
│   ├── Scheduler      → SchedulerDashboard → [ScheduleCard, ExecutionLog, ...]
│   ├── ReelsStudio    → TemplateGallery, TemplateEditor, VideoPreview, ...
│   ├── DemoHub        → ScenarioSelector, FeatureShowcase
│   ├── Pricing        → PricingCard, FeatureComparison
│   └── History        → SavedCampaignList
├── Footer
├── OnboardingWizard  (portal-level, first visit only)
└── WalkthroughOverlay (portal-level, during active tour)
```

## State Management

**Zustand** (`src/store/index.ts`) holds global app state:

```typescript
{
  currentStep: AppStep,      // current page/view
  analysis: PlaylistAnalysis | null,
  targeting: TargetingRecommendation | null,
  currentCampaign: AdCampaign | null,
  savedCampaigns: SavedCampaign[],
  isDemoMode: boolean,
  isLoading: boolean,
  error: string | null,
}
```

Persisted to `localStorage` via `zustand/middleware/persist` (key: `spotify-ad-curator`).

Feature-specific state lives in individual hooks using `useState` + `useCallback`, with localStorage persistence where needed.

## Feature Gating

Subscription tiers are enforced via `useSubscription()`:

```
free    → Analysis, Targeting, Meta Ads, Analytics, History
pro     → + TikTok, YouTube, Google, AI Copy, Apple Music, Reels Studio
agency  → + Auto-Refresh Scheduler, white-label exports
```

`SubscriptionBadge` in the header shows current tier. Clicking upgrades to the Pricing page.

## Demo Mode Architecture

```
VITE_DEMO_MODE=true  OR  isDemoMode=true (Zustand)
        │
        ▼
Each hook checks isDemoMode:
  if (isDemoMode) {
    return DEMO_DATA  // from services/<feature>/demo-data.ts
  } else {
    return await api.fetch(...)  // real API call
  }
```

Demo system (`src/services/demo/`):
- `scenarios.ts` — 5 guided walkthroughs with step-by-step instructions
- `walkthrough.ts` — completion tracking in localStorage
- `sample-data.ts` — coherent sample data across all features (same playlist → same campaign)

`useDemo()` hook manages:
- Active scenario + current step index
- Completed scenarios list
- Explored features list
- Onboarding wizard visibility

All localStorage keys are prefixed with `spotify-ad-curator-`.

## LocalStorage Keys Reference

| Key | Contents |
|-----|----------|
| `spotify-ad-curator` | Zustand persisted state (savedCampaigns, isDemoMode) |
| `spotify-ad-curator-demo-completed` | Array of completed scenario IDs |
| `spotify-ad-curator-explored-features` | Array of explored feature IDs |
| `spotify-ad-curator-onboarding-seen` | `"true"` once onboarding is dismissed |
| `spotify-ad-curator-schedules` | Saved scheduler schedules |
| `spotify-ad-curator-schedule-logs` | Scheduler execution history |
