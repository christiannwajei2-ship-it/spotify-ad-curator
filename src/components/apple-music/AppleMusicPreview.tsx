// ===================================================
// AppleMusicPreview — Apple Music playlist card
// ===================================================

import { motion } from 'framer-motion';
import type { AppleMusicPlaylist, AppleMusicTrack } from '../../services/apple-music/types';
import { Button } from '../ui';

interface AppleMusicPreviewProps {
  playlist: AppleMusicPlaylist;
  tracks?: AppleMusicTrack[];
  onAnalyze?: () => void;
  isLoading?: boolean;
}

export const AppleMusicPreview = ({
  playlist,
  tracks = [],
  onAnalyze,
  isLoading = false,
}: AppleMusicPreviewProps) => {
  const previewTracks = tracks.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden border border-pink-800/40 bg-surface-card"
    >
      {/* Header gradient */}
      <div className="relative p-5 bg-gradient-to-br from-pink-700/30 via-rose-800/20 to-red-900/20">
        <div className="flex gap-4">
          {/* Artwork */}
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-pink-900/40 flex items-center justify-center">
            {playlist.artworkUrl ? (
              <img
                src={playlist.artworkUrl}
                alt={playlist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl">🍎</span>
            )}
          </div>

          {/* Meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Apple Music</span>
            </div>
            <h3 className="font-bold text-white text-lg leading-snug truncate">{playlist.name}</h3>
            <p className="text-sm text-gray-400 mt-0.5">
              By {playlist.curatorName} · {playlist.trackCount} tracks
            </p>
            {playlist.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{playlist.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Track list preview */}
      {previewTracks.length > 0 && (
        <div className="px-5 py-3 border-t border-pink-900/20">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">Preview</p>
          <div className="space-y-2">
            {previewTracks.map((track, i) => (
              <div key={track.id} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-4 text-right flex-shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{track.title}</p>
                  <p className="text-xs text-gray-500 truncate">{track.artist}</p>
                </div>
                {track.genre && (
                  <span className="text-xs text-pink-400/80 flex-shrink-0">{track.genre}</span>
                )}
              </div>
            ))}
          </div>
          {tracks.length > 5 && (
            <p className="text-xs text-gray-600 mt-2 text-center">+{tracks.length - 5} more tracks</p>
          )}
        </div>
      )}

      {/* Analyze CTA */}
      {onAnalyze && (
        <div className="px-5 pb-5 pt-2">
          <Button
            onClick={onAnalyze}
            isLoading={isLoading}
            className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 border-0"
          >
            🍎 Analyze This Playlist
          </Button>
        </div>
      )}
    </motion.div>
  );
};
