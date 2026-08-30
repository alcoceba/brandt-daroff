import { memo, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
  let action: React.ReactNode = null;

  switch (step) {
    case 'language':
      screenContent = (
        <WizardLanguageStep
          selectedLanguage={selectedLanguage}
          detectedLanguage={detectedLanguage}
          storedLanguage={storedLanguage}
          onSelect={applyLanguage}
        />
      );
      action = (
        <button
          type="button"
          onClick={() => setStep('disclaimer')}
          className="flex min-h-touch w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 text-base font-bold text-white shadow-lg shadow-brand-500/20 transition-transform active:scale-[.99]"
        >
          {t('common.confirm')}
          <span className="animate-arrow-bounce">
            <ArrowRight size={18} />
          </span>
        </button>
      );
      break;
    case 'disclaimer':
      screenContent = <WizardDisclaimerStep />;
      action = (
        <button
          type="button"
          onClick={() => setStep('about')}
          className="flex min-h-touch w-full items-center justify-center gap-2 rounded-2xl bg-red-600 text-base font-bold text-white shadow-lg shadow-red-500/20 transition-transform active:scale-[.99]"
        >
          <Check size={18} />
          {t('wizard.disclaimerContinue')}
        </button>
      );
      break;
    case 'about':
      screenContent = <WizardAboutStep onTellMeMore={() => setStep('about-detail')} />;
      action = (
        <button
          type="button"
          onClick={() => setStep('choice')}
          className="flex min-h-touch w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 text-base font-bold text-slate-900 shadow-lg shadow-amber-500/25 transition-transform active:scale-[.99]"
        >
          {t('wizard.aboutContinue')}
          <span className="animate-arrow-bounce">
            <ArrowRight size={18} />
          </span>
        </button>
      );
      break;
    case 'about-detail':
      screenContent = <WizardAboutDetailStep />;
      action = (
        <button
          type="button"
          onClick={() => setStep('choice')}
          className="flex min-h-touch w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 text-base font-bold text-slate-900 shadow-lg shadow-amber-500/25 transition-transform active:scale-[.99]"
        >
          {t('wizard.letsStart')}
          <span className="animate-arrow-bounce">
            <ArrowRight size={18} />
          </span>
        </button>
      );
      break;
    case 'choice':
      screenContent = (
        <WizardChoiceStep
          selectedChoice={selectedChoice}
          isReconfigure={isReconfigure}
          isUsingDefaults={isUsingDefaults}
          onSelectChoice={selectChoice}
        />
      );
      action = (
        <button
          type="button"
          onClick={confirmChoice}
          disabled={selectedChoice === null}
          className="flex min-h-touch w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 text-base font-bold text-white shadow-lg shadow-brand-500/20 transition-transform active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isReconfigure ? t('common.confirm') : t('wizard.choiceConfirm')}
          <span className="animate-pulse-soft">
            <Sparkles size={18} />
          </span>
        </button>
      );
      break;
    case 'manual':
    default:
      screenContent = <WizardManualStep values={values} onChange={update} />;
      action = (
        <button
          type="button"
          onClick={save}
          className="flex min-h-touch w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 text-base font-bold text-white shadow-lg shadow-brand-500/20 transition-transform active:scale-[.99]"
        >
          <Check size={20} />
          {mode === 'reconfigure' ? t('wizard.saveOnly') : t('wizard.save')}
        </button>
      );
      break;
  }

  return (
    <WizardShell
      footer={footer}
      action={action}
      wide={step === 'about-detail' || step === 'manual'}
    >
      {screenContent}
    </WizardShell>
  );
});
