import type { ArtistSummary } from '../../types';

interface ArtistCardProps {
  artist: ArtistSummary;
  rank: number;
}

export const ArtistCard = ({ artist, rank }: ArtistCardProps) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-surface-border last:border-0">
    <span className="text-gray-600 text-xs w-5 text-right flex-shrink-0 font-mono">{rank}</span>
    {artist.imageUrl ? (
      <img
        src={artist.imageUrl}
        alt={artist.name}
        className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-surface-border"
      />
    ) : (
      <div className="w-9 h-9 rounded-full bg-brand-900/50 border border-brand-800 flex items-center justify-center text-sm flex-shrink-0">
        🎤
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-white truncate">{artist.name}</p>
      <p className="text-xs text-gray-500">{artist.trackCount} track{artist.trackCount !== 1 ? 's' : ''}</p>
    </div>
    <div className="text-right flex-shrink-0">
      <div className="flex items-center gap-1">
        <div className="h-1.5 w-12 bg-surface-border rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full"
            style={{ width: `${artist.popularity}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 w-7">{artist.popularity}</span>
      </div>
    </div>
  </div>
);
