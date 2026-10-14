import React from 'react';
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  Banknote,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Target,
  Layers,
  Cpu
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import { useResume } from '../context/ResumeContext';
import { ScoreGauge } from '../components/ScoreGauge';
import { SkillBadge } from '../components/SkillBadge';
import { EmptyState } from '../components/EmptyState';

export const JobDetails = ({ setActivePage }) => {
  const { selectedJob, currentAnalysis } = useResume();

  if (!selectedJob) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Job Details & Skill Gap Breakdown
          </h1>
        </div>
        <EmptyState
          title="No Job Selected"
          description="Select any job card from the Recommendations or Dashboard page to inspect the detailed requirements."
          onUploadClick={() => setActivePage('recommendations')}
          actionLabel="Browse Recommendations"
        />
      </div>
    );
  }

  const job = selectedJob.job || selectedJob;
  const matchScore = selectedJob.match_score || 80;
  const matchingSkills = selectedJob.matching_skills || [];
  const missingSkills = selectedJob.missing_skills || [];
  const rationale = selectedJob.rationale || 'Your profile demonstrates strong foundational overlap with this role.';

  // Pie chart data for matched vs missing skills
  const chartData = [
    { name: 'Matched Skills', value: matchingSkills.length, color: '#10B981' },
    { name: 'Missing Skills', value: Math.max(1, missingSkills.length), color: '#F43F5E' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Back Button */}
      <div>
        <button
          onClick={() => setActivePage('recommendations')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Recommendations</span>
        </button>
      </div>

      {/* Main Job Header Card */}
      <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold">
              {job.job_type || 'Full-time'}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Job ID: #{job.id || 'N/A'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
              <Building2 className="w-4 h-4 text-slate-400" />
              {job.company}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-slate-400" />
              {job.location}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-slate-400" />
              {job.experience}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
              <Banknote className="w-4 h-4" />
              {job.salary}
            </span>
          </div>
        </div>

        {/* Match score gauge in header */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex-shrink-0">
          <ScoreGauge score={matchScore} size={130} strokeWidth={10} showRating={false} />
          <span className="text-xs font-bold text-slate-500 uppercase mt-1">
            Overall Compatibility
          </span>
        </div>
      </div>

      {/* Grid: Job Description & Skill Gap Visual Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Full Description & Why Recommended */}
        <div className="lg:col-span-7 space-y-6">
          {/* Why Recommended AI Rationale */}
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-3xl border border-blue-200/80 dark:border-blue-900/60 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-blue-900 dark:text-blue-300">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>AI Recommendation Rationale</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {rationale}
            </p>
          </div>

          {/* Detailed Job Description */}
          <div className="p-6 sm:p-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>Job Description & Role Overview</span>
            </h2>

            <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-2">
              {job.description}
            </div>

            {/* Required Skills Raw */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                All Required Technical Competencies ({job.skills?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(job.skills || []).map((sk, idx) => (
                  <SkillBadge key={idx} skill={sk} size="sm" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Skill Gap Analysis & Chart */}
        <div className="lg:col-span-5 space-y-6">
          {/* Skill Gap Visual Breakdown */}
          <div className="p-6 sm:p-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600" />
                <span>Skill Gap Analysis</span>
              </h2>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                {matchingSkills.length} Matched / {missingSkills.length} Missing
              </span>
            </div>

            {/* Matched Skills List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Matching Skills ({matchingSkills.length})</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {matchingSkills.length > 0 ? (
                  matchingSkills.map((sk, idx) => (
                    <SkillBadge key={idx} skill={sk} variant="matched" size="sm" />
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No exact skill keywords matched.</span>
                )}
              </div>
            </div>

            {/* Missing Skills List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Missing Skill Requirements ({missingSkills.length})</span>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.length > 0 ? (
                  missingSkills.map((sk, idx) => (
                    <SkillBadge key={idx} skill={sk} variant="missing" size="sm" />
                  ))
                ) : (
                  <span className="text-xs text-emerald-600 font-medium">
                    100% skill requirements covered!
                  </span>
                )}
              </div>
            </div>

            {/* Pie Chart: Matched vs Missing */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-2">
                Skill Coverage Ratio
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                      formatter={(value) => <span className="text-slate-600 dark:text-slate-400 font-medium">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2">
              <button
                onClick={() => setActivePage('upload')}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Analyze My Resume Again</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
