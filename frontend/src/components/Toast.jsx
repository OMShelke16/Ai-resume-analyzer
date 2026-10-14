import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const ToastContainer = () => {
  const { toasts, removeToast } = useResume();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bgColor = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100';
        let Icon = Info;
        let iconColor = 'text-blue-500';

        if (toast.type === 'success') {
          bgColor = 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-100';
          Icon = CheckCircle2;
          iconColor = 'text-emerald-600 dark:text-emerald-400';
        } else if (toast.type === 'error') {
          bgColor = 'bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-100';
          Icon = AlertCircle;
          iconColor = 'text-rose-600 dark:text-rose-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-2 ${bgColor}`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
