import { memo, type ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';

export interface FeatureListItemProps {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export const FeatureListItem = memo(function FeatureListItem({
  children,
  icon = <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-400" />,
  className = '',
}: FeatureListItemProps) {
  return (
    <div
      className={`flex items-center gap-2 text-xs text-slate-300 sm:text-sm ${className}`}
    >
      {icon}
      <span>{children}</span>
    </div>
  );
});
