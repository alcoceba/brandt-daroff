import { memo, type ReactNode } from 'react';
import { ShieldAlert } from 'lucide-react';

export interface SafetyAlertProps {
  title?: ReactNode;
  children: ReactNode;
  icon?: ReactNode;
  variant?: 'danger' | 'warning';
  className?: string;
  role?: string;
}

export const SafetyAlert = memo(function SafetyAlert({
  title,
  children,
  icon,
  variant = 'danger',
  className = '',
  role = 'alert',
}: SafetyAlertProps) {
  const isDanger = variant === 'danger';
  const defaultIcon = isDanger ? (
    <ShieldAlert className="h-5 w-5 shrink-0 text-red-400" />
  ) : (
    <ShieldAlert className="h-5 w-5 shrink-0 text-amber-400" />
  );

  const containerClasses = isDanger
    ? 'border-red-500/40 bg-red-950/25 text-red-200/90'
    : 'border-amber-500/40 bg-amber-950/25 text-amber-200/90';

  const titleClasses = isDanger ? 'text-red-300' : 'text-amber-300';

  return (
    <div
      role={role}
      className={`rounded-2xl border p-5 backdrop-blur-sm sm:p-6 ${containerClasses} ${className}`}
    >
      {(title || icon) && (
        <div className="flex items-center gap-2.5">
          {icon ?? defaultIcon}
          {title && (
            <h2 className={`text-base font-bold sm:text-lg ${titleClasses}`}>{title}</h2>
          )}
        </div>
      )}
      <div className={title || icon ? 'mt-2.5' : ''}>{children}</div>
    </div>
  );
});
