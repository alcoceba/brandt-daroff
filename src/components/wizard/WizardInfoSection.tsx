import { memo } from 'react';

interface WizardInfoSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

export const WizardInfoSection = memo(function WizardInfoSection({
  icon,
  title,
  children,
}: WizardInfoSectionProps) {
  return (
    <div className="rounded-xl border border-slate-700/80 bg-slate-800/80 p-4 backdrop-blur-sm shadow-sm">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-sm font-bold text-white">{title}</h2>
      </div>
      <div className="mt-2 text-xs leading-relaxed text-slate-300">{children}</div>
    </div>
  );
});
