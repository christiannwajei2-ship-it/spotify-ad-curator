// ===================================================
// DemoModeToggle — Global demo mode switch
// ===================================================

import { motion } from 'framer-motion';
import { useDemo } from '../../hooks/useDemo';

interface DemoModeToggleProps {
  className?: string;
}

export const DemoModeToggle = ({ className = '' }: DemoModeToggleProps) => {
  const { isDemoMode, toggleDemoMode } = useDemo();

  return (
    <motion.button
      onClick={toggleDemoMode}
      whileTap={{ scale: 0.95 }}
      title={isDemoMode ? 'Demo mode active — using sample data' : 'Enable demo mode to explore all features with sample data'}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200
        ${isDemoMode
          ? 'bg-yellow-900/30 text-yellow-300 border-yellow-800'
          : 'bg-surface-elevated text-gray-400 border-surface-border hover:text-white'
        } ${className}`}
    >
      {isDemoMode ? (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400" />
          </span>
          <span>DEMO</span>
        </>
      ) : (
        <>
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span>Live</span>
        </>
      )}
    </motion.button>
  );
};
