import React, { useState, useRef, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useTheme } from '../hooks/useTheme';
import { SearchBar } from './SearchBar';
import { ThemeToggle } from './ThemeToggle';
import { 
  Menu, 
  Bell, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  User, 
  Settings as SettingsIcon, 
  X,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenNewTask: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onOpenNewTask
}) => {
  const { tasks, stats, setCurrentView } = useTasks();
  const { settings, updateSettings } = useTheme();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editName, setEditName] = useState(settings.userName);
  const [editAvatar, setEditAvatar] = useState(settings.userAvatar);

  const notifRef = useRef<HTMLDivElement>(null);

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter urgent/overdue notifications
  const overdueTasks = tasks.filter(t => !t.completed && !t.archived && t.dueDate && new Date(t.dueDate).getTime() < new Date().setHours(0,0,0,0));
  const todayTasks = tasks.filter(t => !t.completed && !t.archived && t.dueDate && t.dueDate === new Date().toISOString().split('T')[0]);
  const notificationCount = overdueTasks.length + todayTasks.length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      userName: editName.trim() || 'Alex Rivers',
      userAvatar: editAvatar.trim() || settings.userAvatar
    });
    setShowProfileModal(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="flex items-center justify-between px-4 sm:px-8 h-16 gap-3 sm:gap-6">
          {/* Left section: Hamburger & App Branding / View Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition-colors"
              aria-label="Toggle Navigation Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer group lg:hidden"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-lg tracking-tight text-slate-800 dark:text-white leading-none">
                  TaskFlow
                </h1>
              </div>
            </div>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <SearchBar />
          </div>

          {/* Right section: Action controls & Profile */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* New Task Button */}
            <button
              onClick={onOpenNewTask}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-200 dark:shadow-none transition-all active:scale-95 duration-200"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">New Task</span>
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 transition-all flex items-center justify-center active:scale-95"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] text-[10px] font-extrabold rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs">
                    {notificationCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Notifications ({notificationCount})
                      </h4>
                    </div>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="py-2 space-y-2 max-h-72 overflow-y-auto no-scrollbar">
                    {overdueTasks.length === 0 && todayTasks.length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-500 dark:text-slate-400">
                        <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-80" />
                        You're all caught up! No urgent or overdue tasks.
                      </div>
                    ) : (
                      <>
                        {overdueTasks.map((t) => (
                          <div
                            key={t.id}
                            onClick={() => {
                              setCurrentView('all-tasks');
                              setShowNotifications(false);
                            }}
                            className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 hover:bg-rose-100/60 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>Overdue</span>
                            </div>
                            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 truncate">
                              {t.title}
                            </div>
                          </div>
                        ))}

                        {todayTasks.map((t) => (
                          <div
                            key={t.id}
                            onClick={() => {
                              setCurrentView('today');
                              setShowNotifications(false);
                            }}
                            className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/40 hover:bg-indigo-100/60 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Due Today</span>
                            </div>
                            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 truncate">
                              {t.title}
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Avatar Button matching Professional Polish */}
            <button
              onClick={() => {
                setEditName(settings.userName);
                setEditAvatar(settings.userAvatar);
                setShowProfileModal(true);
              }}
              className="flex items-center gap-3 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors active:scale-95"
              title="Profile Settings"
            >
              <div className="relative">
                <img
                  src={settings.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80'}
                  alt="User Avatar"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover bg-indigo-100 border-2 border-white dark:border-slate-800 shadow-xs"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
              </div>
              <div className="hidden xl:block text-left pr-1">
                <p className="text-sm font-semibold leading-none text-slate-800 dark:text-white max-w-[120px] truncate">
                  {settings.userName}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Pro Account</p>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile search bar fallback */}
        <div className="px-4 pb-3 md:hidden">
          <SearchBar showFilterToggle={false} />
        </div>
      </header>

      {/* User Profile Editor Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Edit Profile</h3>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex flex-col items-center gap-3">
                <img
                  src={editAvatar || settings.userAvatar}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-2xl object-cover shadow-md border-2 border-indigo-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
