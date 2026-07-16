import { memo, useState } from 'react';
import {
  ChevronRight,
  Globe,
  RotateCcw,
  SlidersHorizontal,
  Vibrate,
  VibrateOff,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Language } from '@/types';
import { LANGUAGES } from '@/i18n/languages';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { BackButton } from '@/components/BackButton';
import { ConfirmDialog } from '@/components/Modal';

const Flags: Record<Language, React.FC<{ className?: string }>> = {
  en: ({ className }) => (
    <svg viewBox="0 0 60 40" className={className} aria-hidden preserveAspectRatio="none">
      <rect width="60" height="40" fill="#012169" />
      <path d="M0 0 L60 40 M60 0 L0 40" stroke="#fff" strokeWidth="8" />
      <path d="M0 0 L60 40 M60 0 L0 40" stroke="#C8102E" strokeWidth="3" />
      <path d="M30 0 V40 M0 20 H60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0 V40 M0 20 H60" stroke="#C8102E" strokeWidth="5" />
    </svg>
  ),
  ca: ({ className }) => (
    <svg viewBox="0 0 60 40" className={className} aria-hidden preserveAspectRatio="none">
      <rect width="60" height="40" fill="#FCDD09" />
      <rect y="8" width="60" height="5.3" fill="#DA121A" />
      <rect y="18.7" width="60" height="5.3" fill="#DA121A" />
      <rect y="29.3" width="60" height="5.3" fill="#DA121A" />
    </svg>
  ),
  es: ({ className }) => (
    <svg viewBox="0 0 60 40" className={className} aria-hidden preserveAspectRatio="none">
      <rect width="60" height="40" fill="#AA151B" />
      <rect y="10" width="60" height="20" fill="#F1BF00" />
    </svg>
  ),
};

interface SettingsProps {
  onBack: () => void;
  onReconfigure: () => void;
  onFullReset: () => void;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-semibold text-slate-300">{children}</h2>;
}

function LanguageScreen({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  const language = useTreatmentStore((s) => s.language);
  const setLanguage = useTreatmentStore((s) => s.setLanguage);

  return (
    <div className="flex min-h-dvh flex-col gap-4 p-5">
      <header className="flex items-center gap-3">
        <BackButton onBack={onBack} />
        <h1 className="text-xl font-bold text-white">{t('settings.language')}</h1>
      </header>
      <section className="flex flex-col gap-2">
        {LANGUAGES.map(({ code, label }) => {
          const Flag = Flags[code];
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
              <Flag className="h-7 w-10 shrink-0 overflow-hidden rounded shadow" />
              <span className="flex-1 text-left">{label}</span>
              {active && <span className="text-sm text-brand-50">●</span>}
            </button>
          );
        })}
      </section>
    </div>
  );
}

export const Settings = memo(function Settings({ onBack, onReconfigure, onFullReset }: SettingsProps) {
  const { t } = useTranslation();
  const language = useTreatmentStore((s) => s.language);
  const settings = useTreatmentStore((s) => s.settings);
  const toggleSound = useTreatmentStore((s) => s.toggleSound);
  const toggleVibration = useTreatmentStore((s) => s.toggleVibration);
  const fullReset = useTreatmentStore((s) => s.fullReset);
  const [resetOpen, setResetOpen] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);

  if (showLanguage) {
    return <LanguageScreen onBack={() => setShowLanguage(false)} />;
  }

  const activeLang = LANGUAGES.find((l) => l.code === language);

  return (
    <div className="flex min-h-dvh flex-col gap-4 p-5">
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
        <button
          type="button"
          onClick={() => setResetOpen(true)}
          className="flex w-full min-h-touch items-center gap-4 rounded-xl border border-state-danger/50 bg-slate-800 px-4 text-lg font-semibold text-state-danger active:scale-[.99]"
        >
          <RotateCcw size={24} />
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
