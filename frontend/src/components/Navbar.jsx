import React from 'react';
import {
  FileText,
  Sun,
  Moon,
  Menu,
  X,
  UserCheck,
  Trash2,
  Cpu,
  Upload
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useResume } from '../context/ResumeContext';

export const Navbar = ({ activePage, setActivePage, mobileMenuOpen, setMobileMenuOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const { currentAnalysis, clearResume } = useResume();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo & Mobile toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => setActivePage('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ResumeAI
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase -mt-1 hidden sm:inline-block">
                
              </span>
            </div>
          </div>
        </div>

        {/* Center: Quick navigation links for Desktop */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => setActivePage('landing')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activePage === 'landing'
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActivePage('dashboard')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activePage === 'dashboard'
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActivePage('upload')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activePage === 'upload'
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Upload Resume
          </button>
          <button
            onClick={() => setActivePage('matching')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activePage === 'matching'
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Job Matching
          </button>
          <button
            onClick={() => setActivePage('recommendations')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activePage === 'recommendations'
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Recommendations
          </button>
        </nav>

        {/* Right: Actions, Active Profile Indicator & Theme Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Active Profile Pill */}
          {currentAnalysis ? (
            <div className="hidden sm:flex items-center gap-2 pl-3 pr-2 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 rounded-full">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 truncate max-w-[120px]">
                {currentAnalysis.candidate_name || 'Active Resume'}
              </span>
              <button
                onClick={clearResume}
                title="Clear current resume"
                className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-full text-emerald-700 dark:text-emerald-300 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActivePage('upload')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Resume</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
