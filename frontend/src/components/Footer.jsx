import React from 'react';
import { Cpu, ShieldCheck, Heart, Code2, BookOpen } from 'lucide-react';

export const Footer = ({ setActivePage }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 py-10 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">
                AI Resume Analyzer & Job Recommendation System
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
               
              </div>
            </div>
          </div>

          {/* Center tech stack pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-medium">Python 3.11</span>
            <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 font-medium">Flask REST API</span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-medium">Scikit-learn NLP</span>
            <span className="px-2.5 py-1 rounded-md bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 font-medium">React + Tailwind</span>
            <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 font-medium">SQLite DB</span>
          </div>

          {/* Right link */}
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => setActivePage('about')}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Project Architecture & Docs</span>
            </button>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3 text-center sm:text-left">
          <p>
            
          </p>
          <p className="flex items-center gap-1 justify-center">
            <span></span>
          </p>
        </div>
      </div>
    </footer>
  );
};
