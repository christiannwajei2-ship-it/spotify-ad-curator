# 🔑 API Keys Guide

## Spotify API

**Where:** [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)  
**Cost:** Free  
**Rate Limits:** 100 requests/minute (Client Credentials flow)

### Keys needed:
- `VITE_SPOTIFY_CLIENT_ID` — Your app's Client ID
- `VITE_SPOTIFY_CLIENT_SECRET` — Your app's Client Secret

### Steps:
1. Sign in with your Spotify account
2. Click "Create App"
3. Fill in name and description
4. Add redirect URI: `http://localhost:5173/callback`
5. Copy the Client ID and Client Secret from Settings

---

## Meta Marketing API

**Where:** [developers.facebook.com](https://developers.facebook.com)  
**Cost:** Free (you pay for ad spend, not API access)  
**Rate Limits:** Depends on your ad account tier

### Keys needed:
- `VITE_META_APP_ID` — Facebook App ID
- `VITE_META_APP_SECRET` — Facebook App Secret
- `VITE_META_ACCESS_TOKEN` — User or System User access token
- `VITE_META_AD_ACCOUNT_ID` — Format: `act_123456789`
- `VITE_META_PAGE_ID` — Your Facebook Page ID
- `VITE_META_INSTAGRAM_ACTOR_ID` — (Optional) Your Instagram account ID

### Steps:
1. Go to developers.facebook.com → My Apps → Create App
2. Choose Business type
3. Add "Marketing API" product from the dashboard
4. Go to Settings → Basic to get App ID and Secret
5. Use the Graph API Explorer to generate an access token with permissions:
   - `ads_management`, `ads_read`, `business_management`
6. Get Ad Account ID from business.facebook.com/adsmanager

### Testing:
Use the [Graph API Explorer](https://developers.facebook.com/tools/explorer/) to verify your token works:
```
GET /me/adaccounts
```
