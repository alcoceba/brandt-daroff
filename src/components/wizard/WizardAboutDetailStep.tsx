import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoContent } from './InfoContent';

export const WizardAboutDetailStep = memo(function WizardAboutDetailStep() {
  const { t } = useTranslation();

  return (
    <>
      <h1 className="text-xl font-bold text-white">{t('info.title')}</h1>
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto pb-2">
        <InfoContent />
      </div>
    </>
  );
});
