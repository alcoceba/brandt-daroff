import { memo } from 'react';
import { ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { WizardHeader } from './WizardHeader';
import { SafetyAlert } from '@/components/core/SafetyAlert';
import { StoragePrivacyNotice } from '@/components/core/StoragePrivacyNotice';

export const WizardDisclaimerStep = memo(function WizardDisclaimerStep() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col justify-center gap-5">
      <WizardHeader
        icon={<ShieldAlert size={32} className="text-red-500" />}
        title={t('wizard.disclaimerTitle')}
        subtitle={t('wizard.disclaimerSubtitle')}
        iconClassName="border-red-500/40 bg-red-500/15 shadow-red-500/10"
      />

      <SafetyAlert variant="danger">
        <p className="text-sm leading-relaxed">{t('wizard.disclaimerBody')}</p>
        <p className="mt-3 text-sm leading-relaxed">{t('wizard.disclaimerBody2')}</p>
      </SafetyAlert>

      <StoragePrivacyNotice />
    </div>
  );
});
