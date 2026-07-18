import { useEffect, useState } from 'react';
import { Github } from 'lucide-react';
import i18n from '@/i18n';
import type { Language } from '@/types';
import { useTranslation } from 'react-i18next';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Wizard } from '@/components/Wizard';
import { Home } from '@/components/Home';
import { CycleSession } from '@/components/CycleSession';
import { Settings } from '@/components/Settings';
import { InfoScreen } from '@/components/InfoScreen';

type Route = 'language' | 'wizard' | 'home' | 'cycle' | 'settings' | 'info';

export default function App() {
  const language = useTreatmentStore((s) => s.language);
  const setLanguage = useTreatmentStore((s) => s.setLanguage);
  const onboardingComplete = useTreatmentStore((s) => s.onboardingComplete);

  const [route, setRoute] = useState<Route>(onboardingComplete ? 'home' : 'language');
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    void i18n.changeLanguage(language);
    document.documentElement.lang = language;
  }, [language]);

  const handleLanguageSelect = (code: Language) => {
    setLanguage(code);
    void i18n.changeLanguage(code);
    setRoute('wizard');
  };

  const handleStartSession = (id: string) => {
    setSessionId(id);
    setRoute('cycle');
  };

  let screen: React.ReactNode;
  switch (route) {
    case 'language':
      screen = <LanguageSelector onSelect={handleLanguageSelect} />;
      break;
    case 'wizard':
      screen = onboardingComplete ? (
        <Wizard
          mode="reconfigure"
          onDone={() => setRoute('home')}
          onBack={() => setRoute('settings')}
        />
      ) : (
        <Wizard mode="onboarding" onDone={() => setRoute('home')} />
      );
      break;
    case 'cycle':
      screen = sessionId ? (
        <CycleSession sessionId={sessionId} onExit={() => setRoute('home')} />
      ) : (
        <Home
          onStartSession={handleStartSession}
          onOpenSettings={() => setRoute('settings')}
          onOpenInfo={() => setRoute('info')}
        />
      );
      break;
    case 'settings':
      screen = (
        <Settings
          onBack={() => setRoute('home')}
          onReconfigure={() => setRoute('wizard')}
          onFullReset={() => setRoute('language')}
        />
      );
      break;
    case 'info':
      screen = <InfoScreen onBack={() => setRoute('home')} />;
      break;
    case 'home':
    default:
      screen = (
        <Home
          onStartSession={handleStartSession}
          onOpenSettings={() => setRoute('settings')}
          onOpenInfo={() => setRoute('info')}
        />
      );
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-[700px] flex-col overflow-y-auto border-x border-slate-800 bg-gradient-to-b from-slate-900 to-slate-800 shadow-xl">
      <main className="flex flex-1 flex-col">
        <div className="flex min-h-full flex-col">{screen}</div>
      </main>
      <GlobalFooter />
    </div>
  );
}

function GlobalFooter() {
  const { t } = useTranslation();
  return (
    <footer className="shrink-0 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-slate-800 px-5 py-3 text-center text-xs text-slate-500 sm:justify-between">
      <span>{t('footer.copyright', { year: new Date().getFullYear() })} — {t('footer.privacyNote')}</span>
      <a
        href="https://github.com/alcoceba/brandt-daroff"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-slate-400 transition-colors hover:text-white"
        title={t('footer.github')}
      >
        <Github size={14} />
        {t('footer.github')}
      </a>
    </footer>
  );
}
