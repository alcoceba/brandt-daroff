import { memo, useState } from 'react';
import { ArrowLeft, Check, Info, Minus, Plus, ShieldAlert, Sliders } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { TreatmentConfig } from '@/types';
import { DEFAULT_CONFIG } from '@/store/useTreatmentStore';
import { useTreatmentStore } from '@/store/useTreatmentStore';

interface Field {
  key: keyof TreatmentConfig;
  labelKey: string;
  unitKey: string;
  step: number;
  min: number;
  max: number;
}

const FIELDS: readonly Field[] = [
  { key: 'positionDuration', labelKey: 'wizard.positionDuration', unitKey: 'wizard.seconds', step: 5, min: 5, max: 120 },
  { key: 'restBetweenPositions', labelKey: 'wizard.restBetweenPositions', unitKey: 'wizard.seconds', step: 5, min: 0, max: 120 },
  { key: 'restBetweenCycles', labelKey: 'wizard.restBetweenCycles', unitKey: 'wizard.seconds', step: 15, min: 30, max: 600 },
  { key: 'sessionsPerDay', labelKey: 'wizard.sessionsPerDay', unitKey: 'wizard.sessions', step: 1, min: 1, max: 6 },
  { key: 'totalDays', labelKey: 'wizard.totalDays', unitKey: 'wizard.days', step: 1, min: 1, max: 60 },
] as const;

interface WizardProps {
  onDone: () => void;
  onBack?: () => void;
  mode?: 'onboarding' | 'reconfigure';
}

interface StepperProps {
  label: string;
  unit: string;
  value: number;
  step: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}

const Stepper = memo(function Stepper({ label, unit, value, step, min, max, onChange }: StepperProps) {
  const clamp = (v: number) => Math.min(Math.max(v, min), max);
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
      <p className="text-base font-semibold text-white">{label}</p>
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
    return (
      <div className="flex min-h-dvh flex-col justify-center p-6">
        {isReconfigure && onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label={t('common.back')}
            className="mb-4 grid min-h-touch min-w-touch place-items-center self-start rounded-lg border border-slate-700 text-white"
          >
            <ArrowLeft size={22} />
          </button>
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
            className="flex min-h-touch flex-col items-start gap-1 rounded-xl border border-brand-500 bg-brand-600/10 p-5 text-left active:scale-[.99]"
          >
            <span className="flex items-center gap-2 text-lg font-bold text-white">
              <Check size={22} className="text-brand-500" />
              {t('wizard.defaults')}
            </span>
            <span className="text-sm text-slate-300">{t('wizard.defaultsDesc')}</span>
          </button>
          <button
            type="button"
            onClick={() => setStep('manual')}
            className="flex min-h-touch flex-col items-start gap-1 rounded-xl border border-slate-700 bg-slate-800 p-5 text-left active:scale-[.99]"
          >
            <span className="flex items-center gap-2 text-lg font-bold text-white">
              <Sliders size={22} className="text-slate-300" />
              {t('wizard.manual')}
            </span>
            <span className="text-sm text-slate-300">{t('wizard.manualDesc')}</span>
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

  return (
    <div className="flex min-h-dvh flex-col p-6">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setStep('choice')}
          aria-label={t('common.back')}
          className="grid min-h-touch min-w-touch place-items-center rounded-lg border border-slate-700 text-white"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold text-white">{t('wizard.manualTitle')}</h1>
      </header>
      <div className="mt-5 flex flex-1 flex-col gap-3 overflow-y-auto">
        {FIELDS.map((field) => (
          <Stepper
            key={field.key}
            label={t(field.labelKey)}
            unit={t(field.unitKey)}
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
          {t('wizard.save')}
        </button>
      </div>
    </div>
  );
});
