import React from 'react';
import { useTasks } from '../hooks/useTasks';
import { FilterBar } from '../components/FilterBar';
import { TaskList } from '../components/TaskList';
import { CheckCircle2, Trash2 } from 'lucide-react';

interface CompletedTasksPageProps {
  onOpenNewTask: () => void;
  onEditTask: (task: any) => void;
}

export const CompletedTasksPage: React.FC<CompletedTasksPageProps> = ({
  onOpenNewTask,
  onEditTask
}) => {
  const { filteredAndSortedTasks, clearCompleted } = useTasks();

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Completed Tasks ({filteredAndSortedTasks.length})
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Milestones and tasks you have successfully accomplished
              </p>
            </div>
          </div>
        </div>

        {filteredAndSortedTasks.length > 0 && (
          <button
            onClick={clearCompleted}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold text-xs sm:text-sm hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Completed</span>
          </button>
        )}
      </div>

      <FilterBar />

      <TaskList
        onEditTask={onEditTask}
        onNewTask={onOpenNewTask}
        emptyTitle="No completed tasks yet"
        emptyDesc="When you finish tasks, check them off and they will be archived safely here."
      />
    </div>
  );
};
