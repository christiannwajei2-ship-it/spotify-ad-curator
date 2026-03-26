import express from 'express';
import cors from 'cors';
import spotifyRouter from './routes/spotify';
import metaAdsRouter from './routes/meta-ads';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({ origin: process.env.VITE_APP_URL ?? 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/spotify', spotifyRouter);
app.use('/api/meta-ads', metaAdsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🎵 Spotify Ad Curator API running on http://localhost:${PORT}`);
});

export default app;
