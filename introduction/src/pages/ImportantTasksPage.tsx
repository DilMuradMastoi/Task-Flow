import React from 'react';
import { useTasks } from '../hooks/useTasks';
import { FilterBar } from '../components/FilterBar';
import { TaskList } from '../components/TaskList';
import { AlertCircle, Plus } from 'lucide-react';

interface ImportantTasksPageProps {
  onOpenNewTask: () => void;
  onEditTask: (task: any) => void;
}

export const ImportantTasksPage: React.FC<ImportantTasksPageProps> = ({
  onOpenNewTask,
  onEditTask
}) => {
  const { filteredAndSortedTasks } = useTasks();

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <AlertCircle className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Important & High Priority ({filteredAndSortedTasks.length})
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Crucial tasks marked as High or Urgent priority
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenNewTask}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Task</span>
        </button>
      </div>

      <FilterBar />

      <TaskList
        onEditTask={onEditTask}
        onNewTask={onOpenNewTask}
        emptyTitle="No high priority items"
        emptyDesc="None of your tasks are currently marked as High or Urgent priority."
      />
    </div>
  );
};
