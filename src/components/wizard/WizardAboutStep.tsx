import { memo } from 'react';
import { BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AboutStepCards } from '@/components/wizard/AboutStepCards';
import { WizardHeader } from './WizardHeader';

interface WizardAboutStepProps {
  onTellMeMore: () => void;
  footer?: React.ReactNode;
}

export const WizardAboutStep = memo(function WizardAboutStep({ onTellMeMore }: WizardAboutStepProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <WizardHeader
        icon={<BookOpen size={28} className="text-amber-400" />}
        title={t('info.title')}
        subtitle={t('wizard.aboutSubtitle')}
        iconClassName="border-amber-500/40 bg-amber-500/15 shadow-amber-500/10"
      />
      <AboutStepCards />
      <button
        type="button"
        onClick={onTellMeMore}
        className="flex min-h-touch w-full items-center justify-center gap-2 rounded-2xl border border-amber-500/50 bg-amber-600/10 text-base font-bold text-amber-300 transition-transform active:scale-[.99]"
      >
        <BookOpen size={18} className="text-amber-400" />
        {t('wizard.tellMeMore')}
      </button>
    </div>
  );
});
