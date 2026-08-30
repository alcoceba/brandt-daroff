import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { BackButton } from '@/components/core/BackButton';
import { StepDots } from '@/components/core/StepDots';

interface ProgressIndicatorProps {
  steps: string[];
  current: string;
  onBack?: () => void;
  showBack?: boolean;
  showProgress?: boolean;
  activeClassName?: string;
  completedClassName?: string;
  label?: string;
}

export const ProgressIndicator = memo(function ProgressIndicator({
  steps,
  current,
  onBack,
  showBack = true,
  showProgress = true,
  activeClassName,
  completedClassName,
  label,
}: ProgressIndicatorProps) {
  const { t } = useTranslation();
  const currentIndex = steps.indexOf(current);

  const indicatorLabel =
    showProgress && currentIndex !== -1
      ? label ?? t('wizard.stepIndicator', { current: currentIndex + 1, total: steps.length })
      : null;

  return (
    <div className="grid grid-cols-[3.5rem_1fr_3.5rem] items-center gap-3">
      {showBack ? (
        <BackButton onBack={onBack ?? (() => undefined)} className="shrink-0" />
      ) : (
        <div className="min-h-touch min-w-touch" aria-hidden="true" />
      )}

      {showProgress && currentIndex !== -1 && (
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="text-xs font-medium text-slate-400">{indicatorLabel}</span>
          <StepDots
            steps={steps}
            current={current}
            activeClassName={activeClassName}
            completedClassName={completedClassName}
          />
        </div>
      )}

      <div className="min-h-touch min-w-touch" aria-hidden="true" />
    </div>
  );
});
