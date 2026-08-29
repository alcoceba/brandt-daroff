import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { BackButton } from '@/components/core/BackButton';
import { StepDots } from '@/components/core/StepDots';

interface WizardFooterProps {
  showBack: boolean;
  onBack: () => void;
  showDots?: boolean;
  steps?: string[];
  current?: string;
  activeClassName?: string;
  completedClassName?: string;
}

export const WizardFooter = memo(function WizardFooter({
  showBack,
  onBack,
  showDots,
  steps,
  current,
  activeClassName,
  completedClassName,
}: WizardFooterProps) {
  const { t } = useTranslation();
  const currentIndex = steps && current ? steps.indexOf(current) : -1;

  return (
    <div className="flex items-center gap-3">
      {showBack ? (
        <BackButton onBack={onBack} className="shrink-0" />
      ) : (
        <div className="min-h-touch min-w-touch shrink-0" aria-hidden="true" />
      )}
      {showDots && steps && current && currentIndex !== -1 && (
        <div className="flex flex-1 flex-col items-center gap-2">
          <span className="text-xs font-medium text-slate-400">
            {t('wizard.stepIndicator', { current: currentIndex + 1, total: steps.length })}
          </span>
          <StepDots
            steps={steps}
            current={current}
            activeClassName={activeClassName}
            completedClassName={completedClassName}
          />
        </div>
      )}
      {/* Add a right placeholder to perfectly center the dots when space allows */}
      {showDots && steps && current && currentIndex !== -1 && (
        <div className="min-h-touch min-w-touch shrink-0" aria-hidden="true" />
      )}
    </div>
  );
});
