import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Building2,
  MapPin,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  ChevronDown,
  RotateCcw,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';
import { useResume } from '../context/ResumeContext';
import { SkillBadge } from '../components/SkillBadge';
import { EmptyState } from '../components/EmptyState';
import { LoadingAnalysis } from '../components/LoadingSkeleton';

export const JobRecommendations = ({ setActivePage, onSelectJob }) => {
  const { currentResume, currentAnalysis, setSelectedJob } = useResume();
  const [recommendations, setRecommendations] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    locations: [],
    job_types: [],
    experiences: [],
    categories: [],
    top_skills: [],
    total_jobs: 0
  });
  const [loading, setLoading] = useState(false);

  // Multi-filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('all');

  // Load dynamic filter options on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await api.getJobFilters();
        if (res.success && res.filters) {
          setFilterOptions(res.filters);
        }
      } catch (err) {
        console.error('Failed to load filter options:', err);
      }
    };
    fetchFilters();
  }, []);

  // Fetch recommendations whenever resume or server-side parameters change
  useEffect(() => {
    const fetchRecs = async () => {
      if (!currentResume && !currentAnalysis) return;

      setLoading(true);
      try {
        const resumeText = currentResume?.raw_text || currentAnalysis?.raw_text || '';
        const res = await api.getRecommendations({
          resume_text: resumeText,
          resume_id: currentResume?.id,
          top_n: 100,
        });

        if (res.success) {
          setRecommendations(res.recommendations || []);
        }
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecs();
  }, [currentResume, currentAnalysis]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedLocation('all');
    setSelectedExperience('all');
    setSelectedCategory('all');
    setSelectedSkill('all');
  };

  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    selectedType !== 'all' ||
    selectedLocation !== 'all' ||
    selectedExperience !== 'all' ||
    selectedCategory !== 'all' ||
    selectedSkill !== 'all';

  if (!currentAnalysis) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Job Recommendations
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Personalized career opportunities ranked via TF-IDF Vector Space matching and Skill Jaccard indices.
          </p>
        </div>
        <EmptyState
          title="No Resume Analyzed Yet"
          description="Upload your resume in PDF or DOCX format to rank all jobs dynamically against your skill profile."
          onUploadClick={() => setActivePage('upload')}
          actionLabel="Upload Resume"
        />
      </div>
    );
  }

  // Multi-criteria client-side filtering over the calculated recommendations
  const filteredRecommendations = recommendations.filter((rec) => {
    const job = rec.job || {};

    // 1. Search Query
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      const matchTitle = job.title?.toLowerCase().includes(q);
      const matchCompany = job.company?.toLowerCase().includes(q);
      const matchSkills = job.skills?.some((s) => s.toLowerCase().includes(q));
      const matchDesc = job.description?.toLowerCase().includes(q);
      if (!(matchTitle || matchCompany || matchSkills || matchDesc)) return false;
    }

    // 2. Job Type
    if (selectedType !== 'all' && job.job_type?.toLowerCase() !== selectedType.toLowerCase()) {
      return false;
    }

    // 3. Location
    if (selectedLocation !== 'all' && !job.location?.toLowerCase().includes(selectedLocation.toLowerCase())) {
      return false;
    }

    // 4. Experience
    if (selectedExperience !== 'all' && !job.experience?.toLowerCase().includes(selectedExperience.toLowerCase())) {
      return false;
    }

    // 5. Category
    if (selectedCategory !== 'all' && job.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }

    // 6. Skill
    if (selectedSkill !== 'all') {
      const hasSkill = job.skills?.some((s) => s.toLowerCase() === selectedSkill.toLowerCase());
      if (!hasSkill) return false;
    }

    return true;
  });

  const handleViewJob = (rec) => {
    setSelectedJob(rec);
    if (onSelectJob) onSelectJob(rec);
    setActivePage('job-detail');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>Hybrid Recommendation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Curated Job Recommendations
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {filterOptions.total_jobs > 0 ? `${filterOptions.total_jobs} total roles` : 'Roles'} in the active dataset are dynamically ranked against your candidate skill vectors.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300">
            {filteredRecommendations.length} Roles Matching
          </span>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border border-rose-200 dark:border-rose-900/60 font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Multi-Filter Controls Bar */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Search input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by job title (e.g. Data Scientist, Python, Machine Learning), company, or skills..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Dynamic Filter Selects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* 1. Job Type Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Job Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {filterOptions.job_types.map((jt) => (
                <option key={jt} value={jt}>{jt}</option>
              ))}
            </select>
          </div>

          

          {/* 3. Experience Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Experience
            </label>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Experience</option>
              {filterOptions.experiences.map((exp) => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
          </div>

          {/* 4. Category Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {filterOptions.categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* 5. Key Skill Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Key Skill
            </label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Skills</option>
              {filterOptions.top_skills.map((sk) => (
                <option key={sk} value={sk}>{sk}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingAnalysis message="Calculating TF-IDF cosine distances across all job postings..." />
      ) : filteredRecommendations.length === 0 ? (
        /* Empty state when no jobs match filters */
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto">
            <SlidersHorizontal className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No jobs found matching your filters.
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-md mx-auto">
              Try adjusting your search query, location, experience, or job type criteria to discover more opportunities.
            </p>
          </div>
          <button
            onClick={handleClearFilters}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear Filters</span>
          </button>
        </div>
      ) : (
        /* Recommendations Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.map((rec, idx) => {
            const job = rec.job || {};
            const score = rec.match_score;

            let scoreBadgeColor = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50';
            if (score < 65) {
              scoreBadgeColor = 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800/50';
            } else if (score < 80) {
              scoreBadgeColor = 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800/50';
            }

            return (
              <div
                key={idx}
                className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-700/60 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top row: Type + Category + Match Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                        {job.job_type || 'Full-time'}
                      </span>
                      {job.category && (
                        <span className="text-[11px] px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold">
                          {job.category}
                        </span>
                      )}
                    </div>
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full border shrink-0 ${scoreBadgeColor}`}>
                      {score}% Match
                    </span>
                  </div>

                  {/* Title & Company */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {job.title}
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{job.company}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {job.location}
                      </span>
                    </div>
                  </div>

                  {/* Experience & Salary */}
                  <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 font-medium">
                    <span className="text-slate-500 dark:text-slate-400">Exp: {job.experience || 'Not specified'}</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold truncate max-w-[150px]">{job.salary || 'Competitive'}</span>
                  </div>

                  {/* Matching Skills */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Matching Skills ({rec.matching_skills?.length || 0})
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-14 overflow-hidden">
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
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Skill Gaps ({rec.missing_skills.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5 max-h-14 overflow-hidden">
                        {rec.missing_skills.slice(0, 3).map((sk, sIdx) => (
                          <SkillBadge key={sIdx} skill={sk} variant="missing" size="sm" />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Why Recommended box */}
                  <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 space-y-1">
                    <div className="text-[11px] font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-blue-600" />
                      <span>Why Recommended</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug line-clamp-2">
                      {rec.rationale}
                    </p>
                  </div>
                </div>

                {/* Footer action */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleViewJob(rec)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:hover:bg-blue-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>View Match Breakdown</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  {job.link && (
                    <a
                      href={job.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                      title="Open Job Posting"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
