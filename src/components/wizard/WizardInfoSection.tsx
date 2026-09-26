import { memo } from 'react';
import { Card } from '@/components/core/Card';

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
    <Card>
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-sm font-bold text-white">{title}</h2>
      </div>
      <div className="mt-2 text-xs leading-relaxed text-slate-300">{children}</div>
    </Card>
  );
});
