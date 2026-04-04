import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

// Proxy Spotify API calls — useful to hide client secret
router.post('/token', async (_req: Request, res: Response) => {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID ?? process.env.VITE_SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET ?? process.env.VITE_SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({ error: 'Spotify credentials not configured' });
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get Spotify token' });
  }
});

export default router;
