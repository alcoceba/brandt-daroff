import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { ReconfigureScreen } from '@/screens/ReconfigureScreen';
import i18n from '@/i18n';
import type { Language, Route } from '@/types';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { WizardScreen } from '@/screens/WizardScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { CycleSessionScreen } from '@/screens/CycleSessionScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { InfoScreen } from '@/screens/InfoScreen';
import { SplashScreen } from '@/screens/SplashScreen';
import { ReadyScreen } from '@/screens/ReadyScreen';
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

  const navigateTo = (next: Route) => {
    if ('startViewTransition' in document && document.startViewTransition) {
      document.startViewTransition(() => flushSync(() => setRoute(next)));
      return;
    }
    setRoute(next);
  };

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
    navigateTo('cycle');
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
      screen = (
        <WizardScreen
          mode="onboarding"
          detectedLanguage={detectLanguage()}
          onDone={() => navigateTo('ready')}
        />
      );
      break;
    case 'ready':
      screen = <ReadyScreen onDone={() => navigateTo('home')} />;
      break;
    case 'cycle':
      screen = sessionId ? (
        <CycleSessionScreen sessionId={sessionId} onExit={() => navigateTo('home')} />
      ) : (
        <HomeScreen
          onStartSession={handleStartSession}
          onOpenSettings={() => navigateTo('settings')}
          onOpenInfo={() => navigateTo('info')}
        />
      );
      break;
    case 'settings':
      screen = (
        <SettingsScreen
          onBack={() => navigateTo('home')}
          onReconfigure={() => navigateTo('reconfigure')}
          onFullReset={() => navigateTo('wizard')}
        />
      );
      break;
    case 'reconfigure':
      screen = <ReconfigureScreen onBack={() => navigateTo('settings')} />;
      break;
    case 'info':
      screen = <InfoScreen onBack={() => navigateTo('home')} />;
      break;
    case 'home':
    default:
      screen = (
        <HomeScreen
          onStartSession={handleStartSession}
          onOpenSettings={() => navigateTo('settings')}
          onOpenInfo={() => navigateTo('info')}
        />
      );
  }

  return <AppLayout hideFooter={route === 'wizard' || route === 'ready'}>{screen}</AppLayout>;
}
