import { useEffect, useState } from 'react';
import i18n from '@/i18n';
import type { Language } from '@/types';
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
    <div className="mx-auto min-h-dvh w-full max-w-[700px] border-x border-slate-800 bg-slate-900 shadow-xl">
      {screen}
    </div>
  );
}
