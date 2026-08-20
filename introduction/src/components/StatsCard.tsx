import React from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ElementType;
  iconColorClass?: string;
  bgClass?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  onClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColorClass = 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10',
  bgClass = 'bg-white dark:bg-slate-800/80',
  trend,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-300 ${bgClass} ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5 active:scale-98' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 flex-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            {title}
          </p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
            {value}
          </p>
        </div>

        <div className={`p-3 rounded-xl ${iconColorClass} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
          {subtitle && (
            <span className="text-slate-500 dark:text-slate-400 font-medium truncate">
              {subtitle}
            </span>
          )}

          {trend && (
            <span
              className={`font-semibold inline-flex items-center gap-1 ${
                trend.isPositive ? 'text-emerald-500' : 'text-rose-500'
              }`}
            >
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
