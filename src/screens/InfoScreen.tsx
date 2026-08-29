import { memo } from 'react';
import { ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BackButton } from '@/components/core/BackButton';
import { InfoContent } from '@/components/wizard/InfoContent';
import { WizardInfoSection } from '@/components/wizard/WizardInfoSection';

interface InfoScreenProps {
  onBack: () => void;
}

export const InfoScreen = memo(function InfoScreen({ onBack }: InfoScreenProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col gap-4 px-3 py-5 sm:px-5">
      <header className="flex items-center gap-3">
        <BackButton onBack={onBack} />
        <h1 className="text-xl font-bold text-white">{t('info.title')}</h1>
      </header>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto pb-4">
        <WizardInfoSection
          icon={<ShieldAlert size={18} className="shrink-0 text-amber-400" />}
          title={t('wizard.disclaimerTitle')}
        >
          <p className="text-amber-200/90">{t('wizard.disclaimerBody')}</p>
        </WizardInfoSection>

        <InfoContent />
      </div>
    </div>
  );
});
