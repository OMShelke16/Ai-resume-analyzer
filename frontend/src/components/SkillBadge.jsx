import React from 'react';
import { Check, X, Tag } from 'lucide-react';

export const SkillBadge = ({
  skill,
  variant = 'default',
  category = null,
  size = 'md',
  onClick = null,
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs md:text-sm',
    lg: 'px-3.5 py-1.5 text-sm font-medium',
  };

  if (variant === 'matched') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-lg font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/50 shadow-sm ${sizeClasses[size]}`}
      >
        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
        {skill}
      </span>
    );
  }

  if (variant === 'missing') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-lg font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/50 shadow-sm ${sizeClasses[size]}`}
      >
        <X className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400 stroke-[2.5]" />
        {skill}
      </span>
    );
  }

  // Category specific styles
  let colorClass = 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700';

  if (category === 'programming_languages') {
    colorClass = 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900/60';
  } else if (category === 'frameworks_and_libraries') {
    colorClass = 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-900/60';
  } else if (category === 'databases') {
    colorClass = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900/60';
  } else if (category === 'cloud_and_devops') {
    colorClass = 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-900/60';
  } else if (category === 'concepts_and_domains') {
    colorClass = 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900/60';
  } else if (category === 'soft_skills') {
    colorClass = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60';
  }

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg border font-medium transition-all duration-150 ${colorClass} ${sizeClasses[size]} ${
        onClick ? 'cursor-pointer hover:opacity-80' : ''
      }`}
    >
      <Tag className="w-3 h-3 opacity-60" />
      {skill}
    </span>
  );
};
