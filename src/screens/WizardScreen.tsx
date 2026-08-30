import { memo, useEffect, useMemo, useState } from 'react';
import i18n from '@/i18n';
import type { Language, TreatmentConfig } from '@/types';
import { DEFAULT_CONFIG } from '@/constants/treatment';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { WizardAboutDetailStep } from '@/components/wizard/WizardAboutDetailStep';
import { WizardAboutStep } from '@/components/wizard/WizardAboutStep';
import { WizardChoiceStep } from '@/components/wizard/WizardChoiceStep';
import { WizardDisclaimerStep } from '@/components/wizard/WizardDisclaimerStep';
import { ProgressIndicator } from '@/components/core/ProgressIndicator';
import { WizardLanguageStep } from '@/components/wizard/WizardLanguageStep';
import { WizardManualStep } from '@/components/wizard/WizardManualStep';
import { WizardShell } from '@/components/wizard/WizardShell';
interface WizardScreenProps {
  onDone: () => void;
  onBack?: () => void;
  detectedLanguage?: Language;
  mode?: 'onboarding' | 'reconfigure';
}

type Step = 'language' | 'disclaimer' | 'about' | 'about-detail' | 'choice' | 'manual';

const ONBOARDING_STEPS: Step[] = ['language', 'disclaimer', 'about', 'choice'];

function getDotsColor(step: Step) {
  if (step === 'disclaimer') {
    return { active: 'bg-red-500', completed: 'bg-red-500/60' };
  }
  if (step === 'about' || step === 'about-detail') {
    return { active: 'bg-amber-400', completed: 'bg-amber-400/60' };
  }
  return { active: 'bg-brand-500', completed: 'bg-brand-500/60' };
}

export const WizardScreen = memo(function WizardScreen({
  onDone,
  onBack: _onBack,
  detectedLanguage,
  mode = 'onboarding',
}: WizardScreenProps) {
  const setConfig = useTreatmentStore((s) => s.setConfig);
  const completeOnboarding = useTreatmentStore((s) => s.completeOnboarding);
  const storedConfig = useTreatmentStore((s) => s.config);
  const storedLanguage = useTreatmentStore((s) => s.language);
  const setLanguage = useTreatmentStore((s) => s.setLanguage);

  const isReconfigure = mode === 'reconfigure';

  const isUsingDefaults = useMemo(
    () => (Object.keys(DEFAULT_CONFIG) as (keyof TreatmentConfig)[]).every(
      (key) => storedConfig[key] === DEFAULT_CONFIG[key],
    ),
    [storedConfig],
  );

  const [step, setStep] = useState<Step>(isReconfigure ? 'choice' : 'language');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(detectedLanguage ?? storedLanguage);
  const [selectedChoice, setSelectedChoice] = useState<'defaults' | 'manual'>('defaults');
  const [values, setValues] = useState<TreatmentConfig>(() => ({ ...DEFAULT_CONFIG, ...storedConfig }));

  useEffect(() => {
    if (mode === 'onboarding') {
      const initial = detectedLanguage ?? storedLanguage;
      void i18n.changeLanguage(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let dotsCurrent: Step = step;
  if (step === 'about-detail') dotsCurrent = 'about';
  if (step === 'manual') dotsCurrent = 'choice';

  const dotsColors = getDotsColor(dotsCurrent);

  const applyLanguage = (code: Language) => {
    setSelectedLanguage(code);
    setLanguage(code);
    void i18n.changeLanguage(code);
  };

  const chooseDefaults = () => {
    setConfig(DEFAULT_CONFIG);
    completeOnboarding();
    onDone();
  };

  const update = (key: keyof TreatmentConfig, raw: number) => {
    setValues((prev) => ({ ...prev, [key]: raw }));
  };

  const save = () => {
    setConfig(values);
    completeOnboarding();
    onDone();
  };

  const selectChoice = (choice: 'defaults' | 'manual') => {
    setSelectedChoice(choice);
    if (choice === 'manual') {
      setStep('manual');
    }
  };

  const confirmChoice = () => {
    if (selectedChoice === 'defaults') {
      chooseDefaults();
    } else if (selectedChoice === 'manual') {
      setStep('manual');
    }
  };

  const handleBack = () => {
    if (isReconfigure) {
      if (step === 'choice') {
        _onBack?.();
      } else if (step === 'manual') {
        setStep('choice');
      }
      return;
    }

    switch (step) {
      case 'disclaimer':
        setStep('language');
        break;
      case 'about':
        setStep('disclaimer');
        break;
      case 'about-detail':
        setStep('about');
        break;
      case 'choice':
        setStep('about');
        break;
      case 'manual':
        setStep('choice');
        setSelectedChoice('defaults');
        break;
      default:
        break;
    }
  };

  const footer = (
    <ProgressIndicator
      showBack={step !== 'language'}
      showProgress={!isReconfigure}
      onBack={handleBack}
      steps={ONBOARDING_STEPS}
      current={dotsCurrent}
      activeClassName={dotsColors.active}
      completedClassName={dotsColors.completed}
    />
  );

  let screenContent: React.ReactNode;
  switch (step) {
    case 'language':
      screenContent = (
        <WizardLanguageStep
          selectedLanguage={selectedLanguage}
          detectedLanguage={detectedLanguage}
          storedLanguage={storedLanguage}
          onSelect={applyLanguage}
          onConfirm={() => setStep('disclaimer')}
        />
      );
      break;
    case 'disclaimer':
      screenContent = <WizardDisclaimerStep onContinue={() => setStep('about')} />;
      break;
    case 'about':
      screenContent = (
        <WizardAboutStep
          onTellMeMore={() => setStep('about-detail')}
          onStart={() => setStep('choice')}
        />
      );
      break;
    case 'about-detail':
      screenContent = <WizardAboutDetailStep onStart={() => setStep('choice')} />;
      break;
    case 'choice':
      screenContent = (
        <WizardChoiceStep
          selectedChoice={selectedChoice}
          isReconfigure={isReconfigure}
          isUsingDefaults={isUsingDefaults}
          onSelectChoice={selectChoice}
          onConfirm={confirmChoice}
        />
      );
      break;
    case 'manual':
    default:
      screenContent = (
        <WizardManualStep values={values} mode={mode} onChange={update} onSave={save} />
      );
      break;
  }

  return (
    <WizardShell
      footer={footer}
      wide={step === 'about-detail' || step === 'manual'}
    >
      {screenContent}
    </WizardShell>
  );
});
