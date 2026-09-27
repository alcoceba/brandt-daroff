import { memo } from 'react';
import { ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { InfoContent } from '@/components/wizard/InfoContent';
import { WizardInfoSection } from '@/components/wizard/WizardInfoSection';

interface InfoScreenProps {
  onBack: () => void;
}

export const InfoScreen = memo(function InfoScreen({ onBack }: InfoScreenProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col gap-4 px-3 py-5 sm:px-5">
      <ScreenHeader title={t('info.title')} onBack={onBack} />

      <div className="flex flex-1 flex-col gap-3 pb-4">
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
