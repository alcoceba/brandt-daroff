import { memo } from 'react';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { TreatmentConfig } from '@/types';
import { TreatmentSettingsForm } from '@/components/wizard/TreatmentSettingsForm';

interface WizardManualStepProps {
  values: TreatmentConfig;
  mode: 'onboarding' | 'reconfigure';
  onChange: (key: keyof TreatmentConfig, value: number) => void;
  onSave: () => void;
}

export const WizardManualStep = memo(function WizardManualStep({
  values,
  mode,
  onChange,
  onSave,
}: WizardManualStepProps) {
  const { t } = useTranslation();

  return (
    <>
      <h1 className="text-xl font-bold text-white">{t('wizard.manualTitle')}</h1>
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
        <TreatmentSettingsForm values={values} onChange={onChange} />
      </div>
      <div className="mx-auto mt-2 w-full max-w-[480px] shrink-0">
        <button
          type="button"
          onClick={onSave}
          className="flex min-h-touch w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 text-base font-bold text-white shadow-lg shadow-brand-500/20 transition-transform active:scale-[.99]"
        >
          <Check size={20} />
          {mode === 'reconfigure' ? t('wizard.saveOnly') : t('wizard.save')}
        </button>
      </div>
    </>
  );
});
