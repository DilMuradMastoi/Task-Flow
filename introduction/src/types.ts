export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export type CategoryId = 
  | 'personal' 
  | 'work' 
  | 'study' 
  | 'shopping' 
  | 'fitness' 
  | 'finance' 
  | 'health' 
  | 'custom';

export interface CategoryItem {
  id: string;
  name: string;
  color: string;
  icon: string; // Lucide icon name
  isCustom?: boolean;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export type RecurringInterval = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string; // category id or custom name
  priority: PriorityLevel;
  dueDate: string | null; // ISO string YYYY-MM-DD or full timestamp
  createdAt: string; // ISO string
  updatedAt: string;
  completed: boolean;
  completedAt: string | null;
  favorite: boolean;
  pinned: boolean;
  archived: boolean;
  recurring: RecurringInterval;
  subtasks: Subtask[];
  notes: string;
  tags: string[];
  progress: number; // 0 to 100
  order: number;
}

export type FilterType = 
  | 'all' 
  | 'completed' 
  | 'pending' 
  | 'favorite' 
  | 'archived' 
  | 'today' 
  | 'this-week' 
  | 'overdue' 
  | 'high-priority';

export type SortType = 
  | 'newest' 
  | 'oldest' 
  | 'alphabetical' 
  | 'priority' 
  | 'due-date' 
  | 'completed-first' 
  | 'pending-first'
  | 'custom-order';

export type ThemeMode = 'light' | 'dark' | 'system' | 'oled';

export type AccentColor = 'indigo' | 'emerald' | 'rose' | 'amber' | 'violet' | 'cyan' | 'blue';

export type FontSize = 'small' | 'normal' | 'large';

export interface AppSettings {
  theme: ThemeMode;
  accentColor: AccentColor;
  fontSize: FontSize;
  animationsEnabled: boolean;
  soundEnabled: boolean;
  compactMode: boolean;
  defaultPriority: PriorityLevel;
  defaultCategory: string;
  userName: string;
  userAvatar: string;
  highContrast: boolean;
}

export type ViewPage = 
  | 'dashboard' 
  | 'all-tasks' 
  | 'today' 
  | 'upcoming' 
  | 'important' 
  | 'completed' 
  | 'archived' 
  | 'settings'
  | `category-${string}`;

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}
