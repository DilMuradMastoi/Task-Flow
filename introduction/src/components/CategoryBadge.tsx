import React from 'react';
import { useTasks } from '../hooks/useTasks';
import { getCategoryDetails } from '../utils/helpers';
import * as Icons from 'lucide-react';

interface CategoryBadgeProps {
  category: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  onClick?: () => void;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'md',
  showIcon = true,
  onClick
}) => {
  const { categories } = useTasks();
  const { name, color, icon } = getCategoryDetails(category, categories);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs font-medium gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-semibold gap-2'
  }[size];

  // Dynamically resolve Lucide icon
  const IconComponent = (Icons as Record<string, React.ElementType>)[icon] || Icons.Tag;

  return (
    <span
      onClick={onClick}
      style={{
        backgroundColor: `${color}1A`, // 10% opacity
        color: color,
        borderColor: `${color}33`
      }}
      className={`inline-flex items-center rounded-full border ${sizeClasses} transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      }`}
    >
      {showIcon && <IconComponent className="w-3.5 h-3.5 shrink-0" style={{ color }} />}
      <span className="truncate max-w-[120px]">{name}</span>
    </span>
  );
};
