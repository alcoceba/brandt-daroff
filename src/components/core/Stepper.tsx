import { memo } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/core/Button';

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

export const Stepper = memo(function Stepper({
  label,
  unit,
  description,
  icon,
  value,
  step,
  min,
  max,
  onChange,
}: StepperProps) {
  const clamp = (v: number) => Math.min(Math.max(v, min), max);
  return (
    <div className="rounded-xl border border-slate-700/80 bg-slate-800/80 p-4 backdrop-blur-sm shadow-sm">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0">{icon}</span>
        <div className="flex flex-col gap-0.5">
          <p className="text-base font-semibold text-white">{label}</p>
          {description && <p className="text-xs leading-relaxed text-slate-400">{description}</p>}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <Button
          size="icon"
          variant="secondary"
          aria-label="decrease"
          disabled={value <= min}
          onClick={() => onChange(clamp(value - step))}
        >
          <Minus size={24} />
        </Button>
        <span className="text-3xl font-bold tabular-nums text-white">
          {value}
          <span className="ml-1 text-base font-normal text-slate-400">{unit}</span>
        </span>
        <Button
          size="icon"
          variant="secondary"
          aria-label="increase"
          disabled={value >= max}
          onClick={() => onChange(clamp(value + step))}
        >
          <Plus size={24} />
        </Button>
      </div>
    </div>
  );
});
