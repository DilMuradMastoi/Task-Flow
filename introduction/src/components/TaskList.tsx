import React, { useState } from 'react';
import { Task } from '../types';
import { useTasks } from '../hooks/useTasks';
import { TaskCard } from './TaskCard';
import { EmptyState } from './EmptyState';
import { CheckSquare, Trash2, CheckCircle2, X, ListFilter } from 'lucide-react';

interface TaskListProps {
  tasks?: Task[];
  onEditTask: (task: Task) => void;
  onNewTask: () => void;
  emptyTitle?: string;
  emptyDesc?: string;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks: propTasks,
  onEditTask,
  onNewTask,
  emptyTitle,
  emptyDesc
}) => {
  const {
    filteredAndSortedTasks,
    selectedTaskIds,
    selectAllTasks,
    clearSelection,
    bulkComplete,
    bulkDelete,
    clearCompleted,
    reorderTasks,
    activeFilter
  } = useTasks();

  const displayTasks = propTasks || filteredAndSortedTasks;

  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIdx(index);
  };

  const handleDragOver = (index: number) => {
    if (draggedIdx !== null && draggedIdx !== index) {
      setDragOverIdx(index);
    }
  };

  const handleDrop = (index: number) => {
    if (draggedIdx !== null && draggedIdx !== index) {
      reorderTasks(draggedIdx, index);
    }
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  if (displayTasks.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || 'No tasks match your criteria'}
        description={emptyDesc || 'Try adjusting your filters, search terms, or create a brand new task to get started.'}
        onAction={onNewTask}
      />
    );
  }

  const hasSelected = selectedTaskIds.length > 0;
  const isAllSelected = selectedTaskIds.length === displayTasks.length && displayTasks.length > 0;
  const completedCount = displayTasks.filter(t => t.completed).length;

  return (
    <div className="space-y-4">
      {/* Bulk Action Toolbar */}
      {hasSelected && (
        <div className="sticky top-20 z-30 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-indigo-900/90 dark:bg-slate-800/95 text-white backdrop-blur-md shadow-xl border border-indigo-500/30 animate-in slide-in-from-top-3 duration-200">
          <div className="flex items-center gap-3">
            <button
              onClick={selectAllTasks}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors"
            >
              <CheckSquare className="w-4 h-4" />
              <span>{isAllSelected ? 'Deselect All' : 'Select All'}</span>
            </button>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500">
              {selectedTaskIds.length} selected
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={bulkComplete}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold shadow-md transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Selected</span>
            </button>

            <button
              onClick={bulkDelete}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold shadow-md transition-all active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Selected</span>
            </button>

            <button
              onClick={clearSelection}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Optional action bar when viewing completed items */}
      {activeFilter === 'completed' && completedCount > 0 && !hasSelected && (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 text-xs font-medium">
          <span className="flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-slate-400" />
            Showing {completedCount} completed tasks
          </span>
          <button
            onClick={clearCompleted}
            className="text-rose-600 dark:text-rose-400 font-semibold hover:underline"
          >
            Clear All Completed
          </button>
        </div>
      )}

      {/* Task Cards Grid/List */}
      <div className="space-y-3.5">
        {displayTasks.map((task, idx) => (
          <div
            key={task.id}
            className={`transition-transform duration-200 ${
              dragOverIdx === idx ? 'translate-y-1' : ''
            }`}
          >
            <TaskCard
              task={task}
              index={idx}
              onEdit={onEditTask}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
