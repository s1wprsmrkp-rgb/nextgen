import React from 'react';
import { Sparkles } from 'lucide-react';

interface MatchBadgeProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const MatchBadge: React.FC<MatchBadgeProps> = ({
  percentage,
  size = 'md',
  showIcon = true,
}) => {
  const getColor = () => {
    if (percentage >= 90) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold';
    }
    if (percentage >= 75) {
      return 'bg-teal-50 text-teal-800 border-teal-300 font-semibold';
    }
    if (percentage >= 60) {
      return 'bg-blue-50 text-blue-800 border-blue-300';
    }
    return 'bg-slate-100 text-slate-700 border-slate-300';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs sm:text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-sm sm:text-base px-3.5 py-1.5 gap-2 font-bold',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-xs ${getColor()} ${sizeClasses[size]}`}
    >
      {showIcon && <Sparkles className={`${iconSizes[size]} text-emerald-600 shrink-0`} />}
      <span>{percentage}% Match</span>
    </span>
  );
};
