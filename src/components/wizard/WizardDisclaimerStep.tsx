import { memo } from 'react';
import { ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { WizardHeader } from './WizardHeader';

export const WizardDisclaimerStep = memo(function WizardDisclaimerStep() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <WizardHeader
        icon={<ShieldAlert size={32} className="text-red-500" />}
        title={t('wizard.disclaimerTitle')}
        subtitle={t('wizard.disclaimerSubtitle')}
        iconClassName="border-red-500/40 bg-red-500/15 shadow-red-500/10"
      />
      <div className="flex flex-col gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
        <p className="text-sm leading-relaxed text-red-200/90">{t('wizard.disclaimerBody')}</p>
        <p className="text-sm leading-relaxed text-red-200/90">{t('wizard.disclaimerBody2')}</p>
      </div>
      <p className="text-center text-xs text-slate-500">{t('footer.privacyNote')}</p>
    </div>
  );
});
