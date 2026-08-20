import React from 'react';
import { useToast } from '../hooks/useToast';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const getStyles = () => {
          switch (toast.type) {
            case 'success':
              return {
                border: 'border-emerald-500/30 dark:border-emerald-500/30',
                bg: 'bg-white dark:bg-slate-900',
                icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              };
            case 'error':
              return {
                border: 'border-rose-500/30 dark:border-rose-500/30',
                bg: 'bg-white dark:bg-slate-900',
                icon: <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
              };
            case 'warning':
              return {
                border: 'border-amber-500/30 dark:border-amber-500/30',
                bg: 'bg-white dark:bg-slate-900',
                icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
              };
            case 'info':
            default:
              return {
                border: 'border-indigo-500/30 dark:border-indigo-500/30',
                bg: 'bg-white dark:bg-slate-900',
                icon: <Info className="w-5 h-5 text-indigo-500 shrink-0" />
              };
          }
        };

        const styles = getStyles();

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-4 rounded-2xl shadow-xl border ${styles.border} ${styles.bg} text-slate-800 dark:text-slate-100 transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in`}
          >
            <div className="flex items-start gap-3">
              {styles.icon}
              <div className="space-y-0.5">
                <h4 className="text-sm font-semibold leading-tight">{toast.title}</h4>
                {toast.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {toast.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {toast.action && (
                <button
                  onClick={() => {
                    toast.action?.onClick();
                    removeToast(toast.id);
                  }}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/30 transition-colors active:scale-95"
                >
                  {toast.action.label}
                </button>
              )}
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label="Close toast"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
