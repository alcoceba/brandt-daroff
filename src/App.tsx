import { useEffect, useState } from 'react';
import i18n from '@/i18n';
import type { Language, Route } from '@/types';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { WizardScreen } from '@/screens/WizardScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { CycleSessionScreen } from '@/screens/CycleSessionScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { InfoScreen } from '@/screens/InfoScreen';
import { SplashScreen } from '@/screens/SplashScreen';
import { AppLayout } from '@/layouts/AppLayout';
import { DevScenariosScreen } from '@/screens/DevScenariosScreen';

function detectLanguage(): Language {
  const lang = (navigator.language ?? '').toLowerCase();
  if (lang.startsWith('ca')) return 'ca';
  if (lang.startsWith('es')) return 'es';
  return 'en';
}

export default function App() {
  const language = useTreatmentStore((s) => s.language);
  const onboardingComplete = useTreatmentStore((s) => s.onboardingComplete);

  const [splashDone, setSplashDone] = useState(false);
  const [route, setRoute] = useState<Route>(onboardingComplete ? 'home' : 'wizard');
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    void i18n.changeLanguage(language);
    document.documentElement.lang = language;
  }, [language]);

  const handleStartSession = (id: string) => {
    setSessionId(id);
    setRoute('cycle');
  };

  const showDevScenarios =
    import.meta.env.DEV && new URLSearchParams(window.location.search).get('dev') === 'scenarios';

  if (showDevScenarios) {
    return (
      <AppLayout>
        <DevScenariosScreen />
      </AppLayout>
    );
  }

  if (!splashDone) {
    return (
      <AppLayout hideFooter>
        <SplashScreen />
      </AppLayout>
    );
  }

  let screen: React.ReactNode;
  switch (route) {
    case 'wizard':
      screen = onboardingComplete ? (
        <WizardScreen
          mode="reconfigure"
          onDone={() => setRoute('home')}
          onBack={() => setRoute('settings')}
        />
      ) : (
        <WizardScreen
          mode="onboarding"
          detectedLanguage={detectLanguage()}
          onDone={() => setRoute('home')}
        />
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
          onFullReset={() => setRoute('wizard')}
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

  return <AppLayout hideFooter={route === 'wizard'}>{screen}</AppLayout>;
}
