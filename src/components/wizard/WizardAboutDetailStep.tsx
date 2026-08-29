import { memo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { InfoContent } from './InfoContent';

interface WizardAboutDetailStepProps {
  onStart: () => void;
  footer?: React.ReactNode;
}

export const WizardAboutDetailStep = memo(function WizardAboutDetailStep({
  onStart,
}: WizardAboutDetailStepProps) {
  const { t } = useTranslation();

  return (
    <>
      <h1 className="text-xl font-bold text-white">{t('info.title')}</h1>
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto pb-2">
        <InfoContent />
      </div>
      <div className="mx-auto mt-2 w-full max-w-[480px]">
        <button
          type="button"
          onClick={onStart}
          className="flex min-h-touch w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-amber-500 text-base font-bold text-slate-900 shadow-lg shadow-amber-500/25 transition-transform active:scale-[.99]"
        >
          {t('wizard.letsStart')}
          <span className="animate-arrow-bounce">
            <ArrowRight size={18} />
          </span>
        </button>
      </div>
    </>
  );
});
