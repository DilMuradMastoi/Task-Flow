import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppSettings, ThemeMode, AccentColor, FontSize } from '../types';
import { loadSettingsFromStorage, saveSettingsToStorage } from '../utils/storage';
import { DEFAULT_SETTINGS } from '../utils/constants';

interface ThemeContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetSettings: () => void;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  setAccentColor: (color: AccentColor) => void;
  setFontSize: (size: FontSize) => void;
  toggleAnimations: () => void;
  toggleHighContrast: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettingsFromStorage());
  const [isDark, setIsDark] = useState<boolean>(true);

  // Sync settings to storage whenever they change
  useEffect(() => {
    saveSettingsToStorage(settings);
  }, [settings]);

  // Apply theme class to document element
  useEffect(() => {
    const root = document.documentElement;
    
    // Determine actual dark/light from mode
    let dark = false;
    if (settings.theme === 'dark' || settings.theme === 'oled') {
      dark = true;
    } else if (settings.theme === 'system') {
      dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      dark = false;
    }
    setIsDark(dark);

    // Apply dark class
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply OLED specific class if applicable
    if (settings.theme === 'oled') {
      root.classList.add('oled-theme');
    } else {
      root.classList.remove('oled-theme');
    }

    // Apply high contrast class
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply font size class
    root.classList.remove('text-sm-mode', 'text-normal-mode', 'text-lg-mode');
    if (settings.fontSize === 'small') root.classList.add('text-sm-mode');
    else if (settings.fontSize === 'large') root.classList.add('text-lg-mode');
    else root.classList.add('text-normal-mode');

    // Apply animation toggle
    if (!settings.animationsEnabled) {
      root.classList.add('no-animations');
    } else {
      root.classList.remove('no-animations');
    }

    // Apply accent color attribute
    root.setAttribute('data-accent', settings.accentColor);
  }, [settings]);

  // Listen for system theme changes if set to 'system'
  useEffect(() => {
    if (settings.theme !== 'system') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
      if (e.matches) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.theme]);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const setTheme = useCallback((theme: ThemeMode) => {
    updateSettings({ theme });
  }, [updateSettings]);

  const setAccentColor = useCallback((accentColor: AccentColor) => {
    updateSettings({ accentColor });
  }, [updateSettings]);

  const setFontSize = useCallback((fontSize: FontSize) => {
    updateSettings({ fontSize });
  }, [updateSettings]);

  const toggleAnimations = useCallback(() => {
    setSettings(prev => ({ ...prev, animationsEnabled: !prev.animationsEnabled }));
  }, []);

  const toggleHighContrast = useCallback(() => {
    setSettings(prev => ({ ...prev, highContrast: !prev.highContrast }));
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        isDark,
        setTheme,
        setAccentColor,
        setFontSize,
        toggleAnimations,
        toggleHighContrast
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
