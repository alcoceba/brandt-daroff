import { memo, type ReactNode } from 'react';
import { SectionCard } from '@/components/core/SectionCard';

interface WizardInfoSectionProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

export const WizardInfoSection = memo(function WizardInfoSection({
  icon,
  title,
  children,
}: WizardInfoSectionProps) {
  return (
    <SectionCard
      icon={icon}
      title={title}
      titleClassName="text-sm font-bold text-white"
    >
      <div className="text-xs leading-relaxed text-slate-300">{children}</div>
    </SectionCard>
  );
});
