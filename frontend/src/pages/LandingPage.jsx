import React from 'react';
import {
  FileCheck2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Search,
  CheckCircle2,
  BarChart3,
  Bot,
  Zap,
  Target,
  FileCode2,
  Database,
  Code2
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const LandingPage = ({ setActivePage }) => {
  const { currentAnalysis } = useResume();

  const features = [
    {
      icon: Bot,
      title: 'AI Resume Analyzer',
      desc: 'Automated entity parsing extracts education, experience, projects, and contact info with zero manual entry.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Code2,
      title: 'Skill Extraction',
      desc: 'Intelligent multi-category taxonomy maps programming languages, frameworks, databases, and DevOps tools.',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: BarChart3,
      title: 'ATS Compatibility Score',
      desc: 'Simulate corporate Applicant Tracking Systems (ATS) with structure, keyword density, and qualification checks.',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Target,
      title: 'Job Description Matching',
      desc: 'Compare candidate profile against custom job postings using TF-IDF Vectorization and Cosine Similarity.',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Layers,
      title: 'Skill Gap Analysis',
      desc: 'Identify matched vs missing skills to know exactly which technologies to learn for target dream roles.',
      color: 'from-rose-500 to-pink-500',
    },
    {
      icon: Sparkles,
      title: 'Personalized Recommendations',
      desc: 'Ranks top 50+ curated industry roles based on hybrid semantic text similarity and direct skill overlap.',
      color: 'from-violet-500 to-blue-500',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Upload Resume',
      desc: 'Upload your PDF or DOCX file. The system safely sanitizes and extracts raw textual tokens locally.',
    },
    {
      num: '02',
      title: 'AI Analyzes Resume',
      desc: 'NLP preprocessors clean text, extract entities, evaluate action verbs, and compute the multi-factor ATS score.',
    },
    {
      num: '03',
      title: 'Compare Skills',
      desc: 'Cross-references your extracted tech skills with job requirements to detect matching proficiencies and gaps.',
    },
    {
      num: '04',
      title: 'Get Job Recommendations',
      desc: 'TF-IDF cosine similarity engine ranks the best matching career roles with transparent match rationales.',
    },
  ];

  const techStack = [
    { name: 'Python 3.11', role: 'Core Logic & ML Engine' },
    { name: 'Flask REST API', role: 'Backend Microservice' },
    { name: 'React 18 + Vite', role: 'Modern Frontend UI' },
    { name: 'Tailwind CSS', role: 'Aesthetic Design System' },
    { name: 'Scikit-learn', role: 'TF-IDF & Cosine Similarity' },
    { name: 'PyPDF / docx', role: 'Document Text Extraction' },
    { name: 'SQLite DB', role: 'Local Relational Database' },
  ];

  return (
    <div className="space-y-20 pb-12">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 text-center max-w-5xl mx-auto px-4">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Academic Project Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>AI / Machine Learning + NLP </span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-6">
          AI Resume Analyzer & <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Job Recommendation System
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
          Analyze your resume, discover skill gaps, and find jobs that match your profile using AI-powered NLP, TF-IDF vectorization, and recommendation techniques.
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <button
            onClick={() => setActivePage('upload')}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Analyze My Resume</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActivePage('dashboard')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-base border border-slate-200 dark:border-slate-700 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Explore Dashboard</span>
          </button>
        </div>

        {/* Hero Mockup Illustration Card */}
        <div className="relative rounded-3xl p-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-2xl">
          <div className="bg-white dark:bg-slate-900 rounded-[22px] p-6 sm:p-8 text-left grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Metric 1 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase">Analyzer Score</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  High Fit
                </span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">88 / 100</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Weighted across skills (35%), experience (20%), projects (15%), and ATS structure.
              </p>
            </div>

            {/* Metric 2 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase">Extracted Skills</span>
                <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold">
                  14 Detected
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">Python</span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded text-xs font-medium">Flask</span>
                <span className="px-2 py-1 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded text-xs font-medium">SQL</span>
                <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded text-xs font-medium">ML</span>
                <span className="px-2 py-1 bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 rounded text-xs font-medium">Git</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase">Top Recommended Job</span>
                <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-xs font-bold">
                  92% Match
                </span>
              </div>
              <div className="font-bold text-slate-900 dark:text-white text-base truncate">
                Junior Python Developer
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Apex Neural Systems (Demo) • ₹5.5L - ₹8.0L
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            Comprehensive AI & NLP Features
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Engineered from scratch using standard Python data science libraries without third-party proprietary dependencies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="group p-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-700/60 transition-all duration-200"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${f.color} flex items-center justify-center text-white mb-5 shadow-md`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
              How The AI System Works
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              An intuitive 4-step natural language processing and machine learning workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 relative"
              >
                <span className="text-3xl font-extrabold text-blue-600/30 dark:text-blue-400/20 mb-3 block">
                  {step.num}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Built With Core Technologies
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Transparent, reproducible, and explainable AI pipeline.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {techStack.map((tech, idx) => (
            <div
              key={idx}
              className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center"
            >
              <div className="font-bold text-slate-900 dark:text-white text-sm">
                {tech.name}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">
                {tech.role}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Analyze Your Resume?
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Upload your resume document to evaluate ATS compatibility, skill gaps, and custom job description matching.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActivePage('upload')}
              className="px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-blue-700 font-bold text-base shadow-md transition-all hover:scale-105"
            >
              Upload Resume Now
            </button>
            <button
              onClick={() => setActivePage('about')}
              className="px-6 py-3.5 rounded-2xl bg-blue-700/60 hover:bg-blue-700 text-white font-semibold text-base border border-white/20 transition-colors"
            >
              View Project Architecture
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
