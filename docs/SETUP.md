# 🔧 Setup Guide

## 1. Clone & Install

```bash
git clone https://github.com/christiannwajei2-ship-it/spotify-ad-curator.git
cd spotify-ad-curator
npm install
cp .env.example .env
```

## 2. Spotify API Setup

1. Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Click **Create App**
3. Fill in app name, description, redirect URI: `http://localhost:5173/callback`
4. Copy your **Client ID** and **Client Secret**
5. Add to `.env`:

```env
VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_client_secret
```

## 3. Meta / Facebook API Setup

1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create a new App → Select **Business** type
3. Add **Marketing API** product
4. From **Settings → Basic**, copy **App ID** and **App Secret**
5. Generate a **User Access Token** with these permissions:
   - `ads_management`
   - `ads_read`
   - `business_management`
6. Get your **Ad Account ID** from [business.facebook.com/adsmanager](https://business.facebook.com/adsmanager)
7. Add to `.env`:

```env
VITE_META_APP_ID=your_app_id
VITE_META_APP_SECRET=your_app_secret
VITE_META_ACCESS_TOKEN=your_user_access_token
VITE_META_AD_ACCOUNT_ID=act_your_account_id
VITE_META_PAGE_ID=your_page_id
```

## 4. Switch to Live Mode

Change in `.env`:
```env
VITE_DEMO_MODE=false
```

## 5. Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

Add your environment variables in the Vercel dashboard under **Settings → Environment Variables**.
