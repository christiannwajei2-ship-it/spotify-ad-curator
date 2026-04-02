# 🎵 Spotify Ad Curator — Feature Documentation

Detailed documentation for all 11 feature modules.

---

## 1. 🔍 Playlist Analysis

**Description:** Analyzes any public Spotify playlist, album, or artist URL to extract actionable data for ad targeting.

**Key Files:**
- `src/services/spotify/` — Spotify Web API client, analysis engine
- `src/components/spotify/` — URL input and analysis display
- `src/hooks/useSpotifyAnalysis.ts`
- `src/pages/Dashboard.tsx`

**How to Use:**
1. Paste any Spotify URL into the input on the Landing page
2. Click "Analyze" — the app calls the Spotify API to fetch tracks, audio features, and artist data
3. View the breakdown: genre distribution, mood profile (energy, danceability, valence), popularity stats, and top artists

**Configuration:**
- `VITE_SPOTIFY_CLIENT_ID` + `VITE_SPOTIFY_CLIENT_SECRET` for live mode
- Demo mode uses a pre-loaded Afrobeats playlist analysis

---

## 2. 🎯 Smart Targeting

**Description:** Translates playlist analysis data into precise ad audience recommendations.

**Key Files:**
- `src/services/targeting/` — targeting recommendation engine
- `src/components/targeting/` — targeting display and editor
- `src/hooks/useTargeting.ts`
- `src/pages/Targeting.tsx`

**How to Use:**
1. After analyzing a playlist, navigate to the Targeting page
2. Review AI-suggested countries, age ranges, and interest categories
3. Adjust suggestions manually if needed
4. Targeting carries through to all ad platform generators

**Configuration:** No API keys required — targeting logic runs locally.

---

## 3. 📘 Meta Ads (Facebook + Instagram)

**Description:** Generates complete Meta ad campaigns with carousel, single image, video, and story formats.

**Key Files:**
- `src/services/meta-ads/` — Meta Marketing API client and campaign builder
- `src/components/ads/` — Meta ad preview and builder UI
- `src/hooks/useAdGenerator.ts`
- `src/pages/AdGenerator.tsx`

**How to Use:**
1. Complete playlist analysis and targeting
2. Open the Ad Generator and select the Meta tab
3. Choose ad format (carousel, video, story)
4. Preview and export the campaign JSON

**Configuration:** `VITE_META_APP_ID`, `VITE_META_ACCESS_TOKEN`, `VITE_META_AD_ACCOUNT_ID`

---

## 4. 🎵 TikTok Ads

**Description:** In-Feed and TopView ad templates with BPM-matched music hook suggestions.

**Key Files:**
- `src/services/tiktok-ads/` — TikTok Marketing API client and templates
- `src/components/ads/TikTokAdPreview.tsx`, `TikTokCampaignBuilder.tsx`
- `src/hooks/useTikTokAds.ts`

**How to Use:**
1. Select the TikTok tab in the Ad Generator
2. Choose a template (In-Feed Hook, Brand Takeover, TopView)
3. The generator matches your playlist's tempo and energy to TikTok-native music cues
4. Export the brief or full campaign JSON

**Configuration:** `VITE_TIKTOK_ACCESS_TOKEN`, `VITE_TIKTOK_ADVERTISER_ID`

---

## 5. ▶️ YouTube Ads

**Description:** Pre-roll, mid-roll, and bumper ad campaigns targeting music genre affinities on YouTube.

**Key Files:**
- `src/services/youtube-ads/` — YouTube Ads API integration
- `src/components/ads/` — YouTube ad preview components
- `src/hooks/useYouTubeAds.ts`

**How to Use:**
1. Select the YouTube tab in the Ad Generator
2. Choose ad format (skippable pre-roll, non-skippable, bumper)
3. Review genre-matched audience targeting
4. Export the campaign

**Configuration:** `VITE_GOOGLE_ADS_CLIENT_ID`, `VITE_GOOGLE_ADS_DEVELOPER_TOKEN`, `VITE_GOOGLE_ADS_CUSTOMER_ID`

---

## 6. 🔎 Google Search & Display

**Description:** Keyword clusters extracted from genre and artist names, plus display retargeting campaigns.

**Key Files:**
- `src/services/google-ads/` — Google Ads API client and keyword generator
- `src/components/ads/` — Google ad preview components
- `src/hooks/useGoogleAds.ts`

**How to Use:**
1. Select the Google tab in the Ad Generator
2. Review auto-generated keyword clusters (e.g., "best afrobeats playlist 2024")
3. Choose Search or Display campaign type
4. Export the campaign

**Configuration:** `VITE_GOOGLE_ADS_CLIENT_ID`, `VITE_GOOGLE_ADS_DEVELOPER_TOKEN`, `VITE_GOOGLE_ADS_CUSTOMER_ID`

---

## 7. 🤖 AI Copy Generator

**Description:** GPT-powered ad copy generator that creates unlimited variations for all platforms.

**Key Files:**
- `src/services/ai-copy/` — OpenAI API client and prompt templates
- `src/components/ai/` — copy generator UI
- `src/hooks/useAICopy.ts`

**How to Use:**
1. Select the AI Copy tab in the Ad Generator
2. Choose tone (hype, emotional, informative, humorous), length, and CTA style
3. Generate multiple variations at once
4. Copy to clipboard or include in campaign export

**Configuration:** Requires OpenAI API key in server environment (not exposed to frontend).

---

## 8. 📊 Analytics Dashboard

**Description:** Unified campaign performance dashboard showing 30 days of metrics across all platforms.

**Key Files:**
- `src/services/analytics/` — data aggregation and calculation
- `src/components/analytics/` — recharts-based charts and stats
- `src/hooks/useAnalytics.ts`
- `src/pages/Analytics.tsx`

**How to Use:**
1. Navigate to the Analytics page from the header
2. View KPI overview: impressions, clicks, conversions, spend, ROAS
3. Drill into platform breakdown, genre correlation, and audience insights
4. Toggle date range (7/14/30 days)

**Configuration:** No additional keys — reads from saved campaign history.

---

## 9. ⏰ Auto-Refresh Scheduler

**Description:** Rule-based campaign scheduler that auto-pauses underperformers and boosts top ads.

**Key Files:**
- `src/services/scheduler/` — schedule engine, rules, execution history
- `src/components/scheduler/` — dashboard, builder, execution log
- `src/hooks/useScheduler.ts`
- `src/pages/Scheduler.tsx`

**How to Use:**
1. Navigate to the Scheduler page
2. Create a new schedule: set frequency (hourly/daily/weekly), platforms, and action
3. Configure performance rules (e.g., pause if CTR < 0.5%)
4. Schedules run automatically; view history in the Execution Log tab

**Configuration:** No API keys required for scheduling logic. Platform API keys needed to apply changes live.

**Tier:** Agency

---

## 10. 🎬 Reels/Shorts Studio

**Description:** Shot list and storyboard generator for Instagram Reels, TikTok, and YouTube Shorts.

**Key Files:**
- `src/services/reels/` — template engine, generator, export formats
- `src/components/reels/` — gallery, editor, timeline, video preview
- `src/hooks/useReels.ts`
- `src/pages/ReelsStudio.tsx`

**How to Use:**
1. Navigate to the Reels Studio page
2. Browse 6 pre-built templates (Viral Hook, Playlist Showcase, Artist Spotlight, etc.)
3. Customize section timings, colors, text overlays, and animations
4. Preview in the phone mockup (9:16 aspect ratio)
5. Export as JSON, Shot List (markdown), CSV, CapCut project, or FFmpeg script

**Tier:** Pro

---

## 11. 🎮 Demo Hub

**Description:** Interactive demo center with guided tours, sample data, and first-time onboarding.

**Key Files:**
- `src/services/demo/` — scenarios, walkthrough engine, sample data
- `src/components/demo/` — toggle, overlay, selector, showcase, wizard
- `src/hooks/useDemo.ts`
- `src/pages/DemoHub.tsx`

**How to Use:**
1. Click "Demo Hub" in the navigation
2. Select a scenario and click "Start Tour"
3. Follow the step-by-step walkthrough (use arrow keys or buttons)
4. Explore the feature grid to mark features as visited
5. Click "Reset Demo Data" to start fresh

**Scenarios:**
| Name | Time | Difficulty |
|------|------|------------|
| Quick Start | 2 min | Beginner |
| Full Campaign Builder | 5 min | Intermediate |
| Platform Tour | 3 min | Beginner |
| Analytics Deep Dive | 3 min | Intermediate |
| Power User | 5 min | Advanced |

**LocalStorage Keys:**
- `spotify-ad-curator-demo-completed` — completed scenario IDs
- `spotify-ad-curator-explored-features` — explored feature IDs
- `spotify-ad-curator-onboarding-seen` — onboarding dismissed flag
