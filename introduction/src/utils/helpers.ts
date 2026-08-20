import { Task, FilterType, SortType, PriorityLevel, CategoryItem } from '../types';
import confetti from 'canvas-confetti';

export const generateId = (prefix = 'id'): string => {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
};

export const getGreeting = (): { title: string; subtitle: string } => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return {
      title: 'Good Morning',
      subtitle: 'Here is your agenda for a productive day ahead.'
    };
  } else if (hour < 18) {
    return {
      title: 'Good Afternoon',
      subtitle: 'Keep up the momentum and clear your priorities.'
    };
  } else {
    return {
      title: 'Good Evening',
      subtitle: 'Time to wrap up your tasks and prepare for tomorrow.'
    };
  }
};

export const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'No due date';
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  if (isToday) return 'Today';
  if (isTomorrow) return 'Tomorrow';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  });
};

export const isOverdue = (dateString: string | null, completed: boolean): boolean => {
  if (!dateString || completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateString);
  due.setHours(0, 0, 0, 0);
  return due < today;
};

export const isDueToday = (dateString: string | null): boolean => {
  if (!dateString) return false;
  const today = new Date();
  const due = new Date(dateString);
  return due.toDateString() === today.toDateString();
};

export const isDueThisWeek = (dateString: string | null): boolean => {
  if (!dateString) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const due = new Date(dateString);
  return due >= today && due <= nextWeek;
};

export const triggerConfetti = () => {
  try {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#3b82f6']
    });
  } catch (e) {
    console.error('Confetti failed', e);
  }
};

export const calculateTaskProgress = (task: Task): number => {
  if (task.completed) return 100;
  if (!task.subtasks || task.subtasks.length === 0) return task.progress || 0;
  const completedCount = task.subtasks.filter(s => s.completed).length;
  return Math.round((completedCount / task.subtasks.length) * 100);
};

export const filterTasks = (
  tasks: Task[],
  filter: FilterType,
  searchQuery: string,
  selectedCategory: string | null,
  selectedPriority: PriorityLevel | null,
  selectedTag: string | null
): Task[] => {
  return tasks.filter(task => {
    // Search matching (title, description, category, tag, priority)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description.toLowerCase().includes(q);
      const matchCat = task.category.toLowerCase().includes(q);
      const matchPriority = task.priority.toLowerCase().includes(q);
      const matchTags = task.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchCat && !matchPriority && !matchTags) {
        return false;
      }
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'all' && task.category !== selectedCategory) {
      return false;
    }

    // Priority filter
    if (selectedPriority && task.priority !== selectedPriority) {
      return false;
    }

    // Tag filter
    if (selectedTag && !task.tags.includes(selectedTag)) {
      return false;
    }

    // Main view filter
    switch (filter) {
      case 'completed':
        return task.completed && !task.archived;
      case 'pending':
        return !task.completed && !task.archived;
      case 'favorite':
        return task.favorite && !task.archived;
      case 'archived':
        return task.archived;
      case 'today':
        return !task.archived && (isDueToday(task.dueDate) || (task.pinned && !task.completed));
      case 'this-week':
        return !task.archived && isDueThisWeek(task.dueDate);
      case 'overdue':
        return !task.archived && isOverdue(task.dueDate, task.completed);
      case 'high-priority':
        return !task.archived && !task.completed && (task.priority === 'high' || task.priority === 'urgent');
      case 'all':
      default:
        return !task.archived;
    }
  });
};

export const sortTasks = (tasks: Task[], sort: SortType): Task[] => {
  const priorityWeights: Record<PriorityLevel, number> = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1
  };

  return [...tasks].sort((a, b) => {
    // Pinned always stay on top unless sorting by completed/archived explicitly
    if (a.pinned && !b.pinned && !a.completed) return -1;
    if (!a.pinned && b.pinned && !b.completed) return 1;

    switch (sort) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'priority':
        return priorityWeights[b.priority] - priorityWeights[a.priority];
      case 'due-date':
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'completed-first':
        return (b.completed ? 1 : 0) - (a.completed ? 1 : 0);
      case 'pending-first':
        return (a.completed ? 1 : 0) - (b.completed ? 1 : 0);
      case 'custom-order':
      default:
        return a.order - b.order;
    }
  });
};

export const getCategoryDetails = (catId: string, categories: CategoryItem[]): { name: string; color: string; icon: string } => {
  const found = categories.find(c => c.id === catId || c.name.toLowerCase() === catId.toLowerCase());
  if (found) {
    return { name: found.name, color: found.color, icon: found.icon };
  }
  // Fallback for custom or unknown category
  return { name: catId.charAt(0).toUpperCase() + catId.slice(1), color: '#a855f7', icon: 'Tag' };
};
