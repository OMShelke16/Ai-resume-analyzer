import React, { useState } from 'react';
import {
  TrendingUp,
  CheckSquare,
  Square,
  AlertCircle,
  Sparkles,
  Lightbulb,
  FileText,
  Layers,
  Briefcase,
  FolderGit2,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { EmptyState } from '../components/EmptyState';

export const ResumeImprovement = ({ setActivePage }) => {
  const { currentAnalysis } = useResume();

  const [checkedItems, setCheckedItems] = useState({});

  if (!currentAnalysis) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Resume Improvement & ATS Checklist
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Section-by-section audit with concrete suggestions to elevate your ATS score and interview callback rates.
          </p>
        </div>
        <EmptyState
          title="No Resume Analyzed Yet"
          description="Upload your resume document in PDF or DOCX format to view personalized improvement suggestions and actionable ATS feedback."
          onUploadClick={() => setActivePage('upload')}
          actionLabel="Upload Resume"
        />
      </div>
    );
  }

  const {
    candidate_name,
    overall_score,
    ats_score,
    skills = {},
    experience = [],
    projects = [],
    recommendations = []
  } = currentAnalysis;

  const toggleCheck = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const sectionsAudit = [
    {
      id: 'summary',
      icon: FileText,
      title: 'Professional Summary',
      status: 'Fair',
      statusColor: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
      priority: 'High',
      priorityColor: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      suggestion:
        'Craft a concise 3-4 sentence professional summary explicitly mentioning your core tech stack (e.g. Python, SQL, REST APIs) and primary career objective.',
    },
    {
      id: 'skills',
      icon: Layers,
      title: 'Technical Skills Taxonomy',
      status: 'Good',
      statusColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
      priority: 'Medium',
      priorityColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      suggestion:
        'Organize skills into labeled subsections (e.g. Languages, Frameworks, Databases, Cloud & DevOps). Add foundational containerization tools like Docker or AWS.',
    },
    {
      id: 'experience',
      icon: Briefcase,
      title: 'Work Experience & Internships',
      status: experience.length > 0 ? 'Good' : 'Needs Work',
      statusColor:
        experience.length > 0
          ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800'
          : 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800',
      priority: 'High',
      priorityColor: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      suggestion:
        'Format all bullet points with the XYZ formula: Accomplished [X], as measured by [Y], by doing [Z]. Emphasize tools used and team collaboration.',
    },
    {
      id: 'projects',
      icon: FolderGit2,
      title: 'Technical Projects Portfolio',
      status: projects.length >= 2 ? 'Strong' : 'Fair',
      statusColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
      priority: 'High',
      priorityColor: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      suggestion:
        'Add measurable outcomes such as performance improvement, user count, processing speedup, or ML model accuracy (e.g. 88% precision, <100ms latency). Include live demo or GitHub links.',
    },
    {
      id: 'education',
      icon: GraduationCap,
      title: 'Education & Academic Credentials',
      status: 'Good',
      statusColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
      priority: 'Low',
      priorityColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      suggestion:
        'Ensure Degree title, University/College name, Graduation Year, and CGPA / Percentage are clearly stated on single lines for parsing.',
    },
    {
      id: 'formatting',
      icon: ShieldCheck,
      title: 'ATS Formatting & Structure',
      status: 'Good',
      statusColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
      priority: 'Medium',
      priorityColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      suggestion:
        'Use single-column layouts, standard sans-serif fonts (e.g. Inter, Calibri), clear bullet points, and avoid text locked inside complex graphics or tables.',
    },
  ];

  const checklist = [
    { id: 'c1', text: 'Include active Email, Phone number, LinkedIn, and GitHub profile URL in header' },
    { id: 'c2', text: 'Structure technical skills into distinct categories (Languages, Frameworks, Databases)' },
    { id: 'c3', text: 'Start each project and experience bullet point with a strong action verb (Engineered, Built, Scaled)' },
    { id: 'c4', text: 'Add at least 2 quantifiable metrics (e.g. percentages, request count, accuracy score)' },
    { id: 'c5', text: 'Incorporate modern DevOps/Cloud keywords (Git, Docker, REST API, AWS)' },
    { id: 'c6', text: 'Ensure resume is saved in standard selectable PDF format without image-only pages' },
    { id: 'c7', text: 'Keep resume length to 1 page for fresh graduates or 2 pages for senior professionals' },
  ];

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPct = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Profile Optimization Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Resume Improvement Suggestions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Personalized advice to optimize ATS keyword density, structural clarity, and recruiter appeal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('upload')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-105 active:scale-95"
          >
            Re-Upload & Test
          </button>
        </div>
      </div>

      {/* Section-by-Section Audit Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <span>Section-by-Section Quality Audit</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sectionsAudit.map((sec) => {
            const Icon = sec.icon;
            return (
              <div
                key={sec.id}
                className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-blue-300 dark:hover:border-blue-800 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                      {sec.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${sec.statusColor}`}>
                      {sec.status}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${sec.priorityColor}`}>
                      {sec.priority} Priority
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {sec.suggestion}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Resume Improvement Checklist */}
      <div className="p-7 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Interactive ATS & Recruiter Checklist</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Check off these actionable items before submitting your resume to job portals.
            </p>
          </div>

          {/* Progress badge */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {completedCount} of {checklist.length} Completed ({progressPct}%)
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Checklist items */}
        <div className="space-y-3">
          {checklist.map((item) => {
            const isChecked = Boolean(checkedItems[item.id]);

            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center gap-3.5 ${
                  isChecked
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex-shrink-0 text-emerald-600 dark:text-emerald-400">
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400" />
                  )}
                </div>

                <span
                  className={`text-xs sm:text-sm font-medium ${
                    isChecked
                      ? 'line-through text-slate-400 dark:text-slate-500'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
