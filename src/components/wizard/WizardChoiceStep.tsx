import { memo } from 'react';
import { Check, Sliders, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { WizardHeader } from './WizardHeader';

interface WizardChoiceStepProps {
  selectedChoice: 'defaults' | 'manual';
  isReconfigure: boolean;
  isUsingDefaults: boolean;
  onSelectChoice: (choice: 'defaults' | 'manual') => void;
  onConfirm: () => void;
  footer?: React.ReactNode;
}

export const WizardChoiceStep = memo(function WizardChoiceStep({
  selectedChoice,
  isReconfigure,
  isUsingDefaults,
  onSelectChoice,
  onConfirm,
}: WizardChoiceStepProps) {
  const { t } = useTranslation();
  const confirmLabel = isReconfigure ? t('common.confirm') : t('wizard.choiceConfirm');

  return (
    <>
      <div className="flex flex-1 flex-col justify-center gap-6">
        <WizardHeader
          icon={
            isReconfigure ? (
              <Sliders size={28} className="text-brand-500" />
            ) : (
              <Sparkles size={28} className="text-brand-500" />
            )
          }
          title={isReconfigure ? t('wizard.reconfigureTitle') : t('wizard.choiceTitle')}
          subtitle={t(isReconfigure ? 'wizard.reconfigureSubtitle' : 'wizard.choiceSubtitle')}
        />
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => onSelectChoice('defaults')}
            className={`flex min-h-touch w-full items-center gap-4 rounded-xl border p-5 text-left transition-all active:scale-[.99] ${
              selectedChoice === 'defaults' ? 'border-brand-500 bg-brand-600/20' : 'border-slate-700 bg-slate-800'
            }`}
          >
            <div className="flex flex-1 flex-col">
              <span className="flex items-center gap-2 text-lg font-bold text-white">
                {t('wizard.defaults')}
                {isUsingDefaults && isReconfigure && (
                  <span className="rounded-full bg-brand-600/20 px-2 py-0.5 text-xs font-medium text-brand-500">
                    {t('wizard.usingNow')}
                  </span>
                )}
              </span>
              <span className="text-sm text-slate-300">{t('wizard.defaultsDesc')}</span>
            </div>
            {selectedChoice === 'defaults' && <Check size={22} className="shrink-0 text-brand-500" />}
          </button>
          <button
            type="button"
            onClick={() => onSelectChoice('manual')}
            className={`flex min-h-touch w-full items-center gap-4 rounded-xl border p-5 text-left transition-all active:scale-[.99] ${
              selectedChoice === 'manual' ? 'border-brand-500 bg-brand-600/20' : 'border-slate-700 bg-slate-800'
            }`}
          >
            <div className="flex flex-1 flex-col">
              <span className="flex items-center gap-2 text-lg font-bold text-white">
                {t('wizard.manual')}
                {!isUsingDefaults && isReconfigure && (
                  <span className="rounded-full bg-brand-600/20 px-2 py-0.5 text-xs font-medium text-brand-500">
                    {t('wizard.usingNow')}
                  </span>
                )}
              </span>
              <span className="text-sm text-slate-300">{t('wizard.manualDesc')}</span>
            </div>
            {selectedChoice === 'manual' && <Check size={22} className="shrink-0 text-brand-500" />}
          </button>
        </div>
        <button
          type="button"
          onClick={onConfirm}
          disabled={selectedChoice === null}
          className="flex min-h-touch w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 text-base font-bold text-white shadow-lg shadow-brand-500/20 transition-transform active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {confirmLabel}
          <span className="animate-pulse-soft">
            <Sparkles size={18} />
          </span>
        </button>
      </div>
    </>
  );
});
