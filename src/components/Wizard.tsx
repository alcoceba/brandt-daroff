import { memo, useState } from 'react';
import { Check, Info, Minus, Plus, ShieldAlert, Sliders } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { TreatmentConfig } from '@/types';
import { DEFAULT_CONFIG } from '@/store/useTreatmentStore';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { BackButton } from '@/components/BackButton';

interface Field {
  key: keyof TreatmentConfig;
  labelKey: string;
  unitKey: string;
  descKey: string;
  step: number;
  min: number;
  max: number;
}

const FIELDS: readonly Field[] = [
  { key: 'cyclesPerSession', labelKey: 'wizard.cyclesPerSession', unitKey: 'wizard.cycles', descKey: 'wizard.cyclesPerSessionDesc', step: 1, min: 1, max: 10 },
  { key: 'sessionsPerDay', labelKey: 'wizard.sessionsPerDay', unitKey: 'wizard.sessions', descKey: 'wizard.sessionsPerDayDesc', step: 1, min: 1, max: 6 },
  { key: 'totalDays', labelKey: 'wizard.totalDays', unitKey: 'wizard.days', descKey: 'wizard.totalDaysDesc', step: 1, min: 1, max: 60 },
  { key: 'positionDuration', labelKey: 'wizard.positionDuration', unitKey: 'wizard.seconds', descKey: 'wizard.positionDurationDesc', step: 5, min: 5, max: 120 },
  { key: 'restBetweenPositions', labelKey: 'wizard.restBetweenPositions', unitKey: 'wizard.seconds', descKey: 'wizard.restBetweenPositionsDesc', step: 5, min: 0, max: 120 },
  { key: 'restBetweenCycles', labelKey: 'wizard.restBetweenCycles', unitKey: 'wizard.seconds', descKey: 'wizard.restBetweenCyclesDesc', step: 15, min: 30, max: 600 },
] as const;

interface WizardProps {
  onDone: () => void;
  onBack?: () => void;
  mode?: 'onboarding' | 'reconfigure';
}

interface StepperProps {
  label: string;
  unit: string;
  description?: string;
  value: number;
  step: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}

const Stepper = memo(function Stepper({ label, unit, description, value, step, min, max, onChange }: StepperProps) {
  const clamp = (v: number) => Math.min(Math.max(v, min), max);
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
      <div className="flex flex-col gap-0.5">
        <p className="text-base font-semibold text-white">{label}</p>
        {description && <p className="text-xs leading-relaxed text-slate-400">{description}</p>}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          type="button"
          aria-label="decrease"
          onClick={() => onChange(clamp(value - step))}
          className="grid min-h-touch min-w-touch place-items-center rounded-lg bg-slate-700 text-white"
        >
          <Minus size={24} />
        </button>
        <span className="text-3xl font-bold tabular-nums text-white">
          {value}
          <span className="ml-1 text-base font-normal text-slate-400">{unit}</span>
        </span>
        <button
          type="button"
          aria-label="increase"
          onClick={() => onChange(clamp(value + step))}
          className="grid min-h-touch min-w-touch place-items-center rounded-lg bg-slate-700 text-white"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
});

type Step = 'choice' | 'manual';

export const Wizard = memo(function Wizard({ onDone, onBack, mode = 'onboarding' }: WizardProps) {
  const { t } = useTranslation();
  const setConfig = useTreatmentStore((s) => s.setConfig);
  const completeOnboarding = useTreatmentStore((s) => s.completeOnboarding);
  const storedConfig = useTreatmentStore((s) => s.config);
  const currentMode = useTreatmentStore((s) => s.mode);
  const [step, setStep] = useState<Step>('choice');
  const [values, setValues] = useState<TreatmentConfig>(() => ({ ...DEFAULT_CONFIG, ...storedConfig }));

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

  if (step === 'choice') {
    const isReconfigure = mode === 'reconfigure';
    const isUsingDefaults = (Object.keys(DEFAULT_CONFIG) as (keyof TreatmentConfig)[]).every(
      (key) => storedConfig[key] === DEFAULT_CONFIG[key],
    );
    return (
      <div className="flex min-h-dvh flex-col justify-center p-6">
        {isReconfigure && onBack && (
          <BackButton onBack={onBack} className="mb-4 self-start" />
        )}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">
            {isReconfigure ? t('wizard.reconfigureTitle') : `👋 ${t('wizard.choiceTitle')}`}
          </h1>
          <p className="mt-2 text-slate-300">
            {t(isReconfigure ? 'wizard.reconfigureSubtitle' : 'wizard.choiceSubtitle')}
          </p>
        </div>

        <div className="mt-8 flex flex-1 flex-col gap-3">
          <button
            type="button"
            onClick={chooseDefaults}
            className="flex min-h-touch w-full flex-col items-start gap-1 rounded-xl border border-brand-500 bg-brand-600/10 p-5 text-left active:scale-[.99]"
          >
            <span className="flex w-full items-center justify-between gap-2 text-lg font-bold text-white">
              <span className="flex items-center gap-2">
                <Check size={22} className="text-brand-500" />
                {t('wizard.defaults')}
              </span>
              {isUsingDefaults && isReconfigure && (
                <span className="hidden sm:flex items-center gap-1 text-xs font-medium text-brand-500">
                  <Check size={14} />
                  {t('wizard.usingNow')}
                </span>
              )}
            </span>
            <span className="text-sm text-slate-300">{t('wizard.defaultsDesc')}</span>
            {isUsingDefaults && isReconfigure && (
              <span className="flex sm:hidden items-center gap-1 text-xs font-medium text-brand-500">
                <Check size={14} />
                {t('wizard.usingNow')}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setStep('manual')}
            className="flex min-h-touch w-full flex-col items-start gap-1 rounded-xl border border-slate-700 bg-slate-800 p-5 text-left active:scale-[.99]"
          >
            <span className="flex w-full items-center justify-between gap-2 text-lg font-bold text-white">
              <span className="flex items-center gap-2">
                <Sliders size={22} className="text-slate-300" />
                {t('wizard.manual')}
              </span>
              {!isUsingDefaults && isReconfigure && (
                <span className="hidden sm:flex items-center gap-1 text-xs font-medium text-brand-500">
                  <Check size={14} />
                  {t('wizard.usingNow')}
                </span>
              )}
            </span>
            <span className="text-sm text-slate-300">{t('wizard.manualDesc')}</span>
            {!isUsingDefaults && isReconfigure && (
              <span className="flex sm:hidden items-center gap-1 text-xs font-medium text-brand-500">
                <Check size={14} />
                {t('wizard.usingNow')}
              </span>
            )}
          </button>
        </div>

        {!isReconfigure && (
          <div className="mt-5 flex flex-col gap-3">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <div className="flex items-center gap-2">
                <ShieldAlert size={18} className="shrink-0 text-amber-400" />
                <h2 className="text-sm font-bold text-amber-300">{t('wizard.disclaimerTitle')}</h2>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-amber-200/90">{t('wizard.disclaimerBody')}</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
              <div className="flex items-center gap-2">
                <Info size={18} className="shrink-0 text-brand-500" />
                <h2 className="text-sm font-bold text-white">{t('wizard.introTitle')}</h2>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">{t('wizard.introBody')}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  const visibleFields = currentMode === 'quick'
    ? FIELDS.filter((f) => f.key !== 'sessionsPerDay' && f.key !== 'totalDays')
    : FIELDS;

  return (
    <div className="flex min-h-dvh flex-col p-6">
      <header className="flex items-center gap-3">
        <BackButton onBack={() => setStep('choice')} />
        <h1 className="text-xl font-bold text-white">{t('wizard.manualTitle')}</h1>
      </header>
      <div className="mt-5 flex flex-1 flex-col gap-3 overflow-y-auto">
        {visibleFields.map((field) => (
          <Stepper
            key={field.key}
            label={t(field.labelKey)}
            unit={t(field.unitKey)}
            description={t(field.descKey)}
            value={values[field.key]}
            step={field.step}
            min={field.min}
            max={field.max}
            onChange={(v) => update(field.key, v)}
          />
        ))}
      </div>
      <div className="mt-5">
        <button
          type="button"
          onClick={save}
          className="min-h-touch w-full rounded-xl bg-brand-600 text-lg font-bold text-white"
        >
          {mode === 'reconfigure' ? t('wizard.saveOnly') : t('wizard.save')}
        </button>
      </div>
    </div>
  );
});
