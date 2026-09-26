import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '@/constants/languages';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { ScreenHeader } from '@/components/core/ScreenHeader';

interface LanguageSettingsScreenProps {
  onBack: () => void;
}

export const LanguageSettingsScreen = memo(function LanguageSettingsScreen({ onBack }: LanguageSettingsScreenProps) {
  const { t } = useTranslation();
  const language = useTreatmentStore((s) => s.language);
  const setLanguage = useTreatmentStore((s) => s.setLanguage);

  return (
    <div className="flex flex-1 flex-col gap-4 px-3 py-5 sm:px-5">
      <ScreenHeader title={t('settings.language')} onBack={onBack} />
      <section className="flex flex-col gap-2">
        {LANGUAGES.map(({ code, label }) => {
          const active = code === language;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLanguage(code)}
              className={`flex w-full min-h-touch items-center gap-3 rounded-xl border px-4 text-lg font-semibold active:scale-[.99] ${
                active
                  ? 'border-brand-500 bg-brand-600 text-white'
                  : 'border-slate-700 bg-slate-800 text-white'
              }`}
            >
              <span className="flex-1 text-left">{label}</span>
              {active && <span className="text-sm text-brand-50">●</span>}
            </button>
          );
        })}
      </section>
    </div>
  );
});
