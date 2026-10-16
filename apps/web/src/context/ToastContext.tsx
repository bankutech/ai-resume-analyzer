import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastMessage[];
  addToast: (type: ToastType, title: string, description?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, title: string, description?: string, duration = 4000) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastMessage = { id, type, title, description, duration };
      setToasts((prev) => [...prev.slice(-4), newToast]); // Keep maximum 5 toasts

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, description?: string) => addToast('success', title, description),
    [addToast]
  );

  const error = useCallback(
    (title: string, description?: string) => addToast('error', title, description, 6000),
    [addToast]
  );

  const warning = useCallback(
    (title: string, description?: string) => addToast('warning', title, description),
    [addToast]
  );

  const info = useCallback(
    (title: string, description?: string) => addToast('info', title, description),
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, success, error, warning, info }}
    >
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none select-none px-4 sm:px-0"
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            const isSuccess = toast.type === 'success';
            const isError = toast.type === 'error';
            const isWarning = toast.type === 'warning';

            const borderClass = isSuccess
              ? 'border-emerald-500/40 bg-carbon-900/95 text-emerald-300 shadow-[0_8px_30px_rgb(16,185,129,0.15)]'
              : isError
              ? 'border-rose-500/40 bg-carbon-900/95 text-rose-300 shadow-[0_8px_30px_rgb(244,63,94,0.15)]'
              : isWarning
              ? 'border-amber-500/40 bg-carbon-900/95 text-amber-300 shadow-[0_8px_30px_rgb(245,158,11,0.15)]'
              : 'border-indigo-500/40 bg-carbon-900/95 text-indigo-300 shadow-[0_8px_30px_rgb(99,102,241,0.15)]';

            const icon = isSuccess ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : isError ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            ) : isWarning ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            );

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-md ${borderClass} transition-all`}
              >
                {icon}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-100 font-sans tracking-tight">
                    {toast.title}
                  </div>
                  {toast.description && (
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5 leading-relaxed">
                      {toast.description}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-carbon-800 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
