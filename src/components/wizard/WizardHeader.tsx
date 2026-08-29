import { memo } from 'react';

interface WizardHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  iconClassName?: string;
}

export const WizardHeader = memo(function WizardHeader({
  icon,
  title,
  subtitle,
  iconClassName = 'border-brand-500/40 bg-brand-500/15 shadow-brand-500/10',
}: WizardHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border shadow-lg ${iconClassName}`}>
        {icon}
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
});
