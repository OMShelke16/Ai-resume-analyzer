import React from 'react';
import { FileText, Upload } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = FileText,
  title = 'No Resume Analyzed Yet',
  description = 'Upload your PDF or DOCX resume to extract skills, calculate your ATS score, and unlock AI job recommendations.',
  onUploadClick,
  actionLabel = 'Upload Resume'
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 sm:p-14 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center max-w-xl mx-auto shadow-sm my-6">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-5 ring-8 ring-blue-50/50 dark:ring-blue-950/30">
        <Icon className="w-8 h-8 stroke-[1.8]" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 max-w-md">
        {description}
      </p>

      {onUploadClick && (
        <button
          onClick={onUploadClick}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Upload className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
