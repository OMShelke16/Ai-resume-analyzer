import React from 'react';

export const ScoreGauge = ({
  score = 0,
  size = 180,
  strokeWidth = 14,
  label = 'Overall Score',
  sublabel = 'out of 100',
  showRating = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedScore = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let strokeColor = '#10B981'; // Emerald 500
  let ratingText = 'Exceptional Fit';
  let ratingColor = 'text-emerald-600 dark:text-emerald-400';

  if (clampedScore < 50) {
    strokeColor = '#EF4444'; // Red 500
    ratingText = 'Needs Optimization';
    ratingColor = 'text-rose-600 dark:text-rose-400';
  } else if (clampedScore < 70) {
    strokeColor = '#F59E0B'; // Amber 500
    ratingText = 'Average Candidate Fit';
    ratingColor = 'text-amber-600 dark:text-amber-400';
  } else if (clampedScore < 85) {
    strokeColor = '#3B82F6'; // Blue 500
    ratingText = 'Strong Match';
    ratingColor = 'text-blue-600 dark:text-blue-400';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
            fill="transparent"
          />
          {/* Animated progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {clampedScore}
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            {sublabel}
          </span>
        </div>
      </div>

      {label && (
        <span className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </span>
      )}
      {showRating && (
        <span className={`text-xs font-semibold px-2.5 py-0.5 mt-1 rounded-full bg-slate-100 dark:bg-slate-800 ${ratingColor}`}>
          {ratingText}
        </span>
      )}
    </div>
  );
};
