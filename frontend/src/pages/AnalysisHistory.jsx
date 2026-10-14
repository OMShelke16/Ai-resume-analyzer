import React, { useState, useEffect } from 'react';
import {
  History,
  FileText,
  Trash2,
  Calendar,
  Award,
  Briefcase,
  ArrowRight,
  Sparkles,
  Layers,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { useResume } from '../context/ResumeContext';
import { EmptyState } from '../components/EmptyState';
import { LoadingAnalysis } from '../components/LoadingSkeleton';

export const AnalysisHistory = ({ setActivePage }) => {
  const { setResumeState, addToast } = useResume();
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.getHistory();
      if (res.success) {
        setHistoryList(res.history || []);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleLoadHistoryRecord = async (record) => {
    try {
      const res = await api.getHistoryDetail(record.id);
      if (res.success && res.analysis) {
        const dummyResume = {
          id: record.id,
          filename: record.resume_name,
          original_name: record.resume_name,
          file_type: 'pdf',
          created_at: record.created_at,
        };

        // Fetch recommendations for this resume text or candidate
        setResumeState(dummyResume, res.analysis, []);
        addToast(`Loaded historical analysis for: ${record.candidate_name}`, 'success');
        setActivePage('dashboard');
      } else {
        addToast('Historical analysis details could not be found.', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Failed to open history entry', 'error');
    }
  };

  const handleDeleteItem = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await api.deleteHistoryItem(id);
      if (res.success) {
        setHistoryList((prev) => prev.filter((item) => item.id !== id));
        addToast('History record deleted', 'info');
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete record', 'error');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all analysis history records?')) {
      return;
    }

    setClearing(true);
    try {
      const res = await api.clearHistory();
      if (res.success) {
        setHistoryList([]);
        addToast('All history logs have been cleared.', 'info');
      }
    } catch (err) {
      addToast(err.message || 'Failed to clear history', 'error');
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5" />
            <span>SQLite Database Audit Logs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Resume Analyzer History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse and reload all past resume Analyzers, calculated ATS compatibility scores, and top job matches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {historyList.length > 0 && (
            <button
              onClick={handleClearAll}
              disabled={clearing}
              className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}

          <button
            onClick={fetchHistory}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            title="Refresh history records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingAnalysis message="Retrieving historical Analyzer sessions from SQLite database..." />
      ) : historyList.length === 0 ? (
        <EmptyState
          icon={History}
          title="No Analyzer History Yet"
          description="Uploaded resumes and Analyzer analyses will automatically be logged here with timestamps and score breakdowns."
          onUploadClick={() => setActivePage('upload')}
          actionLabel="Upload Resume"
        />
      ) : (
        /* History Table & Cards */
        <div className="space-y-4">
          <div className="hidden md:block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                  <th className="py-4 px-6">Candidate / Resume</th>
                  <th className="py-4 px-6">Date Analyzed</th>
                  <th className="py-4 px-6 text-center">Score</th>
                  <th className="py-4 px-6 text-center">ATS Score</th>
                  <th className="py-4 px-6">Top Job Match</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {historyList.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleLoadHistoryRecord(item)}
                    className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0 font-bold text-xs">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {item.candidate_name}
                          </div>
                          <div className="text-xs text-slate-400 truncate max-w-[180px]">
                            {item.resume_name}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.created_at || 'Just now'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span className="font-extrabold text-blue-600 dark:text-blue-400">
                        {item.overall_score}%
                      </span>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                        {item.ats_score}%
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {item.top_job_title}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Match: {item.top_match_score}%
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLoadHistoryRecord(item);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 hover:bg-blue-100 font-bold text-xs transition-colors"
                        >
                          Load
                        </button>
                        <button
                          onClick={(e) => handleDeleteItem(item.id, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {historyList.map((item) => (
              <div
                key={item.id}
                onClick={() => handleLoadHistoryRecord(item)}
                className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {item.candidate_name}
                  </div>
                  <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
                    {item.overall_score}% Score
                  </span>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  <div>File: {item.resume_name}</div>
                  <div>Top Match: <strong className="text-slate-700 dark:text-slate-300">{item.top_job_title}</strong> ({item.top_match_score}%)</div>
                  <div>Date: {item.created_at}</div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    ATS: {item.ats_score}%
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLoadHistoryRecord(item);
                      }}
                      className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs"
                    >
                      Open
                    </button>
                    <button
                      onClick={(e) => handleDeleteItem(item.id, e)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
