import React from 'react';
import { useTasks } from '../hooks/useTasks';
import { getCategoryDetails } from '../utils/helpers';
import { FilterBar } from '../components/FilterBar';
import { TaskList } from '../components/TaskList';
import * as Icons from 'lucide-react';
import { Tag, Plus } from 'lucide-react';

interface CategoryTasksPageProps {
  categoryId: string;
  onOpenNewTask: () => void;
  onEditTask: (task: any) => void;
}

export const CategoryTasksPage: React.FC<CategoryTasksPageProps> = ({
  categoryId,
  onOpenNewTask,
  onEditTask
}) => {
  const { categories, tasks, filteredAndSortedTasks } = useTasks();
  const { name, color, icon } = getCategoryDetails(categoryId, categories);

  const IconComp = (Icons as Record<string, React.ElementType>)[icon] || Tag;

  const totalInCategory = tasks.filter(t => !t.archived && (t.category.toLowerCase() === categoryId.toLowerCase() || t.category.toLowerCase() === name.toLowerCase())).length;

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span
              className="p-2.5 rounded-2xl shadow-sm"
              style={{ backgroundColor: `${color}20`, color: color }}
            >
              <IconComp className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {name} ({totalInCategory})
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                All active priorities categorized under {name} domain
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenNewTask}
          style={{ backgroundColor: color }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-white font-bold text-sm shadow-md transition-all hover:opacity-90 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Task</span>
        </button>
      </div>

      <FilterBar />

      <TaskList
        onEditTask={onEditTask}
        onNewTask={onOpenNewTask}
        emptyTitle={`No tasks in ${name}`}
        emptyDesc={`You don't have any tasks categorized under ${name} right now. Click New Task above to add one!`}
      />
    </div>
  );
};
