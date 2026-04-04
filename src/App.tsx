import { Toaster } from 'react-hot-toast';
import { useAppStore } from './store';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Targeting } from './pages/Targeting';
import { AdGenerator } from './pages/AdGenerator';
import { History } from './pages/History';
import { Analytics } from './pages/Analytics';
import { Pricing } from './pages/Pricing';
import { Scheduler } from './pages/Scheduler';

function App() {
  const { currentStep, isLoading } = useAppStore();

  const renderPage = () => {
    switch (currentStep) {
      case 'landing':
      case 'analyzing':
        return <Landing />;
      case 'dashboard':
        return <Dashboard />;
      case 'targeting':
        return <Targeting />;
      case 'ad-generator':
        return <AdGenerator />;
      case 'history':
        return <History />;
      case 'analytics':
        return <Analytics />;
      case 'pricing':
        return <Pricing />;
      case 'scheduler':
        return <Scheduler />;
      default:
        return <Landing />;
    }
  };

  return (
    <div className="min-h-screen bg-surface text-white">
      {/* Global loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-surface/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-brand-800 border-t-brand-400 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-2xl">🎵</div>
            </div>
            <p className="text-brand-300 font-medium animate-pulse">
              {currentStep === 'analyzing' ? 'Analyzing your playlist…' : 'Processing…'}
            </p>
          </div>
        </div>
      )}

      <Header />
      <main>{renderPage()}</main>
      <Footer />

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e1e28',
            color: '#fff',
            border: '1px solid #2a2a38',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#a855f7', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
    </div>
  );
}

export default App;
