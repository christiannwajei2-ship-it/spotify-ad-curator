import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store';

interface NavItem {
  label: string;
  step: string;
  icon: string;
  requiresAnalysis?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Home', step: 'landing', icon: '🏠' },
  { label: 'Analysis', step: 'dashboard', icon: '📊', requiresAnalysis: true },
  { label: 'Targeting', step: 'targeting', icon: '🎯', requiresAnalysis: true },
  { label: 'Ad Generator', step: 'ad-generator', icon: '📢', requiresAnalysis: true },
  { label: 'Analytics', step: 'analytics', icon: '📈' },
  { label: 'Campaign Builder', step: 'campaign-builder', icon: '🔧' },
  { label: 'Scheduler', step: 'scheduler', icon: '⏰' },
  { label: 'Reels Studio', step: 'reels-studio', icon: '🎬' },
  { label: 'Demo Hub', step: 'demo-hub', icon: '🎮' },
  { label: 'History', step: 'history', icon: '📋' },
  { label: 'Pricing', step: 'pricing', icon: '💳' },
];

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  const { currentStep, setStep, analysis } = useAppStore();
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleNavClick = (item: NavItem) => {
    if (item.requiresAnalysis && !analysis) return;
    setStep(item.step as Parameters<typeof setStep>[0]);
    onClose();
  };

  // Close on escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-surface-card border-r border-surface-border flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-surface-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-600 to-brand-800 rounded-lg flex items-center justify-center text-sm shadow-lg">
                  🎵
                </div>
                <span className="font-bold text-white text-sm">
                  Spotify<span className="text-brand-400">AdCurator</span>
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-elevated transition-colors text-gray-400 hover:text-white"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto py-2">
              {navItems.map((item) => {
                const isDisabled = item.requiresAnalysis && !analysis;
                const isActive = currentStep === item.step;
                return (
                  <button
                    key={item.step}
                    onClick={() => handleNavClick(item)}
                    disabled={isDisabled}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-150
                      ${isActive
                        ? 'bg-brand-900/60 text-brand-300 border-r-2 border-brand-400'
                        : isDisabled
                          ? 'text-gray-600 cursor-not-allowed'
                          : 'text-gray-300 hover:bg-surface-elevated hover:text-white'
                      }`}
                  >
                    <span className="text-base w-6 text-center">{item.icon}</span>
                    <span>{item.label}</span>
                    {isDisabled && (
                      <span className="ml-auto text-xs text-gray-600">Analyze first</span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-surface-border">
              <p className="text-xs text-gray-600 text-center">Spotify Ad Curator v1.0</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
