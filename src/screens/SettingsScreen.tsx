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
import { Button } from '@/components/core/Button';
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
    <div className="flex flex-1 flex-col gap-4 px-3 py-5 sm:px-5">
      <header className="flex items-center gap-3">
        <BackButton onBack={onBack} />
        <h1 className="text-xl font-bold text-white">{t('settings.title')}</h1>
      </header>

      <section className="flex flex-col gap-2">
        <SectionTitle>{t('settings.feedback')}</SectionTitle>
        <Button
          variant="outline"
          fullWidth
          onClick={toggleSound}
          className="gap-4 px-4 text-lg"
        >
          {settings.sound ? <Volume2 size={24} /> : <VolumeX size={24} />}
          <span className="flex-1 text-left">{t('settings.sound')}</span>
          <span className={`text-sm font-bold ${settings.sound ? 'text-brand-500' : 'text-slate-400'}`}>
            {settings.sound ? t('common.yes') : t('common.no')}
          </span>
        </Button>
        {typeof navigator !== 'undefined' && !!navigator.vibrate && (
          <Button
            variant="outline"
            fullWidth
            onClick={toggleVibration}
            className="gap-4 px-4 text-lg"
          >
            {settings.vibration ? <Vibrate size={24} /> : <VibrateOff size={24} />}
            <span className="flex-1 text-left">{t('settings.vibration')}</span>
            <span className={`text-sm font-bold ${settings.vibration ? 'text-brand-500' : 'text-slate-400'}`}>
              {settings.vibration ? t('common.yes') : t('common.no')}
            </span>
          </Button>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <SectionTitle>{t('settings.manage')}</SectionTitle>
        <Button
          variant="outline"
          fullWidth
          onClick={() => setShowLanguage(true)}
          className="gap-4 px-4 text-lg"
        >
          <Globe size={24} />
          <span className="flex-1 text-left">{t('settings.language')}</span>
          {activeLang && <span className="text-sm text-slate-400">{activeLang.label}</span>}
          <ChevronRight size={20} className="text-slate-500" />
        </Button>
        <Button
          variant="outline"
          fullWidth
          onClick={onReconfigure}
          className="gap-4 px-4 text-lg"
        >
          <SlidersHorizontal size={24} />
          <span className="flex-1 text-left">{t('home.reconfigure')}</span>
          <ChevronRight size={20} className="text-slate-500" />
        </Button>
      </section>

      <section className="flex flex-col gap-2">
        <SectionTitle>{t('settings.dangerZone')}</SectionTitle>
        <Button
          variant="danger"
          fullWidth
          onClick={() => setResetOpen(true)}
          className="gap-4 px-4 text-lg"
        >
          <AlertTriangle size={24} />
          <span className="flex-1 text-left">{t('home.reset')}</span>
        </Button>
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
