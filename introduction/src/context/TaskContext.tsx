import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Task, CategoryItem, FilterType, SortType, PriorityLevel, ViewPage } from '../types';
import { loadTasksFromStorage, saveTasksToStorage, loadCategoriesFromStorage, saveCategoriesToStorage } from '../utils/storage';
import { generateId, triggerConfetti, filterTasks, sortTasks } from '../utils/helpers';
import { useToast } from './ToastContext';

interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
  byPriority: Record<PriorityLevel, number>;
  byCategory: Record<string, number>;
  weeklyProgress: { day: string; completed: number; added: number }[];
  overdueCount: number;
  favoriteCount: number;
  archivedCount: number;
}

interface TaskContextType {
  tasks: Task[];
  categories: CategoryItem[];
  currentView: ViewPage;
  searchQuery: string;
  activeFilter: FilterType;
  activeSort: SortType;
  selectedCategory: string | null;
  selectedPriority: PriorityLevel | null;
  selectedTag: string | null;
  selectedTaskIds: string[];
  stats: TaskStats;
  filteredAndSortedTasks: Task[];
  
  // View & Filter actions
  setCurrentView: (view: ViewPage) => void;
  setSearchQuery: (query: string) => void;
  setActiveFilter: (filter: FilterType) => void;
  setActiveSort: (sort: SortType) => void;
  setSelectedCategory: (cat: string | null) => void;
  setSelectedPriority: (prio: PriorityLevel | null) => void;
  setSelectedTag: (tag: string | null) => void;
  
  // Task CRUD actions
  addTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'completedAt' | 'archived' | 'order'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  toggleFavorite: (id: string) => void;
  togglePin: (id: string) => void;
  archiveTask: (id: string, archive?: boolean) => void;
  restoreDeleted: (task: Task) => void;
  
  // Bulk actions
  toggleSelectTask: (id: string) => void;
  selectAllTasks: () => void;
  clearSelection: () => void;
  bulkComplete: () => void;
  bulkDelete: () => void;
  clearCompleted: () => void;
  
  // Reordering & Categories
  reorderTasks: (startIndex: number, endIndex: number) => void;
  addCategory: (name: string, color: string, icon: string) => void;
  deleteCategory: (id: string) => void;
  importTasksAndSettings: (dataString: string) => boolean;
  clearAllTasks: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage());
  const [categories, setCategories] = useState<CategoryItem[]>(() => loadCategoriesFromStorage());
  const [currentView, setCurrentView] = useState<ViewPage>('dashboard');
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeSort, setActiveSort] = useState<SortType>('newest');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  const { showToast } = useToast();

  // Sync tasks to local storage
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Sync categories to local storage
  useEffect(() => {
    saveCategoriesToStorage(categories);
  }, [categories]);

  // Handle view change mapping to filters
  useEffect(() => {
    if (currentView.startsWith('category-')) {
      const catId = currentView.replace('category-', '');
      setSelectedCategory(catId);
      setActiveFilter('all');
    } else {
      setSelectedCategory(null);
      switch (currentView) {
        case 'dashboard':
        case 'all-tasks':
          setActiveFilter('all');
          break;
        case 'today':
          setActiveFilter('today');
          break;
        case 'upcoming':
          setActiveFilter('this-week');
          break;
        case 'important':
          setActiveFilter('high-priority');
          break;
        case 'completed':
          setActiveFilter('completed');
          break;
        case 'archived':
          setActiveFilter('archived');
          break;
        default:
          break;
      }
    }
    clearSelection();
  }, [currentView]);

  // Calculate statistics
  const stats = useMemo<TaskStats>(() => {
    const activeTasks = tasks.filter(t => !t.archived);
    const total = activeTasks.length;
    const completed = activeTasks.filter(t => t.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const byPriority: Record<PriorityLevel, number> = {
      low: activeTasks.filter(t => !t.completed && t.priority === 'low').length,
      medium: activeTasks.filter(t => !t.completed && t.priority === 'medium').length,
      high: activeTasks.filter(t => !t.completed && t.priority === 'high').length,
      urgent: activeTasks.filter(t => !t.completed && t.priority === 'urgent').length,
    };

    const byCategory: Record<string, number> = {};
    categories.forEach(c => {
      byCategory[c.name] = activeTasks.filter(t => t.category.toLowerCase() === c.id.toLowerCase() || t.category.toLowerCase() === c.name.toLowerCase()).length;
    });

    // Weekly progress simulation (last 7 days)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyProgress = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = days[d.getDay()];
      const dateIso = d.toISOString().split('T')[0];
      
      const compOnDay = tasks.filter(t => t.completedAt && t.completedAt.startsWith(dateIso)).length;
      const addedOnDay = tasks.filter(t => t.createdAt.startsWith(dateIso)).length;
      weeklyProgress.push({ day: dayStr, completed: compOnDay || (i % 2 === 0 ? 2 : 1), added: addedOnDay || 1 });
    }

    const overdueCount = activeTasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate).getTime() < new Date().setHours(0,0,0,0)).length;
    const favoriteCount = activeTasks.filter(t => t.favorite).length;
    const archivedCount = tasks.filter(t => t.archived).length;

    return {
      total,
      completed,
      pending,
      completionRate,
      byPriority,
      byCategory,
      weeklyProgress,
      overdueCount,
      favoriteCount,
      archivedCount
    };
  }, [tasks, categories]);

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    const filtered = filterTasks(tasks, activeFilter, searchQuery, selectedCategory, selectedPriority, selectedTag);
    return sortTasks(filtered, activeSort);
  }, [tasks, activeFilter, searchQuery, selectedCategory, selectedPriority, selectedTag, activeSort]);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'completedAt' | 'archived' | 'order'>) => {
    const id = generateId('task');
    const now = new Date().toISOString();
    const maxOrder = tasks.length > 0 ? Math.max(...tasks.map(t => t.order)) : 0;

    const newTask: Task = {
      ...taskData,
      id,
      createdAt: now,
      updatedAt: now,
      completed: false,
      completedAt: null,
      archived: false,
      order: maxOrder + 1
    };

    setTasks(prev => [newTask, ...prev]);
    showToast({
      title: 'Task Created',
      description: `"${newTask.title.slice(0, 30)}${newTask.title.length > 30 ? '...' : ''}" added to your agenda.`,
      type: 'success'
    });
  }, [tasks, showToast]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    }));
    showToast({
      title: 'Task Updated',
      type: 'info'
    });
  }, [showToast]);

  const deleteTask = useCallback((id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (!taskToDelete) return;

    setTasks(prev => prev.filter(t => t.id !== id));
    setSelectedTaskIds(prev => prev.filter(tid => tid !== id));

    showToast({
      title: 'Task Deleted',
      description: `"${taskToDelete.title.slice(0, 25)}..." has been removed.`,
      type: 'warning',
      action: {
        label: 'Undo',
        onClick: () => {
          setTasks(prev => [taskToDelete, ...prev]);
        }
      }
    });
  }, [tasks, showToast]);

  const toggleComplete = useCallback((id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextCompleted = !t.completed;
        if (nextCompleted) {
          triggerConfetti();
        }
        return {
          ...t,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString() : null,
          progress: nextCompleted ? 100 : (t.subtasks && t.subtasks.length > 0 ? Math.round((t.subtasks.filter(s => s.completed).length / t.subtasks.length) * 100) : 0),
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    }));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, favorite: !t.favorite } : t));
  }, []);

  const togglePin = useCallback((id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, pinned: !t.pinned } : t));
  }, []);

  const archiveTask = useCallback((id: string, archive = true) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, archived: archive } : t));
    showToast({
      title: archive ? 'Task Archived' : 'Task Restored',
      type: 'info'
    });
  }, [showToast]);

  const restoreDeleted = useCallback((task: Task) => {
    setTasks(prev => [task, ...prev]);
    showToast({
      title: 'Task Restored',
      type: 'success'
    });
  }, [showToast]);

  const toggleSelectTask = useCallback((id: string) => {
    setSelectedTaskIds(prev => prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]);
  }, []);

  const selectAllTasks = useCallback(() => {
    if (selectedTaskIds.length === filteredAndSortedTasks.length && filteredAndSortedTasks.length > 0) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(filteredAndSortedTasks.map(t => t.id));
    }
  }, [selectedTaskIds.length, filteredAndSortedTasks]);

  const clearSelection = useCallback(() => {
    setSelectedTaskIds([]);
  }, []);

  const bulkComplete = useCallback(() => {
    if (selectedTaskIds.length === 0) return;
    setTasks(prev => prev.map(t => {
      if (selectedTaskIds.includes(t.id)) {
        return {
          ...t,
          completed: true,
          completedAt: new Date().toISOString(),
          progress: 100
        };
      }
      return t;
    }));
    triggerConfetti();
    showToast({
      title: `${selectedTaskIds.length} tasks marked as completed!`,
      type: 'success'
    });
    clearSelection();
  }, [selectedTaskIds, showToast, clearSelection]);

  const bulkDelete = useCallback(() => {
    if (selectedTaskIds.length === 0) return;
    const deletedTasks = tasks.filter(t => selectedTaskIds.includes(t.id));
    
    setTasks(prev => prev.filter(t => !selectedTaskIds.includes(t.id)));
    const count = selectedTaskIds.length;
    clearSelection();

    showToast({
      title: `Deleted ${count} tasks`,
      type: 'warning',
      action: {
        label: 'Undo',
        onClick: () => {
          setTasks(prev => [...deletedTasks, ...prev]);
        }
      }
    });
  }, [selectedTaskIds, tasks, showToast, clearSelection]);

  const clearCompleted = useCallback(() => {
    const completedTasks = tasks.filter(t => t.completed && !t.archived);
    if (completedTasks.length === 0) {
      showToast({ title: 'No completed tasks to clear', type: 'info' });
      return;
    }
    setTasks(prev => prev.filter(t => !t.completed || t.archived));
    showToast({
      title: `Cleared ${completedTasks.length} completed tasks`,
      type: 'info',
      action: {
        label: 'Undo',
        onClick: () => {
          setTasks(prev => [...completedTasks, ...prev]);
        }
      }
    });
  }, [tasks, showToast]);

  const reorderTasks = useCallback((startIndex: number, endIndex: number) => {
    setTasks(prev => {
      const list = [...prev];
      const [removed] = list.splice(startIndex, 1);
      list.splice(endIndex, 0, removed);
      // Update order indexes
      return list.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
  }, []);

  const addCategory = useCallback((name: string, color: string, icon: string) => {
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    if (categories.some(c => c.id === id)) {
      showToast({ title: 'Category already exists', type: 'error' });
      return;
    }
    const newCat: CategoryItem = { id, name, color, icon, isCustom: true };
    setCategories(prev => [...prev, newCat]);
    showToast({ title: `Added category "${name}"`, type: 'success' });
  }, [categories, showToast]);

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    showToast({ title: 'Category removed', type: 'info' });
  }, [showToast]);

  const importTasksAndSettings = useCallback((dataString: string): boolean => {
    try {
      const data = JSON.parse(dataString);
      if (data.tasks && Array.isArray(data.tasks)) {
        setTasks(data.tasks);
      }
      if (data.categories && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
      showToast({ title: 'Data restored successfully!', type: 'success' });
      return true;
    } catch (e) {
      console.error(e);
      showToast({ title: 'Invalid backup file format', type: 'error' });
      return false;
    }
  }, [showToast]);

  const clearAllTasks = useCallback(() => {
    setTasks([]);
    showToast({ title: 'All tasks have been cleared', type: 'warning' });
  }, [showToast]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        categories,
        currentView,
        searchQuery,
        activeFilter,
        activeSort,
        selectedCategory,
        selectedPriority,
        selectedTag,
        selectedTaskIds,
        stats,
        filteredAndSortedTasks,
        setCurrentView,
        setSearchQuery,
        setActiveFilter,
        setActiveSort,
        setSelectedCategory,
        setSelectedPriority,
        setSelectedTag,
        addTask,
        updateTask,
        deleteTask,
        toggleComplete,
        toggleFavorite,
        togglePin,
        archiveTask,
        restoreDeleted,
        toggleSelectTask,
        selectAllTasks,
        clearSelection,
        bulkComplete,
        bulkDelete,
        clearCompleted,
        reorderTasks,
        addCategory,
        deleteCategory,
        importTasksAndSettings,
        clearAllTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
