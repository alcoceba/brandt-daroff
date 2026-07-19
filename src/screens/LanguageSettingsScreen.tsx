import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '@/constants/languages';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { BackButton } from '@/components/core/BackButton';
import { FlagIcon } from '@/components/FlagIcon';

interface LanguageSettingsScreenProps {
  onBack: () => void;
}

export const LanguageSettingsScreen = memo(function LanguageSettingsScreen({ onBack }: LanguageSettingsScreenProps) {
  const { t } = useTranslation();
  const language = useTreatmentStore((s) => s.language);
  const setLanguage = useTreatmentStore((s) => s.setLanguage);

  return (
    <div className="flex flex-1 flex-col gap-4 p-5">
      <header className="flex items-center gap-3">
        <BackButton onBack={onBack} />
        <h1 className="text-xl font-bold text-white">{t('settings.language')}</h1>
      </header>
      <section className="flex flex-col gap-2">
        {LANGUAGES.map(({ code, label }) => {
          const active = code === language;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLanguage(code)}
              className={`flex w-full min-h-touch items-center gap-4 rounded-xl border px-4 text-lg font-semibold active:scale-[.99] ${
                active
                  ? 'border-brand-500 bg-brand-600 text-white'
                  : 'border-slate-700 bg-slate-800 text-white'
              }`}
            >
              <FlagIcon code={code} className="h-7 w-10 shrink-0 overflow-hidden rounded shadow" />
              <span className="flex-1 text-left">{label}</span>
              {active && <span className="text-sm text-brand-50">●</span>}
            </button>
          );
        })}
      </section>
    </div>
  );
});
