import { memo, useMemo } from 'react';
import { ArrowRight, Check, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Language } from '@/types';
import { LANGUAGES } from '@/constants/languages';

import { WizardHeader } from './WizardHeader';

interface WizardLanguageStepProps {
  selectedLanguage: Language;
  detectedLanguage?: Language;
  storedLanguage: Language;
  onSelect: (code: Language) => void;
  onConfirm: () => void;
  footer?: React.ReactNode;
}

export const WizardLanguageStep = memo(function WizardLanguageStep({
  selectedLanguage,
  detectedLanguage,
  storedLanguage,
  onSelect,
  onConfirm,
}: WizardLanguageStepProps) {
  const { t } = useTranslation();

  const preferredLanguage = detectedLanguage ?? storedLanguage;
  const sortedLanguages = useMemo(
    () => [
      ...LANGUAGES.filter((l) => l.code === preferredLanguage),
      ...LANGUAGES.filter((l) => l.code !== preferredLanguage),
    ],
    [preferredLanguage],
  );

  return (
    <>
      <div className="flex flex-1 flex-col justify-center gap-6">
        <WizardHeader
          icon={<Globe size={28} className="text-brand-500" />}
          title={t('language.title')}
          subtitle={t('language.subtitle')}
        />
        <ul className="flex flex-col gap-3">
          {sortedLanguages.map(({ code, label }) => {
            const active = code === selectedLanguage;
            return (
              <li key={code}>
                <button
                  type="button"
                  onClick={() => onSelect(code)}
                    className={`flex w-full min-h-touch items-center gap-3 rounded-xl border px-4 text-lg font-semibold transition-all active:scale-[.99] ${
                    active ? 'border-brand-500 bg-brand-600/20 text-white' : 'border-slate-700 bg-slate-800 text-white'
                  }`}
                >
                    <span className="flex-1 text-left">{label}</span>
                  {active && <Check size={18} className="text-brand-500" />}
                </button>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          onClick={onConfirm}
          className="flex min-h-touch w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 text-base font-bold text-white shadow-lg shadow-brand-500/20 transition-transform active:scale-[.99]"
        >
          {t('common.confirm')}
          <span className="animate-arrow-bounce">
            <ArrowRight size={18} />
          </span>
        </button>
      </div>
    </>
  );
});
