import { memo } from 'react';

interface StepDotsProps {
  steps: string[];
  current: string;
  activeClassName?: string;
  completedClassName?: string;
}

export const StepDots = memo(function StepDots({
  steps,
  current,
  activeClassName = 'bg-brand-500',
  completedClassName = 'bg-brand-500/60',
}: StepDotsProps) {
  const idx = steps.indexOf(current);
  if (idx === -1) return null;
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((s, i) => (
        <span
          key={s}
          className={`h-2 rounded-full transition-all duration-300 ease-out ${
            i === idx
              ? `w-6 ${activeClassName}`
              : i < idx
                ? `w-2 ${completedClassName}`
                : 'w-2 bg-slate-600'
          }`}
        />
      ))}
    </div>
  );
});
