import { memo, useState } from 'react';
import {
  AlertTriangle,
  ChevronRight,
  Globe,
  SlidersHorizontal,
  Vibrate,
  VibrateOff,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '@/constants/languages';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { BackButton } from '@/components/core/BackButton';
import { ConfirmDialog } from '@/components/core/ConfirmDialog';
import { LanguageSettingsScreen } from '@/screens/LanguageSettingsScreen';

interface SettingsScreenProps {
  onBack: () => void;
  onReconfigure: () => void;
  onFullReset: () => void;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-semibold text-slate-300">{children}</h2>;
}

export const SettingsScreen = memo(function SettingsScreen({
  onBack,
  onReconfigure,
  onFullReset,
}: SettingsScreenProps) {
  const { t } = useTranslation();
  const language = useTreatmentStore((s) => s.language);
  const settings = useTreatmentStore((s) => s.settings);
  const toggleSound = useTreatmentStore((s) => s.toggleSound);
  const toggleVibration = useTreatmentStore((s) => s.toggleVibration);
  const fullReset = useTreatmentStore((s) => s.fullReset);
  const [resetOpen, setResetOpen] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);

  if (showLanguage) {
    return <LanguageSettingsScreen onBack={() => setShowLanguage(false)} />;
  }

  const activeLang = LANGUAGES.find((l) => l.code === language);

  return (
    <div className="flex flex-1 flex-col gap-4 p-5">
      <header className="flex items-center gap-3">
        <BackButton onBack={onBack} />
        <h1 className="text-xl font-bold text-white">{t('settings.title')}</h1>
      </header>

      <section className="flex flex-col gap-2">
        <SectionTitle>{t('settings.feedback')}</SectionTitle>
        <button
          type="button"
          onClick={toggleSound}
          className="flex w-full min-h-touch items-center gap-4 rounded-xl border border-slate-700 bg-slate-800 px-4 text-lg font-semibold text-white active:scale-[.99]"
        >
          {settings.sound ? <Volume2 size={24} /> : <VolumeX size={24} />}
          <span className="flex-1 text-left">{t('settings.sound')}</span>
          <span className={`text-sm font-bold ${settings.sound ? 'text-brand-500' : 'text-slate-400'}`}>
            {settings.sound ? t('common.yes') : t('common.no')}
          </span>
        </button>
        {typeof navigator !== 'undefined' && !!navigator.vibrate && (
          <button
            type="button"
            onClick={toggleVibration}
            className="flex w-full min-h-touch items-center gap-4 rounded-xl border border-slate-700 bg-slate-800 px-4 text-lg font-semibold text-white active:scale-[.99]"
          >
            {settings.vibration ? <Vibrate size={24} /> : <VibrateOff size={24} />}
            <span className="flex-1 text-left">{t('settings.vibration')}</span>
            <span className={`text-sm font-bold ${settings.vibration ? 'text-brand-500' : 'text-slate-400'}`}>
              {settings.vibration ? t('common.yes') : t('common.no')}
            </span>
          </button>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <SectionTitle>{t('settings.manage')}</SectionTitle>
        <button
          type="button"
          onClick={() => setShowLanguage(true)}
          className="flex w-full min-h-touch items-center gap-4 rounded-xl border border-slate-700 bg-slate-800 px-4 text-lg font-semibold text-white active:scale-[.99]"
        >
          <Globe size={24} />
          <span className="flex-1 text-left">{t('settings.language')}</span>
          {activeLang && <span className="text-sm text-slate-400">{activeLang.label}</span>}
          <ChevronRight size={20} className="text-slate-500" />
        </button>
        <button
          type="button"
          onClick={onReconfigure}
          className="flex w-full min-h-touch items-center gap-4 rounded-xl border border-slate-700 bg-slate-800 px-4 text-lg font-semibold text-white active:scale-[.99]"
        >
          <SlidersHorizontal size={24} />
          <span className="flex-1 text-left">{t('home.reconfigure')}</span>
          <ChevronRight size={20} className="text-slate-500" />
        </button>
      </section>

      <section className="flex flex-col gap-2">
        <SectionTitle>{t('settings.dangerZone')}</SectionTitle>
        <button
          type="button"
          onClick={() => setResetOpen(true)}
          className="flex w-full min-h-touch items-center gap-4 rounded-xl border border-state-danger/50 bg-slate-800 px-4 text-lg font-semibold text-state-danger active:scale-[.99]"
        >
          <AlertTriangle size={24} />
          <span className="flex-1 text-left">{t('home.reset')}</span>
        </button>
      </section>

      <ConfirmDialog
        open={resetOpen}
        title={t('home.resetTitle')}
        body={t('home.resetBody')}
        confirmLabel={t('home.reset')}
        cancelLabel={t('common.cancel')}
        danger
        onConfirm={() => {
          fullReset();
          onFullReset();
          setResetOpen(false);
        }}
        onCancel={() => setResetOpen(false)}
      />
    </div>
  );
});
