import { CategoryItem, PriorityLevel, AppSettings, Task, AccentColor } from '../types';

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 'personal', name: 'Personal', color: '#6366f1', icon: 'User' },
  { id: 'work', name: 'Work', color: '#3b82f6', icon: 'Briefcase' },
  { id: 'study', name: 'Study', color: '#8b5cf6', icon: 'BookOpen' },
  { id: 'shopping', name: 'Shopping', color: '#ec4899', icon: 'ShoppingCart' },
  { id: 'fitness', name: 'Fitness', color: '#10b981', icon: 'Dumbbell' },
  { id: 'finance', name: 'Finance', color: '#f59e0b', icon: 'DollarSign' },
  { id: 'health', name: 'Health', color: '#14b8a6', icon: 'Heart' },
];

export const PRIORITY_CONFIG: Record<PriorityLevel, { label: string; color: string; bgColor: string; textColor: string; borderColor: string; weight: number }> = {
  low: {
    label: 'Low',
    color: '#64748b',
    bgColor: 'bg-slate-100 dark:bg-slate-800',
    textColor: 'text-slate-600 dark:text-slate-300',
    borderColor: 'border-slate-200 dark:border-slate-700',
    weight: 1
  },
  medium: {
    label: 'Medium',
    color: '#3b82f6',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-600 dark:text-blue-300',
    borderColor: 'border-blue-200 dark:border-blue-800',
    weight: 2
  },
  high: {
    label: 'High',
    color: '#f59e0b',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    textColor: 'text-amber-600 dark:text-amber-300',
    borderColor: 'border-amber-200 dark:border-amber-800',
    weight: 3
  },
  urgent: {
    label: 'Urgent',
    color: '#ef4444',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    textColor: 'text-red-600 dark:text-red-300',
    borderColor: 'border-red-200 dark:border-red-800',
    weight: 4
  }
};

export const ACCENT_COLORS: Record<AccentColor, { name: string; hex: string; bgClass: string; textClass: string; ringClass: string; borderClass: string }> = {
  indigo: { name: 'Indigo', hex: '#6366f1', bgClass: 'bg-indigo-600 hover:bg-indigo-700', textClass: 'text-indigo-600 dark:text-indigo-400', ringClass: 'focus:ring-indigo-500', borderClass: 'border-indigo-500' },
  emerald: { name: 'Emerald', hex: '#10b981', bgClass: 'bg-emerald-600 hover:bg-emerald-700', textClass: 'text-emerald-600 dark:text-emerald-400', ringClass: 'focus:ring-emerald-500', borderClass: 'border-emerald-500' },
  rose: { name: 'Rose', hex: '#f43f5e', bgClass: 'bg-rose-600 hover:bg-rose-700', textClass: 'text-rose-600 dark:text-rose-400', ringClass: 'focus:ring-rose-500', borderClass: 'border-rose-500' },
  amber: { name: 'Amber', hex: '#f59e0b', bgClass: 'bg-amber-600 hover:bg-amber-700', textClass: 'text-amber-600 dark:text-amber-400', ringClass: 'focus:ring-amber-500', borderClass: 'border-amber-500' },
  violet: { name: 'Violet', hex: '#8b5cf6', bgClass: 'bg-violet-600 hover:bg-violet-700', textClass: 'text-violet-600 dark:text-violet-400', ringClass: 'focus:ring-violet-500', borderClass: 'border-violet-500' },
  cyan: { name: 'Cyan', hex: '#06b6d4', bgClass: 'bg-cyan-600 hover:bg-cyan-700', textClass: 'text-cyan-600 dark:text-cyan-400', ringClass: 'focus:ring-cyan-500', borderClass: 'border-cyan-500' },
  blue: { name: 'Blue', hex: '#3b82f6', bgClass: 'bg-blue-600 hover:bg-blue-700', textClass: 'text-blue-600 dark:text-blue-400', ringClass: 'focus:ring-blue-500', borderClass: 'border-blue-500' },
};

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  accentColor: 'indigo',
  fontSize: 'normal',
  animationsEnabled: true,
  soundEnabled: true,
  compactMode: false,
  defaultPriority: 'medium',
  defaultCategory: 'work',
  userName: 'Alex Rivers',
  userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
  highContrast: false,
};

const getTodayString = (offsetDays = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Finalize Q3 Product Roadmap & Strategy Presentation',
    description: 'Review milestone deliverables with executive team, align on resource allocation for engineering, and prepare slides.',
    category: 'work',
    priority: 'urgent',
    dueDate: getTodayString(0),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
    completed: false,
    completedAt: null,
    favorite: true,
    pinned: true,
    archived: false,
    recurring: 'weekly',
    subtasks: [
      { id: 'sub-1', title: 'Compile feedback from beta testers', completed: true },
      { id: 'sub-2', title: 'Draft key metrics and KPI projections', completed: true },
      { id: 'sub-3', title: 'Send invite to stakeholders', completed: false }
    ],
    notes: '### Key Objectives\n- Ensure engineering capacity matches 80% feature velocity\n- Check budget constraints for AI infrastructure growth.',
    tags: ['#roadmap', '#strategy', '#executive'],
    progress: 66,
    order: 1
  },
  {
    id: 'task-2',
    title: 'Morning 5km Run & Stretching Routine',
    description: 'Hit the park trail before breakfast. Keep average pace under 5:30/km.',
    category: 'fitness',
    priority: 'medium',
    dueDate: getTodayString(0),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
    completed: true,
    completedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    favorite: true,
    pinned: false,
    archived: false,
    recurring: 'daily',
    subtasks: [
      { id: 'sub-4', title: 'Dynamic warmup stretches', completed: true },
      { id: 'sub-5', title: '5km continuous jog', completed: true },
      { id: 'sub-6', title: 'Post-run hydration and foam roll', completed: true }
    ],
    notes: 'Felt great today! New running shoes providing much better arch support.',
    tags: ['#health', '#routine', '#cardio'],
    progress: 100,
    order: 2
  },
  {
    id: 'task-3',
    title: 'Complete System Architecture Review & Refactoring',
    description: 'Optimize database indexes and reduce Redis caching latency for the notifications module.',
    category: 'work',
    priority: 'high',
    dueDate: getTodayString(1),
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date().toISOString(),
    completed: false,
    completedAt: null,
    favorite: false,
    pinned: true,
    archived: false,
    recurring: 'none',
    subtasks: [
      { id: 'sub-7', title: 'Run database query profiler', completed: true },
      { id: 'sub-8', title: 'Refactor user-session lookup queries', completed: false }
    ],
    notes: 'Reference docs: https://example.com/sys-architecture',
    tags: ['#backend', '#performance', '#dev'],
    progress: 50,
    order: 3
  },
  {
    id: 'task-4',
    title: 'Grocery Shopping for Organic Meals',
    description: 'Pick up fresh vegetables, almond milk, free-range eggs, and matcha powder.',
    category: 'shopping',
    priority: 'low',
    dueDate: getTodayString(2),
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
    completed: false,
    completedAt: null,
    favorite: false,
    pinned: false,
    archived: false,
    recurring: 'weekly',
    subtasks: [
      { id: 'sub-9', title: 'Avocados & Spinach', completed: false },
      { id: 'sub-10', title: 'Almond Milk & Greek Yogurt', completed: false },
      { id: 'sub-11', title: 'Dark Chocolate (85%)', completed: false }
    ],
    notes: 'Remember to use the reusable shopping bags in the trunk.',
    tags: ['#groceries', '#weekend'],
    progress: 0,
    order: 4
  },
  {
    id: 'task-5',
    title: 'Read 2 Chapters of "Atomic Habits"',
    description: 'Focus on building system-oriented routines rather than goal-oriented deadlines.',
    category: 'study',
    priority: 'medium',
    dueDate: getTodayString(-1), // Overdue for demonstration
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
    completed: false,
    completedAt: null,
    favorite: true,
    pinned: false,
    archived: false,
    recurring: 'daily',
    subtasks: [],
    notes: 'Highlight key takeaways in Notion.',
    tags: ['#reading', '#mindset'],
    progress: 30,
    order: 5
  },
  {
    id: 'task-6',
    title: 'Quarterly Investment Portfolio Balance & Tax Review',
    description: 'Check index fund distributions, rebalance tech asset weights, and download tax statements.',
    category: 'finance',
    priority: 'high',
    dueDate: getTodayString(3),
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date().toISOString(),
    completed: false,
    completedAt: null,
    favorite: false,
    pinned: false,
    archived: false,
    recurring: 'monthly',
    subtasks: [
      { id: 'sub-12', title: 'Export brokerage CSV', completed: false },
      { id: 'sub-13', title: 'Review expense tracker', completed: false }
    ],
    notes: '',
    tags: ['#finance', '#investing'],
    progress: 0,
    order: 6
  },
  {
    id: 'task-7',
    title: 'Schedule Annual Dental Checkup & Hygiene',
    description: 'Call Dr. Martinez clinic to book an appointment for next Friday afternoon.',
    category: 'health',
    priority: 'low',
    dueDate: getTodayString(-2),
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date().toISOString(),
    completed: true,
    completedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    favorite: false,
    pinned: false,
    archived: false,
    recurring: 'yearly',
    subtasks: [],
    notes: 'Booked for 2:30 PM next Friday.',
    tags: ['#health', '#medical'],
    progress: 100,
    order: 7
  },
  {
    id: 'task-8',
    title: 'Plan Weekend Camping Trip to Lake Tahoe',
    description: 'Reserve campsite spot, check weather forecasts, and pack camping gear.',
    category: 'personal',
    priority: 'medium',
    dueDate: getTodayString(4),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
    completed: false,
    completedAt: null,
    favorite: false,
    pinned: false,
    archived: false,
    recurring: 'none',
    subtasks: [
      { id: 'sub-14', title: 'Check tent and sleeping bags', completed: true },
      { id: 'sub-15', title: 'Buy firewood and marshmallows', completed: false }
    ],
    notes: 'Bring warm jackets, temperatures drop below 45F at night.',
    tags: ['#travel', '#outdoors', '#weekend'],
    progress: 50,
    order: 8
  }
];
