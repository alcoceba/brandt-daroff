import { memo } from 'react';
import { Calendar, CalendarDays, Clock, Coffee, Repeat, Timer } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { TreatmentConfig } from '@/types';
import { Stepper } from '@/components/core/Stepper';

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

export const FIELDS: readonly Field[] = [
  {
    key: 'cyclesPerSession',
    labelKey: 'wizard.cyclesPerSession',
    unitKey: 'wizard.cycles',
    descKey: 'wizard.cyclesPerSessionDesc',
    icon: <Repeat size={20} className="text-brand-500" />,
    step: 1,
    min: 1,
    max: 10,
  },
  {
    key: 'sessionsPerDay',
    labelKey: 'wizard.sessionsPerDay',
    unitKey: 'wizard.sessions',
    descKey: 'wizard.sessionsPerDayDesc',
    icon: <CalendarDays size={20} className="text-brand-500" />,
    step: 1,
    min: 1,
    max: 6,
  },
  {
    key: 'totalDays',
    labelKey: 'wizard.totalDays',
    unitKey: 'wizard.days',
    descKey: 'wizard.totalDaysDesc',
    icon: <Calendar size={20} className="text-brand-500" />,
    step: 1,
    min: 1,
    max: 60,
  },
  {
    key: 'positionDuration',
    labelKey: 'wizard.positionDuration',
    unitKey: 'wizard.seconds',
    descKey: 'wizard.positionDurationDesc',
    icon: <Timer size={20} className="text-brand-500" />,
    step: 5,
    min: 5,
    max: 120,
  },
  {
    key: 'restBetweenPositions',
    labelKey: 'wizard.restBetweenPositions',
    unitKey: 'wizard.seconds',
    descKey: 'wizard.restBetweenPositionsDesc',
    icon: <Clock size={20} className="text-brand-500" />,
    step: 5,
    min: 0,
    max: 120,
  },
  {
    key: 'restBetweenCycles',
    labelKey: 'wizard.restBetweenCycles',
    unitKey: 'wizard.seconds',
    descKey: 'wizard.restBetweenCyclesDesc',
    icon: <Coffee size={20} className="text-brand-500" />,
    step: 15,
    min: 0,
    max: 600,
  },
] as const;

interface TreatmentSettingsFormProps {
  values: TreatmentConfig;
  onChange: (key: keyof TreatmentConfig, value: number) => void;
}

export const TreatmentSettingsForm = memo(function TreatmentSettingsForm({
  values,
  onChange,
}: TreatmentSettingsFormProps) {
  const { t } = useTranslation();

  return (
    <>
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
          onChange={(v) => onChange(field.key, v)}
        />
      ))}
    </>
  );
});
