import { Task, AppSettings, CategoryItem } from '../types';
import { INITIAL_TASKS, DEFAULT_SETTINGS, DEFAULT_CATEGORIES } from './constants';

const TASKS_KEY = 'saas_todo_tasks_v1';
const SETTINGS_KEY = 'saas_todo_settings_v1';
const CATEGORIES_KEY = 'saas_todo_categories_v1';

export const loadTasksFromStorage = (): Task[] => {
  try {
    const stored = localStorage.getItem(TASKS_KEY);
    if (!stored) {
      saveTasksToStorage(INITIAL_TASKS);
      return INITIAL_TASKS;
    }
    const parsed: Task[] = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : INITIAL_TASKS;
  } catch (e) {
    console.error('Failed to load tasks from local storage:', e);
    return INITIAL_TASKS;
  }
};

export const saveTasksToStorage = (tasks: Task[]): void => {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks to local storage:', e);
  }
};

export const loadSettingsFromStorage = (): AppSettings => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) {
      saveSettingsToStorage(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(stored);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (e) {
    console.error('Failed to load settings from local storage:', e);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettingsToStorage = (settings: AppSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to local storage:', e);
  }
};

export const loadCategoriesFromStorage = (): CategoryItem[] => {
  try {
    const stored = localStorage.getItem(CATEGORIES_KEY);
    if (!stored) {
      saveCategoriesToStorage(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
    const parsed: CategoryItem[] = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CATEGORIES;
  } catch (e) {
    console.error('Failed to load categories from local storage:', e);
    return DEFAULT_CATEGORIES;
  }
};

export const saveCategoriesToStorage = (categories: CategoryItem[]): void => {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (e) {
    console.error('Failed to save categories to local storage:', e);
  }
};

export const clearAllStorageData = (): void => {
  try {
    localStorage.removeItem(TASKS_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(CATEGORIES_KEY);
  } catch (e) {
    console.error('Failed to clear storage:', e);
  }
};
