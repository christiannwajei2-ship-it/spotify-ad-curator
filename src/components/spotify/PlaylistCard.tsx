import { motion } from 'framer-motion';
import type { PlaylistAnalysis } from '../../types';
import { formatDuration, formatNumber, formatPercentage } from '../../utils/formatters';
import { Badge } from '../ui';

interface PlaylistCardProps {
  analysis: PlaylistAnalysis;
}

export const PlaylistCard = ({ analysis }: PlaylistCardProps) => {
  const { playlist, topGenre, genreDiversityScore } = analysis;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-brand-900/40 to-surface-elevated rounded-2xl border border-brand-800/50 overflow-hidden"
    >
      <div className="flex gap-5 p-5 sm:p-6">
        {playlist.imageUrl && (
          <div className="flex-shrink-0">
            <img
              src={playlist.imageUrl}
              alt={playlist.name}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-cover shadow-xl shadow-black/40"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap">
            <Badge variant="purple">🎵 {topGenre}</Badge>
            <Badge variant="blue">
              {formatPercentage(genreDiversityScore)} diversity
            </Badge>
          </div>
          <h2 className="text-xl font-bold text-white mt-2 truncate">{playlist.name}</h2>
          {playlist.description && (
            <p className="text-gray-400 text-sm mt-1 line-clamp-2">{playlist.description}</p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <Stat label="Followers" value={formatNumber(playlist.followerCount)} />
            <Stat label="Tracks" value={playlist.trackCount.toString()} />
            <Stat label="Duration" value={formatDuration(playlist.totalDurationMs)} />
            <Stat label="Avg. Popularity" value={`${analysis.popularityStats.average}/100`} />
          </div>
        </div>
      </div>
      {playlist.spotifyUrl && (
        <div className="px-5 pb-5">
          <a
            href={playlist.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1"
          >
            🔗 Open in Spotify ↗
          </a>
        </div>
      )}
    </motion.div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-semibold text-white mt-0.5">{value}</p>
  </div>
);
