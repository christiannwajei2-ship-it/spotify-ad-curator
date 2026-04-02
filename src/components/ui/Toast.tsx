import { useState, useCallback, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
}

interface ToastContextValue {
  addToast: (message: string, variant?: ToastVariant, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue>({ addToast: () => {} });

const variantConfig: Record<ToastVariant, { icon: string; bg: string; border: string; text: string }> = {
  success: { icon: '✅', bg: 'bg-green-950', border: 'border-green-800', text: 'text-green-300' },
  error: { icon: '❌', bg: 'bg-red-950', border: 'border-red-800', text: 'text-red-300' },
  warning: { icon: '⚠️', bg: 'bg-amber-950', border: 'border-amber-800', text: 'text-amber-300' },
  info: { icon: 'ℹ️', bg: 'bg-blue-950', border: 'border-blue-800', text: 'text-blue-300' },
};

let toastCounter = 0;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, variant: ToastVariant = 'info', duration = 4000) => {
    const id = String(++toastCounter);
    setToasts((prev) => [...prev, { id, message, variant, duration }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-20 right-4 md:bottom-4 z-[60] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const cfg = variantConfig[toast.variant];
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 64, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 64, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-xl pointer-events-auto cursor-pointer ${cfg.bg} ${cfg.border}`}
                onClick={() => dismiss(toast.id)}
              >
                <span className="text-base shrink-0 mt-0.5">{cfg.icon}</span>
                <p className={`text-sm font-medium flex-1 ${cfg.text}`}>{toast.message}</p>
                <button className="text-gray-600 hover:text-gray-400 shrink-0 mt-0.5" aria-label="Dismiss">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
