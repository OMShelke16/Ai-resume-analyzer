import React from 'react';
import {
  LayoutDashboard,
  UploadCloud,
  FileCheck2,
  GitCompare,
  Briefcase,
  TrendingUp,
  History,
  Info,
  Sun,
  Moon,
  Cpu,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useResume } from '../context/ResumeContext';

export const Sidebar = ({ activePage, setActivePage, mobileMenuOpen, setMobileMenuOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const { currentAnalysis } = useResume();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Resume Upload', icon: UploadCloud },
    { id: 'analysis', label: 'Resume Analysis', icon: FileCheck2 },
    { id: 'matching', label: 'Job Matching', icon: GitCompare },
    { id: 'recommendations', label: 'Job Recommendations', icon: Briefcase },
    { id: 'improvement', label: 'Resume Improvement', icon: TrendingUp },
    { id: 'history', label: 'Analysis History', icon: History },
    { id: 'about', label: 'About Project', icon: Info },
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    if (setMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-[#0E1526] border-r border-slate-200 dark:border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80">
          <div
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ResumeAI
              </span>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
            Main Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
          {/* System Status Pill */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800/60 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-slate-700 dark:text-slate-300">Local AI Engine</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">TF-IDF Vector</span>
          </div>

          {/* Dark/Light mode toggle bar */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Appearance</span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-600" />
                  <span>Dark</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
