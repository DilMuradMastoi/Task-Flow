import React from 'react';

interface ProgressBarProps {
  progress: number;
  height?: string;
  showLabel?: boolean;
  colorClass?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 'h-2',
  showLabel = false,
  colorClass = 'bg-indigo-500 dark:bg-indigo-400',
  className = ''
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  const getStatusColor = () => {
    if (clampedProgress === 100) return 'bg-emerald-500 dark:bg-emerald-400';
    if (clampedProgress >= 60) return colorClass;
    if (clampedProgress >= 30) return 'bg-amber-500 dark:bg-amber-400';
    return 'bg-slate-400 dark:bg-slate-500';
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">
          <span>Progress</span>
          <span className="font-semibold">{clampedProgress}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-200 dark:bg-slate-700/60 rounded-full overflow-hidden ${height}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${getStatusColor()}`}
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};
