import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck } from 'lucide-react';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { SafetyAlert } from '@/components/core/SafetyAlert';
import { InfoContent } from '@/components/wizard/InfoContent';
import { Button } from '@/components/core/Button';

interface InfoScreenProps {
  onBack: () => void;
  onOpenLegal?: () => void;
}

export const InfoScreen = memo(function InfoScreen({ onBack, onOpenLegal }: InfoScreenProps) {
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

        {onOpenLegal && (
          <Button
            variant="outline"
            fullWidth
            onClick={onOpenLegal}
            className="mt-2 gap-3 text-sm text-slate-300 hover:text-white"
          >
            <ShieldCheck size={18} className="text-brand-500" />
            <span>{t('info.legalLink')}</span>
          </Button>
        )}
      </div>
    </div>
  );
});
