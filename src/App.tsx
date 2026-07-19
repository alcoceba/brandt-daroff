import { useEffect, useState } from 'react';
import i18n from '@/i18n';
import type { Language, Route } from '@/types';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { LanguageSelectorScreen } from '@/screens/LanguageSelectorScreen';
import { WizardScreen } from '@/screens/WizardScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { CycleSessionScreen } from '@/screens/CycleSessionScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { InfoScreen } from '@/screens/InfoScreen';
import { AppLayout } from '@/layouts/AppLayout';

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
      screen = <LanguageSelectorScreen onSelect={handleLanguageSelect} />;
      break;
    case 'wizard':
      screen = onboardingComplete ? (
        <WizardScreen
          mode="reconfigure"
          onDone={() => setRoute('home')}
          onBack={() => setRoute('settings')}
        />
      ) : (
        <WizardScreen mode="onboarding" onDone={() => setRoute('home')} />
      );
      break;
    case 'cycle':
      screen = sessionId ? (
        <CycleSessionScreen sessionId={sessionId} onExit={() => setRoute('home')} />
      ) : (
        <HomeScreen
          onStartSession={handleStartSession}
          onOpenSettings={() => setRoute('settings')}
          onOpenInfo={() => setRoute('info')}
        />
      );
      break;
    case 'settings':
      screen = (
        <SettingsScreen
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
        <HomeScreen
          onStartSession={handleStartSession}
          onOpenSettings={() => setRoute('settings')}
          onOpenInfo={() => setRoute('info')}
        />
      );
  }

  return <AppLayout>{screen}</AppLayout>;
}
