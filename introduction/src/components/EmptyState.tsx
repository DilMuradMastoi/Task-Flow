import React from 'react';
import { EmptyStateIllustration } from '../assets/illustrations';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  showButton?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No tasks found here',
  description = 'Your agenda is crystal clear. Why not add a new priority or check your completed milestones?',
  actionLabel = 'Create New Task',
  onAction,
  showButton = true
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-6 max-w-md mx-auto animate-in fade-in duration-500">
      <div className="p-4 rounded-full bg-indigo-50/50 dark:bg-indigo-950/20">
        <EmptyStateIllustration className="w-44 h-44 transition-transform duration-500 hover:scale-105" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      {showButton && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all active:scale-95 duration-200"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
