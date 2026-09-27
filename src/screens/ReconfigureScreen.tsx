import { memo, useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { TreatmentConfig } from '@/types';
import { DEFAULT_CONFIG } from '@/constants/treatment';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { Button } from '@/components/core/Button';
import { TreatmentSettingsForm } from '@/components/wizard/TreatmentSettingsForm';

interface ReconfigureScreenProps {
  onBack: () => void;
}

export const ReconfigureScreen = memo(function ReconfigureScreen({ onBack }: ReconfigureScreenProps) {
  const { t } = useTranslation();
  const storedConfig = useTreatmentStore((s) => s.config);
  const setConfig = useTreatmentStore((s) => s.setConfig);
  
  const [values, setValues] = useState<TreatmentConfig>(storedConfig);

  const update = (key: keyof TreatmentConfig, raw: number) => {
    setValues((prev) => ({ ...prev, [key]: raw }));
  };

  const handleSave = () => {
    setConfig(values);
    onBack(); // Go back to settings or home after saving
  };

  const handleRestoreDefaults = () => {
    setValues(DEFAULT_CONFIG);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-3 py-5 sm:px-5">
      <ScreenHeader title={t('home.reconfigure')} onBack={onBack} />

      <div className="flex flex-1 flex-col gap-3 pt-2">
        <TreatmentSettingsForm values={values} onChange={update} />
      </div>

      <div className="mt-2 flex flex-col gap-3">
        <Button
          variant="secondary"
          fullWidth
          onClick={handleRestoreDefaults}
          className="text-sm"
        >
          <RotateCcw size={16} />
          {t('wizard.defaults')}
        </Button>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleSave}
        >
          <Check size={20} />
          {t('wizard.save')}
        </Button>
      </div>
    </div>
  );
});
