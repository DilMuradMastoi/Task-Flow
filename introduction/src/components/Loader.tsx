import React from 'react';

interface LoaderProps {
  type?: 'skeleton' | 'spinner' | 'page';
  count?: number;
}

export const Loader: React.FC<LoaderProps> = ({ type = 'skeleton', count = 3 }) => {
  if (type === 'spinner') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (type === 'page') {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin shadow-md" />
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
          Loading your agenda...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3.5 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 animate-pulse flex items-center justify-between shadow-xs"
        >
          <div className="flex items-center gap-3.5 w-full">
            <div className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-700 shrink-0" />
            <div className="space-y-2 w-full max-w-md">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-3/4" />
              <div className="h-3 bg-slate-100 dark:bg-slate-700/60 rounded-md w-1/2" />
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-16 h-6 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      ))}
    </div>
  );
};
