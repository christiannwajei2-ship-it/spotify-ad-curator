import { clsx } from 'clsx';
import type { StreamStatus } from '../../services/realtime/types';

interface Props {
  status: StreamStatus;
  lastUpdated: number | null;
  onReconnect: () => void;
}

export const ConnectionStatus = ({ status, lastUpdated, onReconnect }: Props) => {
  const secondsAgo = lastUpdated ? Math.round((Date.now() - lastUpdated) / 1000) : null;

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-surface-elevated border border-surface-border">
      <div className="flex items-center gap-2">
        <span
          className={clsx(
            'w-2.5 h-2.5 rounded-full',
            status === 'connected' ? 'bg-green-400 animate-pulse' : '',
            status === 'reconnecting' ? 'bg-yellow-400 animate-pulse' : '',
            status === 'disconnected' ? 'bg-red-400' : ''
          )}
        />
        <span className={clsx('text-xs font-medium capitalize',
          status === 'connected' ? 'text-green-400' : status === 'reconnecting' ? 'text-yellow-400' : 'text-red-400'
        )}>
          {status}
        </span>
      </div>
      {secondsAgo !== null && (
        <span className="text-xs text-gray-500">
          Updated {secondsAgo}s ago
        </span>
      )}
      {status !== 'connected' && (
        <button
          onClick={onReconnect}
          className="text-xs text-brand-400 hover:text-brand-300 underline ml-auto"
        >
          Reconnect
        </button>
      )}
    </div>
  );
};
