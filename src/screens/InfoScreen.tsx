import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { SafetyAlert } from '@/components/core/SafetyAlert';
import { InfoContent } from '@/components/wizard/InfoContent';

interface InfoScreenProps {
  onBack: () => void;
}

export const InfoScreen = memo(function InfoScreen({ onBack }: InfoScreenProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col gap-4 px-3 py-5 sm:px-5">
      <ScreenHeader title={t('info.title')} onBack={onBack} />

      <div className="flex flex-1 flex-col gap-3 pb-4">
        <SafetyAlert
          variant="warning"
          title={t('wizard.disclaimerTitle')}
        >
          <p className="text-sm leading-relaxed">{t('wizard.disclaimerBody')}</p>
        </SafetyAlert>

        <InfoContent />
      </div>
    </div>
  );
});
