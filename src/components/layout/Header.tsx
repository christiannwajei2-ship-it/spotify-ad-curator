import { useAppStore } from '../../store';
import { Badge } from '../ui';
import { SubscriptionBadge } from '../payments/SubscriptionBadge';
import { useSubscription } from '../../hooks/useSubscription';
import { useScheduler } from '../../hooks/useScheduler';
import { DemoModeToggle } from '../demo/DemoModeToggle';

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

  const handleNavClick = (item: NavItem) => {
    if (item.requiresAnalysis && !analysis) return;
    setStep(item.step as Parameters<typeof setStep>[0]);
  };

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => { reset(); }}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-brand-600 to-brand-800 rounded-lg flex items-center justify-center text-sm shadow-lg shadow-brand-900/40">
              🎵
            </div>
            <span className="font-bold text-white text-sm hidden sm:block">
              Spotify<span className="text-brand-400">AdCurator</span>
            </span>
          </button>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
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

          {/* Demo toggle */}
          <div className="flex items-center gap-3">
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
          </div>
        </div>
      </div>
    </header>
  );
};
