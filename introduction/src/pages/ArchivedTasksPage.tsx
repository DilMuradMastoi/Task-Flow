import React from 'react';
import { useTasks } from '../hooks/useTasks';
import { FilterBar } from '../components/FilterBar';
import { TaskList } from '../components/TaskList';
import { Archive, Info } from 'lucide-react';

interface ArchivedTasksPageProps {
  onOpenNewTask: () => void;
  onEditTask: (task: any) => void;
}

export const ArchivedTasksPage: React.FC<ArchivedTasksPageProps> = ({
  onOpenNewTask,
  onEditTask
}) => {
  const { filteredAndSortedTasks } = useTasks();

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Archive className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Archived Tasks ({filteredAndSortedTasks.length})
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inactive tasks preserved for long-term reference and audit trails
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center gap-3 text-xs text-indigo-700 dark:text-indigo-300">
        <Info className="w-4 h-4 shrink-0 text-indigo-500" />
        <span>To restore an archived task back to your active agenda, click the restore/archive button on any card below.</span>
      </div>

      <FilterBar />

      <TaskList
        onEditTask={onEditTask}
        onNewTask={onOpenNewTask}
        emptyTitle="Archive is empty"
        emptyDesc="You don't have any archived tasks. Use the archive button on any task card to move items here."
      />
    </div>
  );
};
