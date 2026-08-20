import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onNewTask: () => void;
  onFocusSearch: () => void;
  onEscape: () => void;
}

export const useKeyboardShortcuts = ({
  onNewTask,
  onFocusSearch,
  onEscape
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input/textarea unless it's Escape or a command modifier
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        onNewTask();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        onFocusSearch();
      } else if (e.key === 'Escape') {
        if (isInput) {
          target.blur();
        }
        onEscape();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNewTask, onFocusSearch, onEscape]);
};
