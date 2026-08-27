import React from 'react';
import type { ReportStatus } from '../../types';

interface BadgeProps {
  status?: ReportStatus | string;
  variant?: 'draft' | 'completed' | 'amended' | 'normal' | 'abnormal' | 'info';
  children?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, variant, children, className = '' }) => {
  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';

  if (status === 'Draft' || variant === 'draft') {
    badgeStyle = 'bg-amber-50 text-amber-800 border-amber-300 font-semibold';
  } else if (status === 'Completed' || variant === 'completed') {
    badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold';
  } else if (status === 'Amended' || variant === 'amended') {
    badgeStyle = 'bg-purple-50 text-purple-800 border-purple-300 font-semibold';
  } else if (variant === 'normal') {
    badgeStyle = 'bg-emerald-100 text-emerald-800 border-emerald-200 font-medium';
  } else if (variant === 'abnormal') {
    badgeStyle = 'bg-rose-100 text-rose-800 border-rose-200 font-medium';
  } else if (variant === 'info') {
    badgeStyle = 'bg-sky-50 text-sky-800 border-sky-200 font-medium';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${badgeStyle} ${className}`}
    >
      {children || status}
    </span>
  );
};
