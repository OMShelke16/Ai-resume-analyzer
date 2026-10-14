import React from 'react';
import {
  Info,
  BookOpen,
  Cpu,
  Layers,
  Code2,
  Database,
  Sparkles,
  CheckCircle2,
  FileText,
  FileCheck2,
  ShieldCheck,
  Zap,
  Target,
  Upload
} from 'lucide-react';

export const AboutProject = ({ setActivePage }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-300 pb-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span></span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Resume Analyzer & Job Recommendation System
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          A comprehensive AI/ML and Natural Language Processing platform designed for automated resume parsing, candidate scoring, and semantic job matching.
        </p>
      </div>

      {/* 1. Problem Statement & Motivation */}
      <div className="p-7 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          <span>1. Problem Statement & Objectives</span>
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Recruitment teams manually review hundreds of resumes for each open tech role, which is tedious, prone to unconscious bias, and inefficient. Similarly, job seekers struggle to know why their applications get rejected by corporate Applicant Tracking Systems (ATS) or which skills they are missing.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong>This project solves both problems:</strong> It utilizes local NLP tokenization, regex-based entity extraction, TF-IDF vectorization, and Cosine Similarity to automatically parse candidate resumes, calculate academic ATS compatibility, and rank curated career openings with transparent match rationales.
        </p>
      </div>

      {/* 2. System Architecture Flow */}
      <div className="p-7 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-600" />
          <span>2. End-to-End System Architecture</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase">Phase 1</span>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Document Ingestion</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              PyPDF2 / pdfplumber and python-docx extract selectable raw textual tokens from uploaded PDF/DOCX files.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-indigo-600 uppercase">Phase 2</span>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">NLP & Entity Extraction</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Text cleaning, stopword removal, and regex taxonomy mapping categorize skills, education, and experience.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-purple-600 uppercase">Phase 3</span>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">TF-IDF & Similarity</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Computes TF-IDF vector representations and evaluates Cosine Similarity + Skill Jaccard indices against job descriptions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-emerald-600 uppercase">Phase 4</span>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Scoring & UI Rendering</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Weighted academic scoring generates ATS metrics, skill gaps, and ranked job recommendations saved in SQLite.
            </p>
          </div>
        </div>
      </div>

      {/* 3. AI / Machine Learning Algorithms Explained */}
      <div className="p-7 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-600" />
          <span>3. Core AI/ML Mathematical Formulations</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>TF-IDF (Term Frequency-Inverse Document Frequency)</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Measures the relative importance of words across resumes and job descriptions while discounting common stop words:
            </p>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl font-mono text-xs text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700">
              TF-IDF(t, d, D) = TF(t, d) × log( |D| / (1 + DF(t, D)) )
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span>Cosine Similarity In Vector Space</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Calculates the cosine angle between candidate vector <strong>A</strong> and job description vector <strong>B</strong>:
            </p>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl font-mono text-xs text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700">
              Cosine(A, B) = (A · B) / ( ||A|| × ||B|| )
            </div>
          </div>
        </div>
      </div>

      {/* 4. Quick Actions */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Experience The Complete AI Workflow Now
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setActivePage('upload')}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Resume</span>
          </button>
          <button
            onClick={() => setActivePage('matching')}
            className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all"
          >
            Test Job Matcher
          </button>
        </div>
      </div>
    </div>
  );
};
