import { memo } from 'react';
import { Minus, Plus } from 'lucide-react';

interface StepperProps {
  label: string;
  unit: string;
  description?: string;
  icon: React.ReactNode;
  value: number;
  step: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}

export const Stepper = memo(function Stepper({ label, unit, description, icon, value, step, min, max, onChange }: StepperProps) {
  const clamp = (v: number) => Math.min(Math.max(v, min), max);
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0">{icon}</span>
        <div className="flex flex-col gap-0.5">
          <p className="text-base font-semibold text-white">{label}</p>
          {description && <p className="text-xs leading-relaxed text-slate-400">{description}</p>}
        </div>
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
