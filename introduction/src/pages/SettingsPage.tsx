import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useTasks } from '../hooks/useTasks';
import { ThemeMode, AccentColor, FontSize } from '../types';
import { ACCENT_COLORS } from '../utils/constants';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { 
  Settings as SettingsIcon, 
  Sun, 
  Moon, 
  Laptop, 
  ShieldAlert, 
  Palette, 
  Type, 
  Sparkles, 
  Download, 
  Upload, 
  Trash2, 
  Check, 
  RotateCcw,
  Tag,
  Plus,
  X
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { 
    settings, 
    setTheme, 
    setAccentColor, 
    setFontSize, 
    toggleAnimations, 
    toggleHighContrast, 
    resetSettings 
  } = useTheme();

  const { tasks, categories, addCategory, deleteCategory, importTasksAndSettings, clearAllTasks } = useTasks();

  const [showClearDialog, setShowClearDialog] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#6366f1');

  const themes: { id: ThemeMode; label: string; icon: React.ElementType; desc: string }[] = [
    { id: 'light', label: 'Light Mode', icon: Sun, desc: 'Clean, bright sunlit appearance' },
    { id: 'dark', label: 'Dark Mode', icon: Moon, desc: 'Easy on the eyes twilight canvas' },
    { id: 'oled', label: 'OLED Dark', icon: ShieldAlert, desc: 'True pure black for AMOLED/OLED displays' },
    { id: 'system', label: 'System Sync', icon: Laptop, desc: 'Automatically match operating system preference' },
  ];

  const fontSizes: { id: FontSize; label: string; desc: string }[] = [
    { id: 'small', label: 'Compact (Small)', desc: 'Higher density, fits more items on screen' },
    { id: 'normal', label: 'Standard (Default)', desc: 'Balanced readability and spacing' },
    { id: 'large', label: 'Spacious (Large)', desc: 'Enhanced legibility with larger font baselines' },
  ];

  const handleExportData = () => {
    const data = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      settings,
      categories,
      tasks
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importTasksAndSettings(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim(), newCatColor, 'Tag');
    setNewCatName('');
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
            <SettingsIcon className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Workspace Settings & Preferences
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize appearance, accessibility, categories, and manage data backups
            </p>
          </div>
        </div>

        <button
          onClick={resetSettings}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
          title="Reset to default settings"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Theme Selection */}
      <section className="space-y-3">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Moon className="w-4 h-4 text-indigo-500" />
            <span>Appearance Theme</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Choose your preferred color canvas and lighting mode
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {themes.map((t) => {
            const Icon = t.icon;
            const isSelected = settings.theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-start justify-between group ${
                  isSelected
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 shadow-sm'
                    : 'bg-white dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700/80 text-slate-500 dark:text-slate-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{t.label}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t.desc}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <span className="p-1 rounded-full bg-indigo-600 text-white shrink-0 mt-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Accent Color Selection */}
      <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-violet-500" />
            <span>Accent Color Palette</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Personalize buttons, badges, and interactive highlight colors across the app
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {(Object.keys(ACCENT_COLORS) as AccentColor[]).map((colorKey) => {
            const cfg = ACCENT_COLORS[colorKey];
            const isSelected = settings.accentColor === colorKey;
            return (
              <button
                key={colorKey}
                onClick={() => setAccentColor(colorKey)}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  isSelected
                    ? 'border-slate-900 dark:border-white shadow-md scale-105 bg-slate-50 dark:bg-slate-800'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <span className="w-7 h-7 rounded-full shadow-inner flex items-center justify-center text-white font-bold" style={{ backgroundColor: cfg.hex }}>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {cfg.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Font Size & Accessibility */}
      <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Type className="w-4 h-4 text-blue-500" />
            <span>Typography & Accessibility</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Adjust text density and UI motion effects for comfortable viewing
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {fontSizes.map((f) => {
            const isSelected = settings.fontSize === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFontSize(f.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-500 shadow-sm'
                    : 'bg-white dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{f.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {f.desc}
                </p>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Animation Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Smooth UI Animations</span>
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enable motion transitions and button ripples
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.animationsEnabled}
              onChange={toggleAnimations}
              className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          {/* High Contrast Mode Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                High Contrast Borders
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Increase visual separation between cards and controls
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={toggleHighContrast}
              className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* Category Management */}
      <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-500" />
            <span>Manage Custom Categories</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Create or delete domain tags for classifying your agenda items
          </p>
        </div>

        <form onSubmit={handleAddCategory} className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="New category name (e.g., Marketing, Freelance)..."
            className="flex-1 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[200px]"
          />
          <div className="flex items-center gap-2 shrink-0">
            <input
              type="color"
              value={newCatColor}
              onChange={(e) => setNewCatColor(e.target.value)}
              className="w-9 h-9 rounded-xl cursor-pointer border-0 bg-transparent"
              title="Pick category color"
            />
            <button
              type="submit"
              disabled={!newCatName.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all disabled:opacity-50"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Category</span>
            </button>
          </div>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-1">
          {categories.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 shadow-xs"
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{c.name}</span>
              </div>
              {c.isCustom && (
                <button
                  onClick={() => deleteCategory(c.id)}
                  className="p-1 text-slate-400 hover:text-rose-500 transition-colors shrink-0"
                  title="Remove category"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Data Management & Backups */}
      <section className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Download className="w-4 h-4 text-purple-500" />
            <span>Data Backups & Storage</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Export all your tasks and preferences as a JSON backup file or import existing archives
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportData}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-sm border border-indigo-200/60 dark:border-indigo-800/60 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Export Backup (JSON)</span>
          </button>

          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm cursor-pointer transition-all active:scale-95">
            <Upload className="w-4 h-4" />
            <span>Import Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          <button
            onClick={() => setShowClearDialog(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-sm border border-rose-200/60 dark:border-rose-900/60 transition-all active:scale-95 ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Tasks</span>
          </button>
        </div>
      </section>

      {/* Confirmation Dialog for Clear All Tasks */}
      <ConfirmDialog
        isOpen={showClearDialog}
        title="Clear All Workspace Tasks?"
        message="This action will permanently delete all tasks, subtasks, and notes from local storage. Your custom categories and theme preferences will be preserved."
        confirmLabel="Yes, Clear Everything"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={clearAllTasks}
        onCancel={() => setShowClearDialog(false)}
      />
    </div>
  );
};
