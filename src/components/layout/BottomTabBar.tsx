import { motion } from 'framer-motion';
import { useAppStore } from '../../store';

const tabs = [
  { label: 'Home', step: 'landing', icon: '🏠' },
  { label: 'Campaigns', step: 'campaign-builder', icon: '🔧' },
  { label: 'Analytics', step: 'analytics', icon: '📈' },
  { label: 'Studio', step: 'reels-studio', icon: '🎬' },
  { label: 'More', step: 'demo-hub', icon: '⋯' },
] as const;

export const BottomTabBar = () => {
  const { currentStep, setStep } = useAppStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-surface-card/90 backdrop-blur-xl border-t border-surface-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-stretch h-14">
        {tabs.map((tab) => {
          const isActive = currentStep === tab.step;
          return (
            <button
              key={tab.step}
              onClick={() => setStep(tab.step as Parameters<typeof setStep>[0])}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[44px] relative transition-colors duration-200
                ${isActive ? 'text-brand-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-tab-indicator"
                  className="absolute top-0 inset-x-2 h-0.5 bg-brand-400 rounded-b-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="text-lg leading-none">{tab.icon}</span>
              <span className="text-[10px] font-medium leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
