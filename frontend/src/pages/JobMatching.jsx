import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  Briefcase,
  Building2,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Cpu,
  RefreshCw,
  Search,
  Tag
} from 'lucide-react';
import { api } from '../services/api';
import { useResume } from '../context/ResumeContext';
import { ScoreGauge } from '../components/ScoreGauge';
import { SkillBadge } from '../components/SkillBadge';
import { EmptyState } from '../components/EmptyState';

export const JobMatching = ({ setActivePage }) => {
  const { currentResume, currentAnalysis, addToast } = useResume();
  const [jobTitle, setJobTitle] = useState('Python Backend Developer');
  const [company, setCompany] = useState('Apex Tech Solutions');
  const [location, setLocation] = useState('Bengaluru');
  const [jobDescription, setJobDescription] = useState(
    `We are seeking a skilled Python Backend Developer to design, build, and maintain robust REST APIs and scalable backend services.
Requirements:
- Strong proficiency in Python and web frameworks such as Flask, Django, or FastAPI.
- Experience with relational databases like MySQL or PostgreSQL and writing efficient SQL queries.
- Working knowledge of Git, Docker containers, and RESTful API architectures.
- Familiarity with CI/CD pipelines, caching with Redis, and cloud services (AWS) is a major plus.`
  );

  const [availableJobs, setAvailableJobs] = useState([]);
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  useEffect(() => {
    // Load existing jobs for quick auto-fill selection
    const loadJobsList = async () => {
      try {
        const res = await api.getJobs();
        if (res.success) {
          setAvailableJobs(res.jobs || []);
        }
      } catch (err) {
        console.error('Failed to load sample jobs:', err);
      }
    };
    loadJobsList();
  }, []);

  const handleSelectPredefinedJob = (e) => {
    const jobId = parseInt(e.target.value);
    if (!jobId) return;

    const job = availableJobs.find((j) => j.id === jobId);
    if (job) {
      setJobTitle(job.title);
      setCompany(job.company);
      setLocation(job.location);
      setJobDescription(
        `${job.description}\n\nRequired Skills: ${job.skills.join(', ')}\nExperience: ${job.experience}`
      );
    }
  };

  const handleMatch = async () => {
    if (!currentResume && !currentAnalysis) {
      addToast('Please upload or load a resume first before running job matching.', 'error');
      return;
    }

    if (!jobDescription.trim() || !jobTitle.trim()) {
      addToast('Please provide a job title and description.', 'error');
      return;
    }

    setIsMatching(true);
    try {
      const resumeText = currentResume?.raw_text || currentAnalysis?.raw_text || '';
      const response = await api.matchJob({
        title: jobTitle,
        description: jobDescription,
        resume_text: resumeText,
        resume_id: currentResume?.id,
      });

      if (response.success) {
        setMatchResult(response.match_result);
        addToast('Job match analysis calculated!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to match job', 'error');
    } finally {
      setIsMatching(false);
    }
  };

  if (!currentAnalysis) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Target Job Description Matching
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Compare candidate resume against custom or standard job postings using TF-IDF Cosine Similarity.
          </p>
        </div>
        <EmptyState
          title="No Resume Analyzed Yet"
          description="Upload your resume in PDF or DOCX format to compare against target job descriptions."
          onUploadClick={() => setActivePage('upload')}
          actionLabel="Upload Resume"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
          <Cpu className="w-3.5 h-3.5" />
          <span>TF-IDF Vector Space & Cosine Similarity</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Job Description Matching
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Paste any custom job description or select from available dataset jobs to analyze compatibility, matched skills, and skill gaps.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Job Description Input (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>Target Job Specifications</span>
            </h2>

            {/* Quick Auto-fill Dropdown */}
            {availableJobs.length > 0 && (
              <select
                onChange={handleSelectPredefinedJob}
                className="text-xs font-medium px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Load Preset Job Role...</option>
                {availableJobs.slice(0, 15).map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} ({j.company})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                Job Title
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Python Developer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                Company (Optional)
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. TechCorp"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bengaluru / Remote"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
              Job Description & Required Qualifications
            </label>
            <textarea
              rows={9}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste responsibilities, required skills, and qualification bullet points..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono leading-relaxed"
            />
          </div>

          <div className="pt-1">
            <button
              onClick={handleMatch}
              disabled={isMatching}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              {isMatching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing TF-IDF Vector Cosine Similarity...</span>
                </>
              ) : (
                <>
                  <GitCompare className="w-4 h-4" />
                  <span>Analyze Resume Match</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output: Match Results (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {matchResult ? (
            <div className="p-6 sm:p-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase">Match Calculation</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold">
                  Hybrid Algorithm
                </span>
              </div>

              {/* Gauge */}
              <div className="py-2 flex justify-center">
                <ScoreGauge
                  score={matchResult.overall_match_score}
                  size={170}
                  label="Resume-to-Job Match Score"
                />
              </div>

              {/* Algorithm breakdown metric pills */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">TF-IDF Cosine Similarity</span>
                  <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                    {matchResult.cosine_similarity}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Skill Overlap Ratio</span>
                  <span className="font-extrabold text-purple-600 dark:text-purple-400 text-sm">
                    {matchResult.skill_match_percentage}%
                  </span>
                </div>
              </div>

              {/* AI Rationale */}
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 space-y-1">
                <div className="text-xs font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Why This Score Was Calculated</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {matchResult.rationale}
                </p>
              </div>

              {/* Matched Skills */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>Matching Skills ({matchResult.matched_skills?.length || 0})</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {matchResult.matched_skills && matchResult.matched_skills.length > 0 ? (
                    matchResult.matched_skills.map((sk, idx) => (
                      <SkillBadge key={idx} skill={sk} variant="matched" size="sm" />
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No exact skill keywords matched.</span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>Missing Skills ({matchResult.missing_skills?.length || 0})</span>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {matchResult.missing_skills && matchResult.missing_skills.length > 0 ? (
                    matchResult.missing_skills.map((sk, idx) => (
                      <SkillBadge key={idx} skill={sk} variant="missing" size="sm" />
                    ))
                  ) : (
                    <span className="text-xs text-emerald-600 font-medium">All required skills are satisfied!</span>
                  )}
                </div>
              </div>

              {/* Relevant Keywords */}
              {matchResult.relevant_keywords && matchResult.relevant_keywords.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    TF-IDF Key Job Terms
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {matchResult.relevant_keywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-10 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto">
                <GitCompare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Ready to Compare
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                Click "Analyze Resume Match" to compute similarity vectors, skill overlaps, and keyword correlation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
