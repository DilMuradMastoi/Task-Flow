import React, { useRef, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import { Search, X, SlidersHorizontal } from 'lucide-react';

interface SearchBarProps {
  onToggleFilters?: () => void;
  showFilterToggle?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onToggleFilters,
  showFilterToggle = true
}) => {
  const { searchQuery, setSearchQuery } = useTasks();
  const inputRef = useRef<HTMLInputElement>(null);

  // Expose global shortcut listener helper if needed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative flex items-center w-full max-w-xl">
      <div className="absolute left-4 text-slate-400 pointer-events-none flex items-center">
        <Search className="w-4 h-4" />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search tasks, notes..."
        className="w-full pl-10 pr-24 py-2 bg-slate-100 dark:bg-slate-800/80 border border-transparent rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-300 dark:focus:border-indigo-700 outline-none transition-all shadow-2xs"
        aria-label="Search tasks"
      />

      <div className="absolute right-3 flex items-center gap-1.5">
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Clear search"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md pointer-events-none">
          Ctrl F
        </kbd>

        {showFilterToggle && onToggleFilters && (
          <button
            onClick={onToggleFilters}
            className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all ml-1"
            title="Toggle Filter Panel"
            aria-label="Toggle Filter Panel"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
