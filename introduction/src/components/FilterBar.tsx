import React from 'react';
import { useTasks } from '../hooks/useTasks';
import { FilterType, SortType, PriorityLevel } from '../types';
import { PRIORITY_CONFIG } from '../utils/constants';
import { 
  CheckCircle2, 
  Clock, 
  Star, 
  Archive, 
  Calendar, 
  AlertCircle, 
  Layers, 
  ArrowUpDown, 
  Filter, 
  X,
  Tag
} from 'lucide-react';

export const FilterBar: React.FC = () => {
  const {
    activeFilter,
    setActiveFilter,
    activeSort,
    setActiveSort,
    selectedCategory,
    setSelectedCategory,
    selectedPriority,
    setSelectedPriority,
    selectedTag,
    setSelectedTag,
    categories,
    tasks
  } = useTasks();

  const filterChips: { id: FilterType; label: string; icon: React.ElementType }[] = [
    { id: 'all', label: 'All Tasks', icon: Layers },
    { id: 'today', label: 'Today', icon: Calendar },
    { id: 'this-week', label: 'This Week', icon: Clock },
    { id: 'high-priority', label: 'High Priority', icon: AlertCircle },
    { id: 'overdue', label: 'Overdue', icon: Clock },
    { id: 'completed', label: 'Completed', icon: CheckCircle2 },
    { id: 'pending', label: 'Pending', icon: Clock },
    { id: 'favorite', label: 'Favourites', icon: Star },
    { id: 'archived', label: 'Archived', icon: Archive }
  ];

  const sortOptions: { id: SortType; label: string }[] = [
    { id: 'newest', label: 'Newest First' },
    { id: 'oldest', label: 'Oldest First' },
    { id: 'due-date', label: 'Due Date (Soonest)' },
    { id: 'priority', label: 'Priority (Urgent First)' },
    { id: 'alphabetical', label: 'Alphabetical (A-Z)' },
    { id: 'completed-first', label: 'Completed First' },
    { id: 'pending-first', label: 'Pending First' },
    { id: 'custom-order', label: 'Custom Drag & Drop' }
  ];

  // Collect all unique tags from tasks
  const allTags = Array.from(new Set(tasks.flatMap(t => t.tags))).sort();

  const hasActiveSubFilters = selectedCategory !== null || selectedPriority !== null || selectedTag !== null;

  return (
    <div className="space-y-3 pb-2">
      {/* Primary filter chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {filterChips.map((chip) => {
          const Icon = chip.icon;
          const isActive = activeFilter === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-none font-bold'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* Secondary filters and sorting controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800/60">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter by:</span>
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory || 'all'}
            onChange={(e) => setSelectedCategory(e.target.value === 'all' ? null : e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium border border-transparent focus:border-indigo-500/50 focus:outline-none transition-all cursor-pointer"
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Priority Dropdown */}
          <select
            value={selectedPriority || 'all'}
            onChange={(e) => setSelectedPriority(e.target.value === 'all' ? null : e.target.value as PriorityLevel)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium border border-transparent focus:border-indigo-500/50 focus:outline-none transition-all cursor-pointer"
            aria-label="Filter by priority"
          >
            <option value="all">All Priorities</option>
            {(Object.keys(PRIORITY_CONFIG) as PriorityLevel[]).map((prio) => (
              <option key={prio} value={prio}>
                {PRIORITY_CONFIG[prio].label}
              </option>
            ))}
          </select>

          {/* Tags Dropdown */}
          {allTags.length > 0 && (
            <select
              value={selectedTag || 'all'}
              onChange={(e) => setSelectedTag(e.target.value === 'all' ? null : e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium border border-transparent focus:border-indigo-500/50 focus:outline-none transition-all cursor-pointer"
              aria-label="Filter by tag"
            >
              <option value="all">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          )}

          {/* Clear Subfilters button */}
          {hasActiveSubFilters && (
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedPriority(null);
                setSelectedTag(null);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-medium hover:bg-rose-100 transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sort:</span>
          </div>
          <select
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value as SortType)}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold text-xs border border-indigo-200/50 dark:border-indigo-800/50 focus:outline-none cursor-pointer"
            aria-label="Sort tasks"
          >
            {sortOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
