import { memo } from 'react';
import { BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AboutStepCards } from '@/components/wizard/AboutStepCards';
import { Button } from '@/components/core/Button';
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
      <Button
        variant="warning"
        size="lg"
        fullWidth
        onClick={onTellMeMore}
      >
        <BookOpen size={18} className="text-amber-400" />
        {t('wizard.tellMeMore')}
      </Button>
    </div>
  );
});
