import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { ViewPage } from '../types';
import * as Icons from 'lucide-react';
import { 
  LayoutDashboard, 
  Layers, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Archive, 
  Settings as SettingsIcon, 
  Plus, 
  X, 
  Tag, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
  onOpenNewTask: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onCloseMobile,
  onOpenNewTask
}) => {
  const { 
    currentView, 
    setCurrentView, 
    tasks, 
    categories, 
    addCategory, 
    deleteCategory,
    stats 
  } = useTasks();

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [catName, setCatName] = useState('');
  const [catColor, setCatColor] = useState('#6366f1');

  const navItems: { id: ViewPage; label: string; icon: React.ElementType; count?: number; color?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'all-tasks', label: 'All Tasks', icon: Layers, count: tasks.filter(t => !t.archived).length },
    { id: 'today', label: 'Today', icon: Calendar, count: tasks.filter(t => !t.archived && t.dueDate === new Date().toISOString().split('T')[0]).length, color: 'text-emerald-500' },
    { id: 'upcoming', label: 'Upcoming', icon: Clock, count: tasks.filter(t => !t.archived && t.dueDate && new Date(t.dueDate) > new Date()).length, color: 'text-blue-500' },
    { id: 'important', label: 'Important', icon: AlertCircle, count: tasks.filter(t => !t.archived && !t.completed && (t.priority === 'high' || t.priority === 'urgent')).length, color: 'text-orange-500' },
    { id: 'completed', label: 'Completed', icon: CheckCircle2, count: tasks.filter(t => t.completed && !t.archived).length, color: 'text-emerald-500' },
    { id: 'archived', label: 'Archived', icon: Archive, count: tasks.filter(t => t.archived).length, color: 'text-slate-400' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  const handleSelectView = (view: ViewPage) => {
    setCurrentView(view);
    onCloseMobile();
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    addCategory(catName.trim(), catColor, 'Tag');
    setCatName('');
    setIsAddingCategory(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Branding Section */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200/80 dark:border-slate-800 shrink-0">
          <div
            onClick={() => handleSelectView('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-all">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-xl tracking-tight text-slate-800 dark:text-white leading-none">
                TaskFlow
              </h2>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Add Task Button (Mobile/Tablet friendly) */}
        <div className="p-4 shrink-0">
          <button
            onClick={() => {
              onOpenNewTask();
              onCloseMobile();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-200 dark:shadow-none transition-all active:scale-98 flex items-center justify-center gap-2 group"
          >
            <Plus className="w-4 h-4 stroke-[2.5] transition-transform group-hover:rotate-90" />
            <span>Create New Task</span>
          </button>
        </div>

        {/* Scrollable Nav Items */}
        <div className="flex-1 overflow-y-auto px-4 py-1 space-y-6 no-scrollbar">
          {/* Primary Navigation */}
          <div className="space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Overview
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-200 group ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 font-medium'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded-full transition-colors ${
                        isActive
                          ? 'bg-indigo-100 dark:bg-indigo-500/30 text-indigo-700 dark:text-indigo-300'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-slate-300 dark:group-hover:bg-slate-700'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Categories Section */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Categories
              </span>
              <button
                onClick={() => setIsAddingCategory(!isAddingCategory)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Inline Add Category form */}
            {isAddingCategory && (
              <form onSubmit={handleCreateCategory} className="p-3 mb-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2.5 animate-in fade-in duration-150">
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="Category Name"
                  className="w-full px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="color"
                    value={catColor}
                    onChange={(e) => setCatColor(e.target.value)}
                    className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsAddingCategory(false)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!catName.trim()}
                      className="px-3 py-1 text-[11px] font-bold rounded-lg bg-indigo-600 text-white disabled:opacity-50"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Category list items */}
            <div className="space-y-1">
              {categories.map((cat) => {
                const viewKey: ViewPage = `category-${cat.id}`;
                const isActive = currentView === viewKey;
                const catTaskCount = tasks.filter(t => !t.archived && (t.category.toLowerCase() === cat.id.toLowerCase() || t.category.toLowerCase() === cat.name.toLowerCase())).length;
                const IconComp = (Icons as Record<string, React.ElementType>)[cat.icon] || Tag;

                return (
                  <div key={cat.id} className="group relative flex items-center">
                    <button
                      onClick={() => handleSelectView(viewKey)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 font-medium'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-indigo-600 dark:hover:text-indigo-400'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                        <span className="truncate max-w-[130px]">{cat.name}</span>
                      </div>

                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {catTaskCount}
                      </span>
                    </button>

                    {cat.isCustom && (
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="absolute right-10 p-1 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete custom category"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Progress Summary Card matching Professional Polish Storage widget */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-slate-900">
          <div className="p-4 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
              <span>Workspace Agenda</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">{stats.completionRate}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mb-2 overflow-hidden">
              <div
                className="bg-indigo-600 dark:bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>{stats.completed} of {stats.total} tasks done</span>
              <span>Pro Account</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
