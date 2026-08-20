import React, { useState } from 'react';
import { Task } from '../types';
import { useTasks } from '../hooks/useTasks';
import { PriorityBadge } from './PriorityBadge';
import { CategoryBadge } from './CategoryBadge';
import { ProgressBar } from './ProgressBar';
import { formatDate, isOverdue } from '../utils/helpers';
import { 
  Check, 
  Star, 
  Pin, 
  Calendar, 
  Repeat, 
  ChevronDown, 
  ChevronUp, 
  Edit3, 
  Trash2, 
  Archive, 
  RotateCcw, 
  FileText, 
  ListChecks, 
  GripVertical
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  index: number;
  onDragStart?: (index: number) => void;
  onDragOver?: (index: number) => void;
  onDrop?: (index: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  index,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  const {
    toggleComplete,
    toggleFavorite,
    togglePin,
    deleteTask,
    archiveTask,
    updateTask,
    selectedTaskIds,
    toggleSelectTask
  } = useTasks();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const isSelected = selectedTaskIds.includes(task.id);
  const taskOverdue = isOverdue(task.dueDate, task.completed);
  const completedSubtasksCount = task.subtasks?.filter(s => s.completed).length || 0;
  const totalSubtasksCount = task.subtasks?.length || 0;

  const handleSubtaskToggle = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.map(s =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    const completedCount = updatedSubtasks.filter(s => s.completed).length;
    const newProgress = totalSubtasksCount > 0 ? Math.round((completedCount / totalSubtasksCount) * 100) : task.progress;
    
    updateTask(task.id, {
      subtasks: updatedSubtasks,
      progress: newProgress,
      completed: newProgress === 100 && totalSubtasksCount > 0 ? true : task.completed,
      completedAt: newProgress === 100 && totalSubtasksCount > 0 ? new Date().toISOString() : task.completedAt
    });
  };

  return (
    <div
      draggable
      onDragStart={() => {
        setIsDragging(true);
        onDragStart?.(index);
      }}
      onDragEnd={() => setIsDragging(false)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver?.(index);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        onDrop?.(index);
      }}
      className={`group relative rounded-2xl border transition-all duration-300 ${
        isDragging ? 'opacity-40 scale-98 border-dashed border-indigo-500' : ''
      } ${
        isSelected
          ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 shadow-sm'
          : task.completed
          ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-75 hover:opacity-100'
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Top accent bar for pinned or urgent tasks */}
      {task.pinned && !task.completed && (
        <div className="absolute top-0 left-6 right-6 h-1 bg-indigo-500 rounded-b-full shadow-xs" />
      )}

      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Drag handle & Selection checkbox */}
          <div className="flex items-center gap-2 pt-0.5 shrink-0">
            <button
              className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 p-0.5 rounded-md transition-colors focus:outline-none hidden sm:inline-flex"
              title="Drag to reorder"
              aria-label="Drag to reorder task"
            >
              <GripVertical className="w-4 h-4" />
            </button>

            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleSelectTask(task.id)}
              className="w-4 h-4 rounded-md border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              aria-label="Select task for bulk action"
            />

            {/* Task completion toggle button */}
            <button
              onClick={() => toggleComplete(task.id)}
              className={`w-6 h-6 rounded-xl flex items-center justify-center border-2 transition-all duration-300 active:scale-90 ${
                task.completed
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 bg-transparent'
              }`}
              aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
            </button>
          </div>

          {/* Main Task Content */}
          <div className="flex-1 min-w-0 space-y-2.5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h4
                  className={`text-base font-bold tracking-tight transition-all leading-snug ${
                    task.completed
                      ? 'line-through text-slate-400 dark:text-slate-500'
                      : 'text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                  }`}
                >
                  {task.title}
                </h4>

                {task.description && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>
                )}
              </div>

              {/* Action buttons (Pin, Star, Edit, Delete) */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleFavorite(task.id)}
                  className={`p-1.5 rounded-xl transition-all duration-200 ${
                    task.favorite
                      ? 'text-amber-500 bg-amber-50 dark:bg-amber-500/10'
                      : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                  }`}
                  title={task.favorite ? 'Remove from Favourites' : 'Add to Favourites'}
                  aria-label="Toggle favorite"
                >
                  <Star className={`w-4 h-4 ${task.favorite ? 'fill-amber-500' : ''}`} />
                </button>

                <button
                  onClick={() => togglePin(task.id)}
                  className={`p-1.5 rounded-xl transition-all duration-200 ${
                    task.pinned
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10'
                      : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                  }`}
                  title={task.pinned ? 'Unpin Task' : 'Pin Task to top'}
                  aria-label="Toggle pin"
                >
                  <Pin className={`w-4 h-4 ${task.pinned ? 'fill-indigo-600 dark:fill-indigo-400' : ''}`} />
                </button>

                <button
                  onClick={() => onEdit(task)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-all"
                  title="Edit Task"
                  aria-label="Edit task"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => archiveTask(task.id, !task.archived)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-purple-500 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-all"
                  title={task.archived ? 'Restore Task' : 'Archive Task'}
                  aria-label={task.archived ? 'Restore task' : 'Archive task'}
                >
                  {task.archived ? <RotateCcw className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                  title="Delete Task"
                  aria-label="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Badges and metadata row */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <CategoryBadge category={task.category} size="sm" />
              <PriorityBadge priority={task.priority} size="sm" />

              {/* Due Date */}
              {task.dueDate && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                    taskOverdue
                      ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(task.dueDate)}</span>
                  {taskOverdue && <span className="font-bold text-[10px] uppercase ml-0.5">Overdue</span>}
                </span>
              )}

              {/* Recurring Badge */}
              {task.recurring !== 'none' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                  <Repeat className="w-3 h-3" />
                  <span className="capitalize">{task.recurring}</span>
                </span>
              )}

              {/* Tags */}
              {task.tags?.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Subtasks Progress Bar & Toggle trigger */}
            {(totalSubtasksCount > 0 || (task.notes && task.notes.trim() !== '')) && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 mr-4">
                  {totalSubtasksCount > 0 && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium flex-1 max-w-xs">
                      <ListChecks className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{completedSubtasksCount}/{totalSubtasksCount}</span>
                      <ProgressBar progress={task.progress} height="h-1.5" className="flex-1" />
                    </div>
                  )}

                  {task.notes && task.notes.trim() !== '' && (
                    <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Notes</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors py-1 px-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                >
                  <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Expanded Subtasks and Notes Section */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
            {totalSubtasksCount > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ListChecks className="w-3.5 h-3.5" />
                  <span>Subtasks ({completedSubtasksCount}/{totalSubtasksCount})</span>
                </h5>
                <div className="space-y-1.5 pl-2">
                  {task.subtasks.map((st) => (
                    <label
                      key={st.id}
                      className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 cursor-pointer group/st p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={() => handleSubtaskToggle(st.id)}
                        className="w-4 h-4 rounded-md border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span className={st.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'group-hover/st:text-indigo-600 dark:group-hover/st:text-indigo-400'}>
                        {st.title}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {task.notes && task.notes.trim() !== '' && (
              <div className="space-y-1.5">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Task Notes</span>
                </h5>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap leading-relaxed border border-slate-100 dark:border-slate-800">
                  {task.notes}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
