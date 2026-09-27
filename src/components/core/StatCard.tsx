import { memo, type ReactNode } from 'react';
import { Card } from '@/components/core/Card';

export interface StatCardProps {
  label: ReactNode;
  value: ReactNode;
  icon?: ReactNode;
  variant?: 'compact' | 'subtle' | 'default';
  className?: string;
  valueClassName?: string;
  labelClassName?: string;
}

export const StatCard = memo(function StatCard({
  label,
  value,
  icon,
  variant = 'subtle',
  className = '',
  valueClassName = '',
  labelClassName = '',
}: StatCardProps) {
  if (variant === 'compact') {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-xl bg-slate-900/40 p-2 text-center ${className}`}
      >
        <div
          className={`flex items-center gap-1 text-[11px] text-slate-400 ${labelClassName}`}
        >
          {icon}
          <span>{label}</span>
        </div>
        <span
          className={`mt-0.5 text-sm font-bold tabular-nums ${
            valueClassName || 'text-white'
          }`}
        >
          {value}
        </span>
      </div>
    );
  }

  return (
    <Card
      variant={variant === 'default' ? 'default' : 'subtle'}
      className={`flex flex-col gap-1 p-3.5 border-slate-800 ${className}`}
    >
      <div className="flex items-center justify-between gap-1">
        <span
          className={`text-xs font-semibold uppercase tracking-wider text-slate-400 ${labelClassName}`}
        >
          {label}
        </span>
        {icon}
      </div>
      <span className={`text-sm font-bold ${valueClassName || 'text-slate-100'}`}>
        {value}
      </span>
    </Card>
  );
});
