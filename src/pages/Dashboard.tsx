import { motion } from 'framer-motion';
import { useAppStore } from '../store';
import { useTargeting } from '../hooks/useTargeting';
import { Button, Card, CardHeader } from '../components/ui';
import { PlaylistCard, ArtistCard } from '../components/spotify';
import { GenreChart, PopularityChart, MoodRadar } from '../components/charts';
import { MAX_ARTISTS_DISPLAY } from '../utils/constants';

export const Dashboard = () => {
  const { analysis, setStep } = useAppStore();
  const { generate, isLoading } = useTargeting();

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <p className="text-4xl mb-4">📊</p>
          <p className="text-gray-400">No analysis data yet. Go back and paste a Spotify URL first.</p>
          <Button className="mt-4" onClick={() => setStep('landing')}>← Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 flex-wrap gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-white">Analysis Dashboard 📊</h1>
            <p className="text-gray-400 text-sm mt-1">
              Analyzed {new Date(analysis.analyzedAt).toLocaleString()}
            </p>
          </div>
          <Button
            onClick={() => generate()}
            isLoading={isLoading}
            rightIcon={<span>→</span>}
          >
            Get Targeting Recommendations 🎯
          </Button>
        </motion.div>

        {/* Playlist Overview */}
        <section className="mb-8">
          <PlaylistCard analysis={analysis} />
        </section>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-1">
            <CardHeader
              title="Genre Breakdown"
              subtitle={`${analysis.genres.length} genres detected`}
              icon={<span>🎸</span>}
            />
            <GenreChart genres={analysis.genres} />
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader
              title="Popularity Distribution"
              subtitle="Track scores 0–100"
              icon={<span>⭐</span>}
            />
            <PopularityChart
              distribution={analysis.popularityStats.distribution}
              average={analysis.popularityStats.average}
            />
            <div className="mt-4 grid grid-cols-3 gap-2">
              <MiniStat label="Min" value={analysis.popularityStats.min.toString()} />
              <MiniStat label="Average" value={analysis.popularityStats.average.toString()} highlight />
              <MiniStat label="Max" value={analysis.popularityStats.max.toString()} />
            </div>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader
              title="Mood Profile"
              subtitle="Audio features analysis"
              icon={<span>🎭</span>}
            />
            <MoodRadar mood={analysis.moodProfile} />
          </Card>
        </div>

        {/* Top Artists */}
        <Card>
          <CardHeader
            title="Top Artists"
            subtitle={`${analysis.topArtists.length} most featured artists`}
            icon={<span>🎤</span>}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            {analysis.topArtists.slice(0, MAX_ARTISTS_DISPLAY).map((artist, i) => (
              <ArtistCard key={artist.id} artist={artist} rank={i + 1} />
            ))}
          </div>
        </Card>

        {/* CTA */}
        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            onClick={() => generate()}
            isLoading={isLoading}
          >
            Continue to Targeting Recommendations 🎯
          </Button>
        </div>
      </div>
    </div>
  );
};

const MiniStat = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className={`rounded-lg p-2.5 text-center border ${highlight ? 'bg-brand-900/40 border-brand-800' : 'bg-surface border-surface-border'}`}>
    <p className="text-xs text-gray-500">{label}</p>
    <p className={`text-sm font-bold mt-0.5 ${highlight ? 'text-brand-300' : 'text-white'}`}>{value}</p>
  </div>
);
