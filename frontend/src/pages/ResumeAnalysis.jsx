import React from 'react';
import {
  FileCheck2,
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  FolderGit2,
  BadgeCheck,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BarChart2
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { ScoreGauge } from '../components/ScoreGauge';
import { SkillBadge } from '../components/SkillBadge';
import { EmptyState } from '../components/EmptyState';

export const ResumeAnalysis = ({ setActivePage }) => {
  const { currentAnalysis } = useResume();

  if (!currentAnalysis) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Detailed Resume Analysis & ATS Breakdown
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Deep dive into NLP entity extraction, ATS simulation score, strengths, and weaknesses.
          </p>
        </div>
        <EmptyState
          title="No Resume Analyzed Yet"
          description="Upload your resume in PDF or DOCX format to view detailed extracted entities, technical skills, and ATS audit scores."
          onUploadClick={() => setActivePage('upload')}
          actionLabel="Upload Resume"
        />
      </div>
    );
  }

  const {
    candidate_name,
    email,
    phone,
    location,
    overall_score = 0,
    score_breakdown = {},
    ats_score = 0,
    ats_breakdown = {},
    skills = {},
    education = [],
    experience = [],
    projects = [],
    certifications = [],
    strengths = [],
    weaknesses = [],
    recommendations = []
  } = currentAnalysis;

  const atsMetrics = [
    {
      title: 'Keyword Optimization',
      score: ats_breakdown.keyword_optimization || 85,
      desc: 'Density of industry standard technical terms, toolsets, and action verbs.',
      color: 'bg-blue-600',
    },
    {
      title: 'Resume Structure & Formatting',
      score: ats_breakdown.resume_structure || 90,
      desc: 'Standardized section headers, readable layout, and contact metadata completeness.',
      color: 'bg-emerald-600',
    },
    {
      title: 'Skills Coverage',
      score: ats_breakdown.skills_coverage || 82,
      desc: 'Multi-domain technical proficiency across languages, databases, and frameworks.',
      color: 'bg-purple-600',
    },
    {
      title: 'Experience Relevance',
      score: ats_breakdown.experience_relevance || 75,
      desc: 'Clear job titles, timelines, and action-oriented responsibility descriptions.',
      color: 'bg-amber-500',
    },
    {
      title: 'Education & Qualifications',
      score: ats_breakdown.education_quality || 88,
      desc: 'Recognized academic degree, verified institution name, and graduation year.',
      color: 'bg-cyan-600',
    },
    {
      title: 'Project Practicality',
      score: ats_breakdown.project_relevance || 85,
      desc: 'Technical project depth, modern software stacks, and measurable outcomes.',
      color: 'bg-rose-500',
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>NLP Entity Extraction & Scoring</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Resume Analysis & ATS Audit
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Automated entity detection, weighted academic scoring, and corporate ATS simulation metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('matching')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-105 active:scale-95"
          >
            Match With Job
          </button>
          <button
            onClick={() => setActivePage('improvement')}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-colors"
          >
            Improvement Tips
          </button>
        </div>
      </div>

      {/* Top Scoring Banner (Overall Score + ATS Score) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Circular Overall Score */}
        <div className="p-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Academic Analyzer Score
          </div>
          <ScoreGauge score={overall_score} size={180} label="Resume Analyzer Score" />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-relaxed max-w-xs">
            Academic metric computed via weighted evaluation of skills, experience, education, and keywords.
          </p>
        </div>

        {/* Center: ATS Score & Weighted Breakdown */}
        <div className="lg:col-span-2 p-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                <span>Weighted Scoring Formula</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Configurable academic evaluation weights</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{ats_score}%</span>
              <span className="text-[11px] block font-semibold text-slate-400">ATS Rating</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Skills Relevance (35%)</span>
                <span className="text-blue-600 font-bold">{score_breakdown.skills_match || 80}%</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${score_breakdown.skills_match || 80}%` }} />
              </div>
            </div>

            <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Experience Depth (20%)</span>
                <span className="text-indigo-600 font-bold">{score_breakdown.experience || 75}%</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${score_breakdown.experience || 75}%` }} />
              </div>
            </div>

            <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Project Quality (15%)</span>
                <span className="text-purple-600 font-bold">{score_breakdown.projects || 85}%</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: `${score_breakdown.projects || 85}%` }} />
              </div>
            </div>

            <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Education Fit (10%)</span>
                <span className="text-emerald-600 font-bold">{score_breakdown.education || 90}%</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${score_breakdown.education || 90}%` }} />
              </div>
            </div>

            <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Resume Completeness (10%)</span>
                <span className="text-amber-600 font-bold">{score_breakdown.resume_completeness || 90}%</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${score_breakdown.resume_completeness || 90}%` }} />
              </div>
            </div>

            <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Keyword Density (10%)</span>
                <span className="text-cyan-600 font-bold">{score_breakdown.keyword_relevance || 80}%</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-600 rounded-full" style={{ width: `${score_breakdown.keyword_relevance || 80}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extracted Personal Information & Categorized Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Extracted Personal Info */}
        <div className="p-6 sm:p-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <User className="w-4 h-4 text-blue-600" />
            <span>Candidate Identification</span>
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-bold block">Candidate Name</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">{candidate_name}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-bold block">Email Address</span>
                <span className="font-medium text-slate-700 dark:text-slate-300 truncate block max-w-[200px]">
                  {email}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-bold block">Phone Number</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-bold block">Location</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categorized Technical Skills */}
        <div className="lg:col-span-2 p-6 sm:p-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>Extracted Technical Competencies</span>
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 font-bold">
              Categorized
            </span>
          </div>

          <div className="space-y-4">
            {Object.entries(skills).map(([cat, skList]) => {
              if (skList.length === 0) return null;
              const titles = {
                programming_languages: 'Programming Languages',
                frameworks_and_libraries: 'Frameworks & Libraries',
                databases: 'Databases & Storage',
                cloud_and_devops: 'Cloud & DevOps',
                tools_and_platforms: 'Tools & Platforms',
                concepts_and_domains: 'Concepts & Architectures',
                soft_skills: 'Soft Skills & Leadership'
              };

              return (
                <div key={cat} className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {titles[cat] || cat} ({skList.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {skList.map((skill, sIdx) => (
                      <SkillBadge key={sIdx} skill={skill} category={cat} size="sm" />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Education, Experience & Projects */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Education Card */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>Education</span>
          </h2>

          {education.length > 0 ? (
            <div className="space-y-4">
              {education.map((edu, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                    {edu.degree}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {edu.institution}
                  </div>
                  {edu.graduation_year !== 'Not detected' && (
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                      Year: {edu.graduation_year}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic">No formal education degree detected.</div>
          )}
        </div>

        {/* Experience Card */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <span>Work Experience</span>
          </h2>

          {experience.length > 0 ? (
            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1.5">
                  <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                    {exp.title}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 flex justify-between">
                    <span>{exp.company}</span>
                    <span className="font-medium text-slate-500">{exp.duration}</span>
                  </div>
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <ul className="text-xs text-slate-500 dark:text-slate-400 list-disc list-inside space-y-1 pt-1">
                      {exp.responsibilities.slice(0, 2).map((r, rIdx) => (
                        <li key={rIdx} className="leading-snug">{r}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic">No previous employment detected (Entry Level).</div>
          )}
        </div>

        {/* Projects Card */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <FolderGit2 className="w-4 h-4 text-purple-600" />
            <span>Key Projects</span>
          </h2>

          {projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((proj, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                    {proj.name}
                  </div>
                  <div className="text-xs text-purple-600 dark:text-purple-400 font-mono">
                    {proj.technologies}
                  </div>
                  {proj.description && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 pt-0.5">
                      {proj.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic">No specific projects identified.</div>
          )}
        </div>
      </div>

      {/* ATS Compatibility Deep Dive Section */}
      <div className="p-7 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>ATS Compatibility Breakdown</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Evaluates how effectively standard recruitment ATS scanners can parse your resume.
            </p>
          </div>
          <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold self-start sm:self-center">
            Total ATS Score: {ats_score}%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {atsMetrics.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</span>
                <span className="font-extrabold text-sm text-blue-600 dark:text-blue-400">{item.score}%</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.score}%` }} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths, Weaknesses & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Strengths */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-emerald-200 dark:border-emerald-900/40 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 pb-3 border-b border-emerald-100 dark:border-emerald-900/40">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Profile Strengths</span>
          </h2>
          <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            {strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/40 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-rose-800 dark:text-rose-300 flex items-center gap-2 pb-3 border-b border-rose-100 dark:border-rose-900/40">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Identified Gaps</span>
          </h2>
          <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            {weaknesses.map((w, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actionable Recommendations */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-amber-200 dark:border-amber-900/40 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2 pb-3 border-b border-amber-100 dark:border-amber-900/40">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <span>Actionable Tips</span>
          </h2>
          <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
