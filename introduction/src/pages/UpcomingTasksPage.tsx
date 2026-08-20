import React from 'react';
import { useTasks } from '../hooks/useTasks';
import { FilterBar } from '../components/FilterBar';
import { TaskList } from '../components/TaskList';
import { Clock, Plus } from 'lucide-react';

interface UpcomingTasksPageProps {
  onOpenNewTask: () => void;
  onEditTask: (task: any) => void;
}

export const UpcomingTasksPage: React.FC<UpcomingTasksPageProps> = ({
  onOpenNewTask,
  onEditTask
}) => {
  const { filteredAndSortedTasks } = useTasks();

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Clock className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Upcoming Schedule ({filteredAndSortedTasks.length})
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Plan ahead with tasks scheduled for this week and beyond
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
        emptyTitle="No upcoming tasks"
        emptyDesc="You don't have any tasks scheduled for future dates yet."
      />
    </div>
  );
};
