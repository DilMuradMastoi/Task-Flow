import React from 'react';
import { PriorityLevel } from '../types';
import { PRIORITY_CONFIG } from '../utils/constants';
import * as Icons from 'lucide-react';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'md',
  showIcon = true
}) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs font-medium gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-semibold gap-2'
  }[size];

  const getIcon = () => {
    switch (priority) {
      case 'urgent':
        return <Icons.AlertCircle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />;
      case 'high':
        return <Icons.ArrowUpRight className="w-3.5 h-3.5 text-orange-500" />;
      case 'medium':
        return <Icons.ArrowRight className="w-3.5 h-3.5 text-blue-500" />;
      case 'low':
      default:
        return <Icons.ArrowDownRight className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClasses} transition-all duration-200`}
    >
      {showIcon && getIcon()}
      <span>{config.label}</span>
    </span>
  );
};
