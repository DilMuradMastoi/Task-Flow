import React from 'react';
import { useTasks } from '../hooks/useTasks';
import { useTheme } from '../hooks/useTheme';
import { StatsCard } from './StatsCard';
import { TaskCard } from './TaskCard';
import { getGreeting } from '../utils/helpers';
import { DashboardGreetingIllustration } from '../assets/illustrations';
import { 
  CheckCircle2, 
  Clock, 
  Layers, 
  TrendingUp, 
  AlertCircle, 
  Calendar, 
  ArrowRight,
  Plus,
  BarChart3,
  PieChart as PieIcon
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface DashboardProps {
  onOpenNewTask: () => void;
  onEditTask: (task: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenNewTask,
  onEditTask
}) => {
  const { stats, tasks, categories, setCurrentView } = useTasks();
  const { settings } = useTheme();

  const greeting = getGreeting();
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Prepare Pie Chart data by category
  const pieData = categories
    .map(c => ({
      name: c.name,
      value: stats.byCategory[c.name] || 0,
      color: c.color
    }))
    .filter(d => d.value > 0);

  if (pieData.length === 0) {
    pieData.push({ name: 'No Active Tasks', value: 1, color: '#94a3b8' });
  }

  // Priority chart data
  const priorityData = [
    { name: 'Urgent', value: stats.byPriority.urgent || 0, color: '#ef4444' },
    { name: 'High', value: stats.byPriority.high || 0, color: '#f97316' },
    { name: 'Medium', value: stats.byPriority.medium || 0, color: '#3b82f6' },
    { name: 'Low', value: stats.byPriority.low || 0, color: '#64748b' },
  ];

  // Urgent/High priority pending tasks preview
  const urgentTasks = tasks
    .filter(t => !t.completed && !t.archived && (t.priority === 'urgent' || t.priority === 'high' || t.pinned))
    .slice(0, 4);

  return (
    <div className="space-y-8 pb-8 animate-in fade-in duration-300">
      {/* Welcome Banner matching Professional Polish */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
        <div className="space-y-1">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{todayFormatted}</span>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
            {greeting.title}, {settings.userName.split(' ')[0]}.
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            You have <span className="font-semibold text-slate-700 dark:text-slate-200">{stats.pending} tasks</span> to complete today.
          </p>
        </div>
        <button
          onClick={onOpenNewTask}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create New Task</span>
        </button>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Tasks"
          value={stats.total}
          subtitle="All active workspace tasks"
          icon={Layers}
          iconColorClass="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"
          onClick={() => setCurrentView('all-tasks')}
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          subtitle={`${stats.completionRate}% overall success rate`}
          icon={CheckCircle2}
          iconColorClass="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10"
          trend={{ value: '12% this week', isPositive: true }}
          onClick={() => setCurrentView('completed')}
        />
        <StatsCard
          title="Pending Tasks"
          value={stats.pending}
          subtitle="Awaiting your focus"
          icon={Clock}
          iconColorClass="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10"
          onClick={() => setCurrentView('all-tasks')}
        />
        <StatsCard
          title="Overdue & Urgent"
          value={stats.overdueCount + (stats.byPriority.urgent || 0)}
          subtitle="Requires immediate attention"
          icon={AlertCircle}
          iconColorClass="text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10"
          onClick={() => setCurrentView('important')}
        />
      </div>

      {/* Analytics & Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Progress Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-500" />
                <span>Weekly Productivity & Progress</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tasks completed vs added over the last 7 days
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Completed
              </span>
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Added
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyProgress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: settings.theme === 'dark' ? '#0f172a' : '#ffffff',
                    borderColor: settings.theme === 'dark' ? '#334155' : '#e2e8f0',
                    borderRadius: '1rem',
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="completed" fill="#10b981" radius={[6, 6, 0, 0]} name="Completed" />
                <Bar dataKey="added" fill="#6366f1" radius={[6, 6, 0, 0]} name="Added" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-violet-500" />
              <span>Category Distribution</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active tasks categorized by domain
            </p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: settings.theme === 'dark' ? '#0f172a' : '#ffffff',
                    borderColor: settings.theme === 'dark' ? '#334155' : '#e2e8f0',
                    borderRadius: '1rem',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            {pieData.slice(0, 4).map((d, i) => (
              <div key={i} className="flex items-center gap-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-slate-600 dark:text-slate-300 font-medium truncate">{d.name}:</span>
                <span className="font-bold text-slate-900 dark:text-white ml-auto">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Urgent & Pinned Tasks Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              <span>Priority & Pinned Agenda</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              High priority tasks requiring your focus right now
            </p>
          </div>

          <button
            onClick={() => setCurrentView('important')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View All Important ({stats.byPriority.urgent + stats.byPriority.high})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {urgentTasks.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 opacity-80" />
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Zero Urgent Priorities!
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Great job! You have cleared all urgent and pinned tasks. Enjoy the momentum or plan for tomorrow.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {urgentTasks.map((task, idx) => (
              <TaskCard
                key={task.id}
                task={task}
                index={idx}
                onEdit={onEditTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
