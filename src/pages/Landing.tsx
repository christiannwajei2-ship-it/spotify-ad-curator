import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store';
import { useSpotifyAnalysis } from '../hooks/useSpotifyAnalysis';
import { Button, Input } from '../components/ui';
import { DEMO_PLAYLIST_URL } from '../utils/constants';

const stats = [
  { value: '47K+', label: 'Playlists Analyzed' },
  { value: '$1.20', label: 'Avg. CPM (Nigeria)' },
  { value: '85%', label: 'Avg. CTR Improvement' },
  { value: '3.2x', label: 'Follower Growth' },
];

const features = [
  {
    icon: '🔍',
    title: 'Deep Playlist Analysis',
    desc: 'Genre breakdown, mood profiling, popularity stats, top artists — all in seconds.',
  },
  {
    icon: '🎯',
    title: 'Smart Audience Targeting',
    desc: 'AI-matched countries, age ranges, and interests based on your playlist\'s DNA.',
  },
  {
    icon: '📢',
    title: 'Meta Ad Campaign Generator',
    desc: 'Complete Facebook & Instagram campaigns with proven high-CTR ad copy templates.',
  },
  {
    icon: '💰',
    title: 'Ultra-Low Budget Mode',
    desc: '$1–3/day campaigns that actually convert. Optimized for maximum reach.',
  },
];

export const Landing = () => {
  const [inputUrl, setInputUrl] = useState('');
  const { setSpotifyUrl, isDemoMode } = useAppStore();
  const { analyze, isLoading } = useSpotifyAnalysis();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isDemoMode ? DEMO_PLAYLIST_URL : inputUrl;
    setSpotifyUrl(url);
    await analyze(url);
  };

  const handleTryDemo = async () => {
    setSpotifyUrl(DEMO_PLAYLIST_URL);
    await analyze(DEMO_PLAYLIST_URL);
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-700/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-900/40 border border-brand-800 rounded-full text-brand-300 text-sm mb-6">
              <span>🎵</span>
              <span>Built for Spotify Playlist Curators</span>
              {isDemoMode && <span className="bg-yellow-800/60 text-yellow-300 px-2 py-0.5 rounded-full text-xs ml-1">DEMO MODE</span>}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
              Paste your Spotify link.<br />
              <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
                Get ads that convert.
              </span>
              <span className="ml-3">🎵→📢</span>
            </h1>

            <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Analyze your playlist's DNA, get AI-powered targeting recommendations, and auto-generate
              complete Meta ad campaigns — all optimized for <strong className="text-white">$1–3/day</strong> with maximum conversion. ❤️
            </p>

            {/* Input form */}
            <form onSubmit={handleSubmit} className="mt-10 max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    placeholder={isDemoMode ? '🎭 Demo mode — click Analyze to see it in action' : 'https://open.spotify.com/playlist/...'}
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    leftIcon={<span>🔗</span>}
                    className="text-base py-4"
                    disabled={isDemoMode}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  isLoading={isLoading}
                  className="sm:w-auto w-full"
                >
                  {isLoading ? 'Analyzing…' : '🚀 Analyze & Generate'}
                </Button>
              </div>

              {!isDemoMode && (
                <p className="mt-3 text-sm text-gray-500">
                  Supports: playlist links, artist links, and profile links
                </p>
              )}
            </form>

            {!isDemoMode && (
              <div className="mt-5">
                <button
                  onClick={handleTryDemo}
                  className="text-sm text-brand-400 hover:text-brand-300 underline underline-offset-2 transition-colors"
                >
                  → Try with demo data (no API key needed)
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-surface-border">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl font-black text-white">{stat.value}</p>
                <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Everything in one place ❤️</h2>
          <p className="text-gray-400 mt-3">From playlist link to live ad campaign in under 2 minutes</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-surface-card border border-surface-border rounded-2xl p-5 hover:border-brand-800 transition-colors duration-200"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
        <div className="bg-surface-card border border-surface-border rounded-3xl p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-white text-center mb-8">How it works 🎯</h2>
          <div className="grid sm:grid-cols-4 gap-6">
            {[
              { step: '1', icon: '📋', title: 'Paste Link', desc: 'Drop your Spotify playlist, artist, or profile URL' },
              { step: '2', icon: '🔍', title: 'Deep Analysis', desc: 'We analyze genres, mood, popularity & top artists' },
              { step: '3', icon: '🎯', title: 'Smart Targeting', desc: 'Get country, age & interest recommendations' },
              { step: '4', icon: '🚀', title: 'Launch Ads', desc: 'Use ready-to-go Meta campaigns with proven copy' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-brand-900/50 border border-brand-800 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3">
                  {item.icon}
                </div>
                <div className="text-xs text-brand-400 font-bold mb-1">STEP {item.step}</div>
                <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
