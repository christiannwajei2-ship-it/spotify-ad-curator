import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

// Proxy Meta Marketing API calls — keeps access token server-side
router.post('/campaign', async (req: Request, res: Response) => {
  try {
    const accessToken = process.env.META_ACCESS_TOKEN ?? process.env.VITE_META_ACCESS_TOKEN;
    const adAccountId = process.env.META_AD_ACCOUNT_ID ?? process.env.VITE_META_AD_ACCOUNT_ID;

    if (!accessToken || !adAccountId) {
      return res.status(500).json({ error: 'Meta API credentials not configured' });
    }

    const { campaign } = req.body as { campaign: Record<string, unknown> };

    const response = await fetch(
      `https://graph.facebook.com/v19.0/${adAccountId}/campaigns`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(campaign),
      }
    );

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create Meta campaign' });
  }
});

export default router;
