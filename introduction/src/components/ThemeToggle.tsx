import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { ThemeMode } from '../types';
import { Sun, Moon, Laptop, ShieldAlert, Check } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { settings, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const themes: { id: ThemeMode; label: string; icon: React.ElementType; desc: string }[] = [
    { id: 'light', label: 'Light', icon: Sun, desc: 'Clean sunlit appearance' },
    { id: 'dark', label: 'Dark', icon: Moon, desc: 'Easy on the eyes twilight' },
    { id: 'oled', label: 'OLED Dark', icon: ShieldAlert, desc: 'Pure black for OLED screens' },
    { id: 'system', label: 'System', icon: Laptop, desc: 'Follow device preference' },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getActiveIcon = () => {
    switch (settings.theme) {
      case 'light': return <Sun className="w-5 h-5 text-amber-500" />;
      case 'oled': return <ShieldAlert className="w-5 h-5 text-indigo-400" />;
      case 'system': return <Laptop className="w-5 h-5 text-slate-400" />;
      case 'dark':
      default:
        return <Moon className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 transition-all duration-200 flex items-center justify-center shadow-xs hover:shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        title="Change Theme"
        aria-label="Toggle theme mode"
      >
        {getActiveIcon()}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Appearance Mode
          </div>
          <div className="space-y-1 px-1.5">
            {themes.map((item) => {
              const Icon = item.icon;
              const isSelected = settings.theme === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setTheme(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors duration-150 ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-sm">{item.label}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500">{item.desc}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
