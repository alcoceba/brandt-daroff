import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TreatmentConfig } from '@/types';
import { TreatmentSettingsForm } from '@/components/wizard/TreatmentSettingsForm';

interface WizardManualStepProps {
  values: TreatmentConfig;
  onChange: (key: keyof TreatmentConfig, value: number) => void;
}

export const WizardManualStep = memo(function WizardManualStep({ values, onChange }: WizardManualStepProps) {
  const { t } = useTranslation();

  return (
    <>
      <h1 className="text-xl font-bold text-white">{t('wizard.manualTitle')}</h1>
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
        <TreatmentSettingsForm values={values} onChange={onChange} />
      </div>
    </>
  );
});
