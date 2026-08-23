import { memo, useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CalendarDays,
  Check,
  ChevronLeft,
  Clock,
  Coffee,
  Ear,
  Globe,
  Lightbulb,
  Move,
  Repeat,
  ShieldAlert,
  Sliders,
  Sparkles,
  Timer,
  TrendingUp,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import type { Language, TreatmentConfig } from '@/types';
import { DEFAULT_CONFIG } from '@/constants/treatment';
import { LANGUAGES } from '@/constants/languages';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { Stepper } from '@/components/core/Stepper';
import { StepDots } from '@/components/core/StepDots';
import { AboutStepCards } from '@/components/AboutStepCards';
import { FlagIcon } from '@/components/FlagIcon';

interface Field {
  key: keyof TreatmentConfig;
  labelKey: string;
  unitKey: string;
  descKey: string;
  icon: React.ReactNode;
  step: number;
  min: number;
  max: number;
}

const FIELDS: readonly Field[] = [
  { key: 'cyclesPerSession', labelKey: 'wizard.cyclesPerSession', unitKey: 'wizard.cycles', descKey: 'wizard.cyclesPerSessionDesc', icon: <Repeat size={20} className="text-brand-500" />, step: 1, min: 1, max: 10 },
  { key: 'sessionsPerDay', labelKey: 'wizard.sessionsPerDay', unitKey: 'wizard.sessions', descKey: 'wizard.sessionsPerDayDesc', icon: <CalendarDays size={20} className="text-brand-500" />, step: 1, min: 1, max: 6 },
  { key: 'totalDays', labelKey: 'wizard.totalDays', unitKey: 'wizard.days', descKey: 'wizard.totalDaysDesc', icon: <Calendar size={20} className="text-brand-500" />, step: 1, min: 1, max: 60 },
  { key: 'positionDuration', labelKey: 'wizard.positionDuration', unitKey: 'wizard.seconds', descKey: 'wizard.positionDurationDesc', icon: <Timer size={20} className="text-brand-500" />, step: 5, min: 5, max: 120 },
  { key: 'restBetweenPositions', labelKey: 'wizard.restBetweenPositions', unitKey: 'wizard.seconds', descKey: 'wizard.restBetweenPositionsDesc', icon: <Clock size={20} className="text-brand-500" />, step: 5, min: 0, max: 120 },
  { key: 'restBetweenCycles', labelKey: 'wizard.restBetweenCycles', unitKey: 'wizard.seconds', descKey: 'wizard.restBetweenCyclesDesc', icon: <Coffee size={20} className="text-brand-500" />, step: 15, min: 0, max: 600 },
] as const;

interface WizardScreenProps {
  onDone: () => void;
  onBack?: () => void;
  detectedLanguage?: Language;
  mode?: 'onboarding' | 'reconfigure';
}

type Step = 'language' | 'disclaimer' | 'about' | 'about-detail' | 'choice' | 'manual';

const ONBOARDING_STEPS: Step[] = ['language', 'disclaimer', 'about', 'choice'];

function OnboardingHeader({
  icon,
  title,
  subtitle,
  iconClassName = 'border-brand-500/40 bg-brand-500/15 shadow-brand-500/10',
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  iconClassName?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border shadow-lg ${iconClassName}`}>
        {icon}
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}

function InfoSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-sm font-bold text-white">{title}</h2>
      </div>
      <div className="mt-2 text-xs leading-relaxed text-slate-300">{children}</div>
    </div>
  );
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

  const isUsingDefaults = (Object.keys(DEFAULT_CONFIG) as (keyof TreatmentConfig)[]).every(
    (key) => storedConfig[key] === DEFAULT_CONFIG[key],
  );

  const isReconfigure = mode === 'reconfigure';
  const [step, setStep] = useState<Step>(isReconfigure ? 'choice' : 'language');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(detectedLanguage ?? storedLanguage);
  const [selectedChoice, setSelectedChoice] = useState<'defaults' | 'manual'>(() => 'defaults');
  const [values, setValues] = useState<TreatmentConfig>(() => ({ ...DEFAULT_CONFIG, ...storedConfig }));

  useEffect(() => {
    if (mode === 'onboarding') {
      const initial = detectedLanguage ?? storedLanguage;
      void i18n.changeLanguage(initial);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const confirmChoice = () => {
    if (selectedChoice === 'defaults') {
      chooseDefaults();
    } else if (selectedChoice === 'manual') {
      setStep('manual');
    }
  };

  const dotsCurrent: Step = step === 'about-detail' ? 'about' : step;
  const dotsActiveClass =
    dotsCurrent === 'disclaimer' ? 'bg-red-500' : dotsCurrent === 'about' ? 'bg-amber-400' : 'bg-brand-500';
  const dotsCompletedClassName =
    dotsCurrent === 'disclaimer'
      ? 'bg-red-500/60'
      : dotsCurrent === 'about'
        ? 'bg-amber-400/60'
        : 'bg-brand-500/60';

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
      case 'choice':
        setStep('disclaimer');
        break;
      case 'about-detail':
        setStep('about');
        break;
      case 'manual':
        setStep('choice');
        break;
      default:
        break;
    }
  };

  const wizardFooter = (
    <div className="flex items-center gap-3">
      {step !== 'language' && (
        <button
          type="button"
          onClick={handleBack}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          aria-label={t('common.back')}
        >
          <ChevronLeft size={24} />
        </button>
      )}
      {!isReconfigure && (
        <div className="flex-1">
          <StepDots
            steps={ONBOARDING_STEPS}
            current={dotsCurrent}
            activeClassName={dotsActiveClass}
            completedClassName={dotsCompletedClassName}
          />
        </div>
      )}
    </div>
  );

  const preferredLanguage = detectedLanguage ?? storedLanguage;
  const sortedLanguages = [
    ...LANGUAGES.filter((l) => l.code === preferredLanguage),
    ...LANGUAGES.filter((l) => l.code !== preferredLanguage),
  ];

  if (step === 'language') {
    return (
      <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col gap-6 px-3 py-6 sm:px-6">
        <div className="flex flex-1 flex-col justify-center gap-6">
          <OnboardingHeader
            icon={<Globe size={28} className="text-brand-500" />}
            title={t('language.title')}
            subtitle={t('language.subtitle')}
          />
          <ul className="flex flex-col gap-3">
            {sortedLanguages.map(({ code, label }) => {
              const active = code === selectedLanguage;
              return (
                <li key={code}>
                  <button
                    type="button"
                    onClick={() => applyLanguage(code)}
                    className={`flex w-full min-h-touch items-center gap-4 rounded-xl border px-4 text-lg font-semibold transition-all active:scale-[.99] ${
                      active ? 'border-brand-500 bg-brand-600/20 text-white' : 'border-slate-700 bg-slate-800 text-white'
                    }`}
                  >
                    <FlagIcon code={code} className="h-7 w-10 shrink-0 overflow-hidden rounded shadow" />
                    <span className="flex-1 text-left">{label}</span>
                    {active && <Check size={18} className="text-brand-500" />}
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={() => { applyLanguage(selectedLanguage); setStep('disclaimer'); }}
            className="flex min-h-touch w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 text-base font-bold text-white shadow-lg shadow-brand-500/20 transition-transform active:scale-[.99]"
          >
            {t('common.confirm')}
            <span className="animate-arrow-bounce">
              <ArrowRight size={18} />
            </span>
          </button>
        </div>
        {wizardFooter}
      </div>
    );
  }

  if (step === 'disclaimer') {
    return (
      <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col gap-6 px-3 py-6 sm:px-6">
        <div className="flex flex-1 flex-col justify-center gap-6">
          <OnboardingHeader
            icon={<ShieldAlert size={32} className="text-red-500" />}
            title={t('wizard.disclaimerTitle')}
            subtitle={t('wizard.disclaimerSubtitle')}
            iconClassName="border-red-500/40 bg-red-500/15 shadow-red-500/10"
          />
          <div className="flex flex-col gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
            <p className="text-sm leading-relaxed text-red-200/90">{t('wizard.disclaimerBody')}</p>
            <p className="text-sm leading-relaxed text-red-200/90">{t('wizard.disclaimerBody2')}</p>
          </div>
          <p className="text-center text-xs text-slate-500">{t('footer.privacyNote')}</p>
          <button
            type="button"
            onClick={() => setStep('about')}
            className="flex min-h-touch w-full items-center justify-center gap-2 rounded-2xl bg-red-600 text-base font-bold text-white shadow-lg shadow-red-500/20 transition-transform active:scale-[.99]"
          >
            <Check size={18} />
            {t('wizard.disclaimerContinue')}
          </button>
        </div>
        {wizardFooter}
      </div>
    );
  }

  if (step === 'about') {
    return (
      <div className="mx-auto flex w-full max-w-none flex-1 flex-col gap-6 px-3 py-6 sm:px-6">
        <div className="flex flex-1 flex-col justify-center gap-6">
          <OnboardingHeader
            icon={<BookOpen size={28} className="text-amber-400" />}
            title={t('info.title')}
            subtitle={t('wizard.aboutSubtitle')}
            iconClassName="border-amber-500/40 bg-amber-500/15 shadow-amber-500/10"
          />
          <AboutStepCards />
          <div className="mx-auto flex w-full max-w-[480px] flex-col gap-3">
            <button
              type="button"
              onClick={() => setStep('about-detail')}
              className="flex min-h-touch w-full items-center justify-center gap-2 rounded-2xl border border-amber-500/50 bg-amber-600/10 text-base font-bold text-amber-300 transition-transform active:scale-[.99]"
            >
              <BookOpen size={18} className="text-amber-400" />
              {t('wizard.tellMeMore')}
            </button>
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
          </div>
        </div>
        {wizardFooter}
      </div>
    );
  }

  if (step === 'about-detail') {
    return (
      <div className="mx-auto flex w-full max-w-none flex-1 flex-col gap-4 px-3 py-6 sm:px-6">
        <h1 className="text-xl font-bold text-white">{t('info.title')}</h1>
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto pb-2">
          <AboutStepCards />
          <InfoSection icon={<Ear size={18} className="text-blue-400" />} title={t('info.whatIsVPPBTitle')}>
            <p>{t('info.whatIsVPPBBody')}</p>
          </InfoSection>
          <InfoSection icon={<Move size={18} className="text-brand-500" />} title={t('info.whatIsMethodTitle')}>
            <p>{t('info.whatIsMethodBody')}</p>
          </InfoSection>
          <InfoSection icon={<Clock size={18} className="text-amber-400" />} title={t('info.cycleTitle')}>
            <p className="mb-2">{t('info.cycleIntro')}</p>
            <ol className="flex flex-col gap-1.5 pl-4">
              <li className="list-decimal">{t('info.step1')}</li>
              <li className="list-decimal">{t('info.step2')}</li>
              <li className="list-decimal">{t('info.step3')}</li>
              <li className="list-decimal">{t('info.step4')}</li>
              <li className="list-decimal">{t('info.step5')}</li>
            </ol>
          </InfoSection>
          <InfoSection icon={<CalendarDays size={18} className="text-purple-400" />} title={t('info.frequencyTitle')}>
            <p>{t('info.frequencyBody')}</p>
          </InfoSection>
          <InfoSection icon={<Lightbulb size={18} className="text-yellow-400" />} title={t('info.tipsTitle')}>
            <p>{t('info.tipsBody')}</p>
          </InfoSection>
          <InfoSection icon={<TrendingUp size={18} className="text-brand-500" />} title={t('info.effectivenessTitle')}>
            <p>{t('info.effectivenessBody')}</p>
          </InfoSection>
        </div>
        <button
          type="button"
          onClick={() => setStep('choice')}
          className="flex min-h-touch w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-amber-500 text-base font-bold text-slate-900 shadow-lg shadow-amber-500/25 transition-transform active:scale-[.99]"
        >
          {t('wizard.letsStart')}
          <span className="animate-arrow-bounce">
            <ArrowRight size={18} />
          </span>
        </button>
        {wizardFooter}
      </div>
    );
  }

  if (step === 'choice') {
    const confirmLabel = isReconfigure ? t('common.confirm') : t('wizard.choiceConfirm');
    return (
      <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col justify-center gap-6 px-3 py-6 sm:px-6">
        <div className="flex flex-1 flex-col justify-center gap-6">
          <OnboardingHeader
            icon={
              isReconfigure
                ? <Sliders size={28} className="text-brand-500" />
                : <Sparkles size={28} className="text-brand-500" />
            }
            title={isReconfigure ? t('wizard.reconfigureTitle') : t('wizard.choiceTitle')}
            subtitle={t(isReconfigure ? 'wizard.reconfigureSubtitle' : 'wizard.choiceSubtitle')}
          />
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setSelectedChoice('defaults')}
              className={`flex min-h-touch w-full items-center gap-4 rounded-xl border p-5 text-left transition-all active:scale-[.99] ${
                selectedChoice === 'defaults'
                  ? 'border-brand-500 bg-brand-600/20'
                  : 'border-slate-700 bg-slate-800'
              }`}
            >
              <div className="flex flex-1 flex-col">
                <span className="flex items-center gap-2 text-lg font-bold text-white">
                  {t('wizard.defaults')}
                  {isUsingDefaults && isReconfigure && (
                    <span className="rounded-full bg-brand-600/20 px-2 py-0.5 text-xs font-medium text-brand-500">
                      {t('wizard.usingNow')}
                    </span>
                  )}
                </span>
                <span className="text-sm text-slate-300">{t('wizard.defaultsDesc')}</span>
              </div>
              {selectedChoice === 'defaults' && <Check size={22} className="shrink-0 text-brand-500" />}
            </button>
          <button
            type="button"
            onClick={() => setStep('manual')}
            className={`flex min-h-touch w-full items-center gap-4 rounded-xl border p-5 text-left transition-all active:scale-[.99] ${
              selectedChoice === 'manual'
                ? 'border-brand-500 bg-brand-600/20'
                : 'border-slate-700 bg-slate-800'
            }`}
          >
              <div className="flex flex-1 flex-col">
                <span className="flex items-center gap-2 text-lg font-bold text-white">
                  {t('wizard.manual')}
                  {!isUsingDefaults && isReconfigure && (
                    <span className="rounded-full bg-brand-600/20 px-2 py-0.5 text-xs font-medium text-brand-500">
                      {t('wizard.usingNow')}
                    </span>
                  )}
                </span>
                <span className="text-sm text-slate-300">{t('wizard.manualDesc')}</span>
              </div>
              {selectedChoice === 'manual' && <Check size={22} className="shrink-0 text-brand-500" />}
            </button>
          </div>
          <button
            type="button"
            onClick={confirmChoice}
            disabled={selectedChoice === null}
            className="flex min-h-touch w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 text-base font-bold text-white shadow-lg shadow-brand-500/20 transition-transform active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {confirmLabel}
            <span className="animate-pulse-soft">
              <Sparkles size={18} />
            </span>
          </button>
        </div>
        {wizardFooter}
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col gap-5 px-3 py-6 sm:px-6">
      <h1 className="text-xl font-bold text-white">{t('wizard.manualTitle')}</h1>
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
        {FIELDS.map((field) => (
          <Stepper
            key={field.key}
            label={t(field.labelKey)}
            unit={t(field.unitKey)}
            description={t(field.descKey)}
            icon={field.icon}
            value={values[field.key]}
            step={field.step}
            min={field.min}
            max={field.max}
            onChange={(v) => update(field.key, v)}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={save}
        className="flex min-h-touch w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 text-base font-bold text-white shadow-lg shadow-brand-500/20 transition-transform active:scale-[.99]"
      >
        <Check size={20} />
        {mode === 'reconfigure' ? t('wizard.saveOnly') : t('wizard.save')}
      </button>
    </div>
  );
});
