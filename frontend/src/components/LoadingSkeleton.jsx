import React from 'react';
import { Bot, Sparkles, Loader2 } from 'lucide-react';

export const LoadingAnalysis = ({ message = 'AI is Analyzer resume & generating analytics...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-lg mx-auto text-center space-y-6 animate-in fade-in duration-300">
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 animate-pulse">
          <Bot className="w-10 h-10" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full shadow-md">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <span>AI Engine In Progress</span>
          <Sparkles className="w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          {message}
        </p>
      </div>

      <div className="w-full space-y-2.5">
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 w-3/4 rounded-full animate-pulse" />
        </div>
        <div className="flex justify-between text-xs text-slate-400 font-mono">
          <span>TF-IDF Vectorization</span>
          <span>Entity Extraction</span>
          <span>Job Ranking</span>
        </div>
      </div>
    </div>
  );
};

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3"></div>
            <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
          </div>
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4"></div>
          <div className="space-y-2">
            <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
            <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
          </div>
          <div className="flex gap-2 pt-2">
            <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
