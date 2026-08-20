/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { TaskProvider } from './context/TaskContext';
import { useTasks } from './hooks/useTasks';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { TaskModal } from './components/TaskModal';
import { ToastContainer } from './components/Toast';
import { Dashboard } from './components/Dashboard';

import { AllTasksPage } from './pages/AllTasksPage';
import { TodayTasksPage } from './pages/TodayTasksPage';
import { UpcomingTasksPage } from './pages/UpcomingTasksPage';
import { ImportantTasksPage } from './pages/ImportantTasksPage';
import { CompletedTasksPage } from './pages/CompletedTasksPage';
import { ArchivedTasksPage } from './pages/ArchivedTasksPage';
import { SettingsPage } from './pages/SettingsPage';
import { CategoryTasksPage } from './pages/CategoryTasksPage';

import { Task } from './types';
import { Plus } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentView, setSearchQuery } = useTasks();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const handleOpenNewTask = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onNewTask: handleOpenNewTask,
    onFocusSearch: () => {
      const searchInput = document.querySelector('input[aria-label="Search tasks"]') as HTMLInputElement;
      searchInput?.focus();
    },
    onEscape: () => {
      if (isModalOpen) handleCloseModal();
      else if (isSidebarOpen) setIsSidebarOpen(false);
      else setSearchQuery('');
    }
  });

  const renderActiveView = () => {
    if (currentView.startsWith('category-')) {
      const catId = currentView.replace('category-', '');
      return (
        <CategoryTasksPage
          categoryId={catId}
          onOpenNewTask={handleOpenNewTask}
          onEditTask={handleEditTask}
        />
      );
    }

    switch (currentView) {
      case 'all-tasks':
        return <AllTasksPage onOpenNewTask={handleOpenNewTask} onEditTask={handleEditTask} />;
      case 'today':
        return <TodayTasksPage onOpenNewTask={handleOpenNewTask} onEditTask={handleEditTask} />;
      case 'upcoming':
        return <UpcomingTasksPage onOpenNewTask={handleOpenNewTask} onEditTask={handleEditTask} />;
      case 'important':
        return <ImportantTasksPage onOpenNewTask={handleOpenNewTask} onEditTask={handleEditTask} />;
      case 'completed':
        return <CompletedTasksPage onOpenNewTask={handleOpenNewTask} onEditTask={handleEditTask} />;
      case 'archived':
        return <ArchivedTasksPage onOpenNewTask={handleOpenNewTask} onEditTask={handleEditTask} />;
      case 'settings':
        return <SettingsPage />;
      case 'dashboard':
      default:
        return <Dashboard onOpenNewTask={handleOpenNewTask} onEditTask={handleEditTask} />;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Navigation Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
        onOpenNewTask={handleOpenNewTask}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenNewTask={handleOpenNewTask}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Task Modal (Create & Edit) */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        taskToEdit={taskToEdit}
      />

      {/* Floating Action Button (FAB for Mobile Touch Screens) */}
      <button
        onClick={handleOpenNewTask}
        className="fixed bottom-6 right-6 z-30 lg:hidden p-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xl shadow-indigo-500/50 transition-all active:scale-90 flex items-center justify-center border border-indigo-400/30"
        aria-label="Create New Task"
      >
        <Plus className="w-6 h-6 stroke-[3]" />
      </button>

      {/* Global Toast Alerts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <TaskProvider>
          <MainLayout />
        </TaskProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}
