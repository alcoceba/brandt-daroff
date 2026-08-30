import { memo } from 'react';
import { ArrowRight, Pause, Play } from 'lucide-react';

interface CycleControlsProps {
  isTransition: boolean;
  isRunning: boolean;
  startLabel: string;
  pauseLabel: string;
  resumeLabel: string;
  nextLabel: string;
  onAdvance: () => void;
  onAdvanceSkip: () => void;
  onPauseResume: () => void;
}

export const CycleControls = memo(function CycleControls({
  isTransition,
  isRunning,
  startLabel,
  pauseLabel,
  resumeLabel,
  nextLabel,
  onAdvance,
  onAdvanceSkip,
  onPauseResume,
}: CycleControlsProps) {
  if (isTransition) {
    return (
      <button
        type="button"
        onClick={onAdvance}
        className="relative z-10 flex min-h-touch items-center justify-center gap-2 rounded-xl bg-brand-600 text-xl font-bold text-white transition-all duration-200 hover:bg-brand-500 hover:scale-[1.01] active:scale-[0.98] hover:shadow-lg hover:shadow-brand-500/20"
      >
        <Play size={26} /> {startLabel}
      </button>
    );
  }

  return (
    <div className="relative z-10 grid grid-cols-2 gap-1.5 mt-2 sm:gap-2 sm:mt-4">
      <button
        type="button"
        onClick={onPauseResume}
        aria-label={isRunning ? pauseLabel : resumeLabel}
        className="flex min-h-touch items-center justify-center gap-2 rounded-xl border-2 border-brand-500 text-lg font-bold text-brand-500 transition-all duration-200 hover:bg-brand-500/10 hover:scale-[1.01] active:scale-[0.98]"
      >
        {isRunning ? <Pause size={24} /> : <Play size={24} />}
        <span className="hidden sm:inline">{isRunning ? pauseLabel : resumeLabel}</span>
      </button>
      <button
        type="button"
        onClick={onAdvanceSkip}
        aria-label={nextLabel}
        className="flex min-h-touch items-center justify-center gap-2 rounded-xl bg-brand-600 text-lg font-bold text-white transition-all duration-200 hover:bg-brand-500 hover:scale-[1.01] active:scale-[0.98] hover:shadow-lg hover:shadow-brand-500/20"
      >
        <ArrowRight size={24} />
        <span className="hidden sm:inline">{nextLabel}</span>
      </button>
    </div>
  );
});
