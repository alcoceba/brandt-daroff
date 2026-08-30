import { memo } from 'react';
import { ArrowRight, Pause, Play } from 'lucide-react';
import type { PositionKind } from '@/types';

interface Theme {
  primary: string;
  primaryHover: string;
  shadow: string;
  secondaryBorder: string;
  secondaryText: string;
  secondaryHoverBg: string;
}

const PALETTES: Record<'active' | 'paused', Record<PositionKind, Theme>> = {
  active: {
    sitting: {
      primary: 'bg-yellow-500',
      primaryHover: 'hover:bg-yellow-400',
      shadow: 'shadow-yellow-500/25',
      secondaryBorder: 'border-yellow-500',
      secondaryText: 'text-yellow-500',
      secondaryHoverBg: 'hover:bg-yellow-500/10',
    },
    'lying-right': {
      primary: 'bg-green-500',
      primaryHover: 'hover:bg-green-400',
      shadow: 'shadow-green-500/25',
      secondaryBorder: 'border-green-500',
      secondaryText: 'text-green-500',
      secondaryHoverBg: 'hover:bg-green-500/10',
    },
    'lying-left': {
      primary: 'bg-green-500',
      primaryHover: 'hover:bg-green-400',
      shadow: 'shadow-green-500/25',
      secondaryBorder: 'border-green-500',
      secondaryText: 'text-green-500',
      secondaryHoverBg: 'hover:bg-green-500/10',
    },
    rest: {
      primary: 'bg-yellow-500',
      primaryHover: 'hover:bg-yellow-400',
      shadow: 'shadow-yellow-500/25',
      secondaryBorder: 'border-yellow-500',
      secondaryText: 'text-yellow-500',
      secondaryHoverBg: 'hover:bg-yellow-500/10',
    },
    'long-rest': {
      primary: 'bg-red-500',
      primaryHover: 'hover:bg-red-400',
      shadow: 'shadow-red-500/25',
      secondaryBorder: 'border-red-500',
      secondaryText: 'text-red-500',
      secondaryHoverBg: 'hover:bg-red-500/10',
    },
  },
  paused: {
    sitting: {
      primary: 'bg-amber-500',
      primaryHover: 'hover:bg-amber-400',
      shadow: 'shadow-amber-500/25',
      secondaryBorder: 'border-amber-500',
      secondaryText: 'text-amber-500',
      secondaryHoverBg: 'hover:bg-amber-500/10',
    },
    'lying-right': {
      primary: 'bg-amber-500',
      primaryHover: 'hover:bg-amber-400',
      shadow: 'shadow-amber-500/25',
      secondaryBorder: 'border-amber-500',
      secondaryText: 'text-amber-500',
      secondaryHoverBg: 'hover:bg-amber-500/10',
    },
    'lying-left': {
      primary: 'bg-amber-500',
      primaryHover: 'hover:bg-amber-400',
      shadow: 'shadow-amber-500/25',
      secondaryBorder: 'border-amber-500',
      secondaryText: 'text-amber-500',
      secondaryHoverBg: 'hover:bg-amber-500/10',
    },
    rest: {
      primary: 'bg-amber-600',
      primaryHover: 'hover:bg-amber-500',
      shadow: 'shadow-amber-600/25',
      secondaryBorder: 'border-amber-600',
      secondaryText: 'text-amber-600',
      secondaryHoverBg: 'hover:bg-amber-600/10',
    },
    'long-rest': {
      primary: 'bg-red-700',
      primaryHover: 'hover:bg-red-600',
      shadow: 'shadow-red-700/25',
      secondaryBorder: 'border-red-700',
      secondaryText: 'text-red-700',
      secondaryHoverBg: 'hover:bg-red-700/10',
    },
  },
};

interface CycleControlsProps {
  kind: PositionKind;
  isTransition: boolean;
  isRunning: boolean;
  isPaused: boolean;
  startLabel: string;
  pauseLabel: string;
  resumeLabel: string;
  nextLabel: string;
  onAdvance: () => void;
  onAdvanceSkip: () => void;
  onPauseResume: () => void;
}

export const CycleControls = memo(function CycleControls({
  kind,
  isTransition,
  isRunning,
  isPaused,
  startLabel,
  pauseLabel,
  resumeLabel,
  nextLabel,
  onAdvance,
  onAdvanceSkip,
  onPauseResume,
}: CycleControlsProps) {
  const theme = PALETTES[isPaused ? 'paused' : 'active'][kind];

  if (isTransition) {
    return (
      <button
        type="button"
        onClick={onAdvance}
        className={`relative z-10 flex min-h-touch items-center justify-center gap-2 rounded-xl ${theme.primary} text-xl font-bold text-white transition-all duration-200 ${theme.primaryHover} hover:scale-[1.01] active:scale-[0.98] hover:shadow-lg ${theme.shadow}`}
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
        className={`flex min-h-touch items-center justify-center gap-2 rounded-xl border-2 ${theme.secondaryBorder} text-lg font-bold ${theme.secondaryText} transition-all duration-200 ${theme.secondaryHoverBg} hover:scale-[1.01] active:scale-[0.98]`}
      >
        {isRunning ? <Pause size={24} /> : <Play size={24} />}
        <span className="hidden sm:inline">{isRunning ? pauseLabel : resumeLabel}</span>
      </button>
      <button
        type="button"
        onClick={onAdvanceSkip}
        aria-label={nextLabel}
        className={`flex min-h-touch items-center justify-center gap-2 rounded-xl ${theme.primary} text-lg font-bold text-white transition-all duration-200 ${theme.primaryHover} hover:scale-[1.01] active:scale-[0.98] hover:shadow-lg ${theme.shadow}`}
      >
        <ArrowRight size={24} />
        <span className="hidden sm:inline">{nextLabel}</span>
      </button>
    </div>
  );
});
