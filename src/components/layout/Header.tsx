import { useState, useEffect } from 'react';
import { useAppStore } from '../../store';
import { Badge } from '../ui';
import { SubscriptionBadge } from '../payments/SubscriptionBadge';
import { useSubscription } from '../../hooks/useSubscription';
import { useScheduler } from '../../hooks/useScheduler';
import { DemoModeToggle } from '../demo/DemoModeToggle';
import { ThemeToggle } from '../theme/ThemeToggle';
import { MobileNav } from './MobileNav';

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
  { label: 'Builder', step: 'campaign-builder', icon: '🔧' },
  { label: 'Scheduler', step: 'scheduler', icon: '⏰' },
  { label: 'Reels Studio', step: 'reels-studio', icon: '🎬' },
  { label: 'Demo Hub', step: 'demo-hub', icon: '🎮' },
  { label: 'History', step: 'history', icon: '📋' },
  { label: 'Pricing', step: 'pricing', icon: '💳' },
];

export const Header = () => {
  const { currentStep, setStep, analysis, reset } = useAppStore();
  const { currentTier, manageSubscription } = useSubscription();
  const { activeCount } = useScheduler();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleNavClick = (item: NavItem) => {
    if (item.requiresAnalysis && !analysis) return;
    setStep(item.step as Parameters<typeof setStep>[0]);
  };

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setVisible(currentY < lastScrollY || currentY < 80);
      setLastScrollY(currentY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-surface-border transition-transform duration-300 ${
          visible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => { reset(); }}
              className="flex items-center gap-2.5 group shrink-0"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-brand-600 to-brand-800 rounded-lg flex items-center justify-center text-sm shadow-lg shadow-brand-900/40">
                🎵
              </div>
              <span className="font-bold text-white text-sm hidden sm:block">
                Spotify<span className="text-brand-400">AdCurator</span>
              </span>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isDisabled = item.requiresAnalysis && !analysis;
                const isActive = currentStep === item.step;
                return (
                  <button
                    key={item.step}
                    onClick={() => handleNavClick(item)}
                    disabled={isDisabled}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200
                      ${isActive
                        ? 'bg-brand-900/60 text-brand-300 border border-brand-800'
                        : isDisabled
                          ? 'text-gray-600 cursor-not-allowed'
                          : 'text-gray-400 hover:text-white hover:bg-surface-elevated'
                      }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                    {item.step === 'scheduler' && activeCount > 0 && (
                      <Badge variant="green" className="text-xs px-1.5 py-0.5 ml-0.5">
                        {activeCount}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right side controls */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <DemoModeToggle />

              {analysis && (
                <Badge variant="green" className="hidden sm:flex">
                  ✓ Analyzed
                </Badge>
              )}

              <SubscriptionBadge
                tier={currentTier}
                onClick={() => {
                  if (currentTier === 'free') {
                    setStep('pricing');
                  } else {
                    manageSubscription();
                  }
                }}
                className="hidden sm:flex"
              />

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileNavOpen(true)}
                aria-label="Open navigation menu"
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-surface-elevated hover:bg-surface-border border border-surface-border transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  );
};
