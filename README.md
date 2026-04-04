# 🎵 Spotify Ad Curator

![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.3-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)

> **Turn any Spotify playlist into a full multi-platform ad campaign in under 5 minutes.**

Paste a Spotify playlist URL and get instant analysis, AI-matched audience targeting, and ready-to-export ad campaigns for Meta, TikTok, YouTube, Google Search & Display, with analytics, scheduling, and Reels/Shorts storyboards — all in one tool.

<<<<<<< HEAD
1. 🔍 **Deep Playlist Analysis** — Genres, mood profile, popularity stats, top artists  
2. 🎯 **Smart Audience Targeting** — AI-matched countries, age ranges, and Meta interests  
3. 📢 **Auto-Generated Ad Campaigns** — Complete Facebook + Instagram campaigns with proven copy  
4. 💰 **Ultra-Low Budget Optimization** — $1–3/day campaigns that actually convert
=======
## 📸 Demo
>>>>>>> origin/copilot/add-reels-support

Enable **Demo Mode** on first launch to explore all features with pre-loaded Afrobeats sample data. No API keys needed.

## ✨ Features

| # | Feature | Description | Tier |
|---|---------|-------------|------|
| 1 | 🔍 **Playlist Analysis** | Genre, mood, popularity & artist breakdown from any Spotify link | Free |
| 2 | 🎯 **Smart Targeting** | AI-matched countries, age ranges, and interest categories | Free |
| 3 | 📘 **Meta Ads** | Facebook & Instagram campaigns with carousel, video, story formats | Free |
| 4 | 🎵 **TikTok Ads** | In-Feed and TopView ads with music-sync templates | Pro |
| 5 | ▶️ **YouTube Ads** | Pre-roll and bumper ads targeting genre affinities | Pro |
| 6 | 🔎 **Google Search & Display** | Keyword clusters from genre/artist data + retargeting | Pro |
| 7 | 🤖 **AI Copy Generator** | Unlimited ad copy variations via GPT | Pro |
| 8 | 📊 **Analytics Dashboard** | 30-day campaign performance across all platforms | Free |
| 9 | ⏰ **Auto-Refresh Scheduler** | Auto-pause losers, boost winners on a schedule | Agency |
| 10 | 🎬 **Reels/Shorts Studio** | Shot lists and storyboards for Reels, TikTok & Shorts | Pro |
| 11 | 🎮 **Demo Hub** | Guided tours, sample data, and interactive onboarding | Free |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/christiannwajei2-ship-it/spotify-ad-curator.git
cd spotify-ad-curator

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start the development server
npm run dev
```

The app opens at `http://localhost:5173`. It works in **Demo Mode** immediately — no API keys needed.

<<<<<<< HEAD
---

## 🛠️ Tech Stack

| Layer       | Technology                      |
| ----------- | ------------------------------ |
| **Frontend**| React 18 + Vite + TypeScript   |
| **Styling** | TailwindCSS + Framer Motion    |
| **State**   | Zustand                        |
| **Charts**  | Recharts                       |
| **APIs**    | Spotify Web API + Meta Marketing API |

---
=======
### Build for Production

```bash
npm run build
npm run preview
```
>>>>>>> origin/copilot/add-reels-support

## 🔑 Environment Variables

All variables are prefixed with `VITE_` so Vite exposes them to the frontend.

<<<<<<< HEAD
Built with ❤️ for Spotify playlist curators

---

## 📝 Changelog

### [v1.5.0] - 2026-04-02
#### Added
- Full dark/light theme support
- Real-time analytics dashboards
- In-app and Slack notifications
#### Fixed
- Merge conflicts in App state type
#### Changed
- Refined mobile navigation
=======
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_DEMO_MODE` | `true` = use sample data, no API calls | No (default: true) |
| `VITE_SPOTIFY_CLIENT_ID` | Spotify Developer App client ID | For live mode |
| `VITE_SPOTIFY_CLIENT_SECRET` | Spotify Developer App secret | For live mode |
| `VITE_META_APP_ID` | Meta (Facebook) App ID | For Meta ads |
| `VITE_META_ACCESS_TOKEN` | Meta User Access Token | For Meta ads |
| `VITE_META_AD_ACCOUNT_ID` | Meta Ad Account ID (`act_...`) | For Meta ads |
| `VITE_TIKTOK_ACCESS_TOKEN` | TikTok Marketing API token | For TikTok ads |
| `VITE_TIKTOK_ADVERTISER_ID` | TikTok Advertiser ID | For TikTok ads |
| `VITE_GOOGLE_ADS_CLIENT_ID` | Google Ads OAuth client ID | For Google ads |
| `VITE_GOOGLE_ADS_DEVELOPER_TOKEN` | Google Ads developer token | For Google ads |
| `VITE_GOOGLE_ADS_CUSTOMER_ID` | Google Ads customer ID | For Google ads |
| `VITE_APPLE_MUSIC_TOKEN` | Apple MusicKit developer token | For Apple Music |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_...`) | For payments |

## 📂 Project Structure

```
spotify-ad-curator/
├── src/
│   ├── components/
│   │   ├── ads/          # Meta, TikTok, YouTube, Google ad builders
│   │   ├── ai/           # AI copy generator UI
│   │   ├── analytics/    # Charts and dashboard components
│   │   ├── apple-music/  # Apple Music integration UI
│   │   ├── demo/         # Demo mode toggle, walkthrough, onboarding
│   │   ├── layout/       # Header, Footer
│   │   ├── payments/     # Stripe + subscription components
│   │   ├── reels/        # Reels/Shorts studio components
│   │   ├── scheduler/    # Auto-refresh scheduler UI
│   │   ├── spotify/      # Spotify link input, analysis display
│   │   ├── targeting/    # Targeting recommendation UI
│   │   └── ui/           # Shared primitives (Button, Card, Badge, Input)
│   ├── hooks/            # Custom React hooks (one per feature)
│   ├── pages/            # Top-level page components
│   ├── services/         # Business logic and API clients
│   │   ├── ai-copy/      # OpenAI GPT integration
│   │   ├── analytics/    # Analytics aggregation
│   │   ├── apple-music/  # Apple MusicKit
│   │   ├── demo/         # Demo scenarios, sample data, walkthrough engine
│   │   ├── google-ads/   # Google Ads + YouTube Ads API
│   │   ├── meta-ads/     # Meta Marketing API
│   │   ├── payments/     # Stripe Checkout
│   │   ├── reels/        # Video template engine
│   │   ├── scheduler/    # Schedule engine + rules
│   │   ├── spotify/      # Spotify Web API
│   │   ├── targeting/    # Audience targeting logic
│   │   ├── tiktok-ads/   # TikTok Marketing API
│   │   └── youtube-ads/  # YouTube Ads API
│   ├── store/            # Zustand global state
│   ├── types/            # Shared TypeScript types
│   └── utils/            # Demo data, helpers
├── server/               # Optional Express backend (for Stripe webhooks)
├── docs/                 # Additional documentation
├── .env.example          # Environment variable template
├── FEATURES.md           # Detailed feature documentation
├── ARCHITECTURE.md       # Technical architecture overview
└── README.md             # This file
```

## 🏗️ Architecture Overview

The app uses a **step-based navigation** model (not React Router) managed by Zustand:

```
Landing → Dashboard → Targeting → AdGenerator
                                      ↓
                         Analytics ← History
                              ↓
                         Scheduler → ReelsStudio → DemoHub
```

Each feature module follows the same pattern:
- `src/services/<feature>/` — business logic, API calls, data transforms
- `src/components/<feature>/` — React UI components
- `src/hooks/use<Feature>.ts` — custom hook wiring state to service layer
- `src/pages/<Feature>.tsx` — page-level wrapper

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full module dependency diagram and data flow.

## 🎮 Demo Mode

Demo mode uses pre-loaded sample data (an Afrobeats playlist with 30 days of campaign analytics) without making any real API calls.

**Toggle Demo Mode:**
- Click the **Live / DEMO** button in the header
- Set `VITE_DEMO_MODE=true` in your `.env`
- Visit the **Demo Hub** page for guided tours

**Demo Hub features:**
- 5 guided scenario tours (Quick Start → Power User)
- Interactive feature grid with exploration tracking
- First-time onboarding wizard
- Reset button to restart the demo experience

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push and open a PR

Please follow the existing service/component/hook pattern and ensure `npm run build` passes before submitting.

## 📄 License

MIT — see [LICENSE](./LICENSE) for details.
>>>>>>> origin/copilot/add-reels-support
