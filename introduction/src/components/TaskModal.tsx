import React, { useState, useEffect, useRef } from 'react';
import { Task, PriorityLevel, RecurringInterval, Subtask } from '../types';
import { useTasks } from '../hooks/useTasks';
import { PRIORITY_CONFIG } from '../utils/constants';
import { generateId } from '../utils/helpers';
import { 
  X, 
  Plus, 
  Calendar, 
  Tag, 
  Layers, 
  AlertCircle, 
  Repeat, 
  ListChecks, 
  FileText, 
  Star, 
  Pin, 
  Check, 
  Trash2,
  Sliders
} from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit
}) => {
  const { addTask, updateTask, categories, addCategory } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('work');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [dueDate, setDueDate] = useState<string>('');
  const [recurring, setRecurring] = useState<RecurringInterval>('none');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [subtaskInput, setSubtaskInput] = useState('');
  const [notes, setNotes] = useState('');
  const [progress, setProgress] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [pinned, setPinned] = useState(false);

  // New category creation inline toggle
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#6366f1');

  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setCategory(taskToEdit.category || 'work');
      setPriority(taskToEdit.priority || 'medium');
      setDueDate(taskToEdit.dueDate || '');
      setRecurring(taskToEdit.recurring || 'none');
      setTags(taskToEdit.tags || []);
      setSubtasks(taskToEdit.subtasks || []);
      setNotes(taskToEdit.notes || '');
      setProgress(taskToEdit.progress || 0);
      setFavorite(taskToEdit.favorite || false);
      setPinned(taskToEdit.pinned || false);
    } else {
      // Reset defaults for new task
      setTitle('');
      setDescription('');
      setCategory(categories[0]?.id || 'work');
      setPriority('medium');
      setDueDate(new Date().toISOString().split('T')[0]);
      setRecurring('none');
      setTags(['#task']);
      setSubtasks([]);
      setNotes('');
      setProgress(0);
      setFavorite(false);
      setPinned(false);
    }
  }, [taskToEdit, isOpen, categories]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => titleInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddTag = (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    const cleanTag = tagInput.trim();
    if (!cleanTag) return;
    const formattedTag = cleanTag.startsWith('#') ? cleanTag : `#${cleanTag}`;
    if (!tags.includes(formattedTag)) {
      setTags([...tags, formattedTag]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleAddSubtask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanTitle = subtaskInput.trim();
    if (!cleanTitle) return;
    const newSub: Subtask = {
      id: generateId('sub'),
      title: cleanTitle,
      completed: false
    };
    const updatedSubtasks = [...subtasks, newSub];
    setSubtasks(updatedSubtasks);
    setSubtaskInput('');
    
    // Adjust progress
    const completedCount = updatedSubtasks.filter(s => s.completed).length;
    setProgress(Math.round((completedCount / updatedSubtasks.length) * 100));
  };

  const handleToggleSubtask = (id: string) => {
    const updated = subtasks.map(s => s.id === id ? { ...s, completed: !s.completed } : s);
    setSubtasks(updated);
    const completedCount = updated.filter(s => s.completed).length;
    setProgress(updated.length > 0 ? Math.round((completedCount / updated.length) * 100) : progress);
  };

  const handleRemoveSubtask = (id: string) => {
    const updated = subtasks.filter(s => s.id !== id);
    setSubtasks(updated);
    if (updated.length > 0) {
      const completedCount = updated.filter(s => s.completed).length;
      setProgress(Math.round((completedCount / updated.length) * 100));
    }
  };

  const handleCreateInlineCategory = () => {
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim(), newCatColor, 'Tag');
    const newId = newCatName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-');
    setCategory(newId);
    setNewCatName('');
    setIsCreatingCategory(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskPayload = {
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      dueDate: dueDate || null,
      recurring,
      tags,
      subtasks,
      notes: notes.trim(),
      progress: subtasks.length > 0 ? Math.round((subtasks.filter(s => s.completed).length / subtasks.length) * 100) : progress,
      favorite,
      pinned
    };

    if (taskToEdit) {
      updateTask(taskToEdit.id, taskPayload);
    } else {
      addTask(taskPayload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <ListChecks className="w-5 h-5" />
            </span>
            <div>
              <h3 id="modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
                {taskToEdit ? 'Edit Task' : 'Create New Task'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {taskToEdit ? 'Modify task details and milestones' : 'Add a new priority to your workspace agenda'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFavorite(!favorite)}
              className={`p-2 rounded-xl border transition-all ${
                favorite
                  ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-700 text-amber-500'
                  : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-500'
              }`}
              title="Toggle Favorite"
            >
              <Star className={`w-4 h-4 ${favorite ? 'fill-amber-500' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => setPinned(!pinned)}
              className={`p-2 rounded-xl border transition-all ${
                pinned
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-600'
              }`}
              title="Toggle Pin"
            >
              <Pin className={`w-4 h-4 ${pinned ? 'fill-indigo-600 dark:fill-indigo-400' : ''}`} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 no-scrollbar">
          {/* Title and Description */}
          <div className="space-y-4">
            <div>
              <label htmlFor="task-title" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Task Title *
              </label>
              <input
                id="task-title"
                ref={titleInputRef}
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Launch website redesign beta for Q3"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 text-base font-semibold border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xs"
              />
            </div>

            <div>
              <label htmlFor="task-desc" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                id="task-desc"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add contextual details, links, or instructions..."
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 placeholder-slate-400 text-sm border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none shadow-xs"
              />
            </div>
          </div>

          {/* Grid for Category & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            {/* Category selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Category</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsCreatingCategory(!isCreatingCategory)}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {isCreatingCategory ? 'Cancel' : '+ New Category'}
                </button>
              </div>

              {isCreatingCategory ? (
                <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 space-y-2.5">
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Category name"
                    className="w-full px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="color"
                      value={newCatColor}
                      onChange={(e) => setNewCatColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleCreateInlineCategory}
                      disabled={!newCatName.trim()}
                      className="px-3 py-1 text-xs font-semibold rounded-xl bg-indigo-600 text-white disabled:opacity-50"
                    >
                      Save Category
                    </button>
                  </div>
                </div>
              ) : (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-sm font-medium border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:outline-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Priority level pills */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-orange-500" />
                <span>Priority Level</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                {(Object.keys(PRIORITY_CONFIG) as PriorityLevel[]).map((prio) => {
                  const isSelected = priority === prio;
                  const cfg = PRIORITY_CONFIG[prio];
                  return (
                    <button
                      key={prio}
                      type="button"
                      onClick={() => setPriority(prio)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? `${cfg.bgColor} ${cfg.textColor} shadow-xs scale-102 border ${cfg.borderColor}`
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Grid for Due Date & Recurring */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="space-y-2">
              <label htmlFor="due-date-input" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                <span>Due Date</span>
              </label>
              <input
                id="due-date-input"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-sm font-medium border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:outline-none cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5 text-purple-500" />
                <span>Recurring Schedule</span>
              </label>
              <select
                value={recurring}
                onChange={(e) => setRecurring(e.target.value as RecurringInterval)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-sm font-medium border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:outline-none cursor-pointer capitalize"
              >
                <option value="none">None (One-time task)</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          {/* Tags Section */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-rose-500" />
              <span>Tags & Labels</span>
            </label>
            <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 min-h-[46px]">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200/50 dark:border-indigo-800/50"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <div className="flex items-center gap-1 flex-1 min-w-[140px]">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Type tag (#urgent) and press Enter"
                  className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddTag()}
                  className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Subtasks Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ListChecks className="w-3.5 h-3.5 text-blue-500" />
                <span>Subtasks & Checklists ({subtasks.filter(s => s.completed).length}/{subtasks.length})</span>
              </label>
              {subtasks.length > 0 && (
                <span className="text-xs font-semibold text-slate-400">
                  {Math.round((subtasks.filter(s => s.completed).length / subtasks.length) * 100)}% Complete
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder="Add milestone subtask..."
                className="flex-1 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 placeholder-slate-400 text-xs sm:text-sm border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleAddSubtask()}
                disabled={!subtaskInput.trim()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all disabled:opacity-50 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add</span>
              </button>
            </div>

            {subtasks.length > 0 && (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {subtasks.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 group"
                  >
                    <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={() => handleToggleSubtask(st.id)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span className={`text-xs sm:text-sm truncate ${st.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300 font-medium'}`}>
                        {st.title}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(st.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Manual Progress Slider if no subtasks */}
            {subtasks.length === 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5" />
                    Manual Task Progress
                  </span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{progress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <label htmlFor="task-notes" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              <span>Task Notes & Markdown Comments</span>
            </label>
            <textarea
              id="task-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add comprehensive markdown notes, meeting bullet points, or reference checklists..."
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 placeholder-slate-400 text-xs sm:text-sm font-mono border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none shadow-xs"
            />
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors active:scale-95"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all active:scale-95 flex items-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{taskToEdit ? 'Save Changes' : 'Create Task'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
