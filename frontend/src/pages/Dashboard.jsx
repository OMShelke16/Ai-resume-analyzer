import React from 'react';
import {
  FileText,
  Award,
  Layers,
  Briefcase,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Building2,
  CheckCircle2,
  TrendingUp,
  Cpu,
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { useResume } from '../context/ResumeContext';
import { ScoreGauge } from '../components/ScoreGauge';
import { SkillBadge } from '../components/SkillBadge';
import { EmptyState } from '../components/EmptyState';

export const Dashboard = ({ setActivePage, onSelectJob }) => {
  const { currentResume, currentAnalysis, topRecommendations = [], setSelectedJob } = useResume();

  if (!currentAnalysis) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Recruitment & Analyzer Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Overview of AI resume Analyzer metrics, extracted competencies, and matching jobs.
          </p>
        </div>
        <EmptyState
          title="No Resume Analyzed Yet"
          description="Upload your resume in PDF or DOCX format to view the AI analysis dashboard, ATS compatibility score, skill breakdowns, and job matches."
          onUploadClick={() => setActivePage('upload')}
          actionLabel="Upload Resume"
        />
      </div>
    );
  }

  const {
    candidate_name = 'Candidate',
    email = 'Not detected',
    phone = 'Not detected',
    location = 'Not detected',
    overall_score = 0,
    score_breakdown = {},
    ats_score = 0,
    skills = {},
    education = [],
    experience = [],
    projects = [],
    strengths = [],
    weaknesses = []
  } = currentAnalysis;

  // Safe breakdown values with fallback
  const safeBreakdown = score_breakdown || {};
  const skillsMatchScore = safeBreakdown.skills_match ?? 80;
  const expScore = safeBreakdown.experience ?? 75;
  const projScore = safeBreakdown.projects ?? 85;
  const eduScore = safeBreakdown.education ?? 90;
  const atsCompletenessScore = safeBreakdown.resume_completeness ?? 90;

  // Flatten skills for counts
  let totalSkillsCount = 0;
  const skillCategoryData = [];

  const categoryLabels = {
    programming_languages: 'Languages',
    frameworks_and_libraries: 'Frameworks',
    databases: 'Databases',
    cloud_and_devops: 'DevOps & Cloud',
    tools_and_platforms: 'Tools',
    concepts_and_domains: 'Concepts',
    soft_skills: 'Soft Skills'
  };

  const safeSkills = skills && typeof skills === 'object' ? skills : {};
  Object.entries(safeSkills).forEach(([cat, list]) => {
    if (Array.isArray(list)) {
      totalSkillsCount += list.length;
      if (list.length > 0) {
        skillCategoryData.push({
          category: categoryLabels[cat] || cat,
          count: list.length,
          skills: list.join(', ')
        });
      }
    }
  });

  const safeTopRecs = Array.isArray(topRecommendations) ? topRecommendations : [];
  const topJobMatch = safeTopRecs.length > 0 ? safeTopRecs[0] : null;

  const handleViewJob = (rec) => {
    if (setSelectedJob) setSelectedJob(rec);
    if (onSelectJob) onSelectJob(rec);
    setActivePage('job-detail');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-blue-500/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Resume Analyzer System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {candidate_name && candidate_name !== 'Not detected' ? candidate_name : 'Candidate'}
          </h1>
          <p className="text-blue-100 text-sm mt-1 max-w-xl leading-relaxed">
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('analysis')}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-blue-700 text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-105 active:scale-95"
          >
            Full Analysis
          </button>
          <button
            onClick={() => setActivePage('matching')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold transition-colors"
          >
            Match Job
          </button>
        </div>
      </div>

      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Overall Score */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Score</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {overall_score} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
              ATS Compatible: {ats_score}%
            </div>
          </div>
        </div>

        {/* KPI 2: Skills Detected */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skills Detected</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {totalSkillsCount} <span className="text-xs font-normal text-slate-400">Proficiencies</span>
            </div>
            <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
              Across {skillCategoryData.length} categories
            </div>
          </div>
        </div>

        {/* KPI 3: Recommended Jobs */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Job Matches</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {topJobMatch ? `${topJobMatch.match_score}%` : 'Ready'}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 truncate max-w-[140px]">
              {topJobMatch?.job?.title || 'Ranked in dataset'}
            </div>
          </div>
        </div>

        {/* KPI 4: Skill Gap Count */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Skill Gaps</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {(weaknesses || []).length} <span className="text-xs font-normal text-slate-400">Identified</span>
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
              Actionable items ready
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Resume Overview + Circular Score + Skill Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* A. Resume Overview Card */}
        <div className="p-6 sm:p-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>Candidate Profile</span>
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold">
              Parsed
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase block">Name</span>
              <span className="font-bold text-slate-800 dark:text-slate-100 text-base">
                {candidate_name || 'Not detected'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Email</span>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate block">
                  {email || 'Not detected'}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Phone</span>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300 block">
                  {phone || 'Not detected'}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase block">Location</span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {location || 'Not detected'}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase block">Education</span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-200 block mt-0.5">
                {education && education.length > 0 ? education[0].degree : 'Degree not detected'}
              </span>
              <span className="text-[11px] text-slate-400 block">
                {education && education.length > 0 ? education[0].institution : ''}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase block">Experience</span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-200 block mt-0.5">
                {experience && experience.length > 0 ? `${experience[0].title || 'Role'} - ${experience[0].company || ''}` : 'Entry-Level / Projects'}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActivePage('analysis')}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1"
            >
              <span>View Full Extracted Entities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* B. Large Circular Score Gauge */}
        <div className="p-6 sm:p-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-between text-center">
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Academic Analyzer Score</span>
            </h2>
            <span className="text-xs text-slate-400">Weighted NLP</span>
          </div>

          <div className="py-4">
            <ScoreGauge score={overall_score} size={190} strokeWidth={15} />
          </div>

          <div className="w-full grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="text-left">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Skills Match</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{skillsMatchScore}%</span>
            </div>
            <div className="text-left">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Experience</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{expScore}%</span>
            </div>
            <div className="text-left">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Projects</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{projScore}%</span>
            </div>
            <div className="text-left">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">ATS Structure</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{atsCompletenessScore}%</span>
            </div>
          </div>
        </div>

        {/* C. Skill Distribution Chart */}
        <div className="p-6 sm:p-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              <span>Skill Category Breakdown</span>
            </h2>
            <span className="text-xs text-slate-400 font-semibold">{totalSkillsCount} Total</span>
          </div>

          <div className="h-56 w-full pt-2">
            {skillCategoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillCategoryData} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
                  <XAxis
                    dataKey="category"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    angle={-25}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No skill categories detected
              </div>
            )}
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 text-center pt-2">
            Distribution across technical taxonomy domains
          </div>
        </div>
      </div>

      {/* D. Top Job Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Top Recommended Jobs For You
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Ranked dynamically using TF-IDF text similarity and skill overlap calculation.
            </p>
          </div>

          <button
            onClick={() => setActivePage('recommendations')}
            className="flex items-center gap-1 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>Explore All Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {safeTopRecs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {safeTopRecs.slice(0, 3).map((rec, idx) => {
              const job = rec.job || {};
              const isTop = idx === 0;

              return (
                <div
                  key={idx}
                  className={`p-6 bg-white dark:bg-slate-900 rounded-3xl border shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-lg ${
                    isTop
                      ? 'border-blue-300 dark:border-blue-800/80 ring-2 ring-blue-500/10'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                        {job.job_type || 'Full-time'}
                      </span>
                      <span className="text-sm font-extrabold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                        {rec.match_score}% Match
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {job.title}
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{job.company}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                    </div>

                    {/* Matching Skills Badges */}
                    <div className="mt-4 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Matching Skills ({rec.matching_skills?.length || 0})
                      </span>
                      <div className="flex flex-wrap gap-1.5 max-h-16 overflow-hidden">
                        {(rec.matching_skills || []).slice(0, 4).map((sk, sIdx) => (
                          <SkillBadge key={sIdx} skill={sk} variant="matched" size="sm" />
                        ))}
                        {(rec.matching_skills?.length || 0) > 4 && (
                          <span className="text-[11px] text-slate-400 self-center">
                            +{rec.matching_skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Missing Skills */}
                    {rec.missing_skills && rec.missing_skills.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          Skill Gaps ({rec.missing_skills.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {rec.missing_skills.slice(0, 3).map((sk, sIdx) => (
                            <SkillBadge key={sIdx} skill={sk} variant="missing" size="sm" />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rationale snippet */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-relaxed line-clamp-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
                      {rec.rationale}
                    </p>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {job.salary || 'Competitive'}
                    </span>
                    <button
                      onClick={() => handleViewJob(rec)}
                      className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No recommendations available yet. Navigate to Job Recommendations to browse open roles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
