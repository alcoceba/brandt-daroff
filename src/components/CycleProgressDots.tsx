import { memo } from 'react';
import type { PositionKind } from '@/types';

interface CycleProgressDotsProps {
  total: number;
  currentIndex: number;
  kind: PositionKind;
  isPaused?: boolean;
}

const COMPLETED_COLORS: Record<PositionKind, string> = {
  sitting: 'bg-brand-500',
  'lying-right': 'bg-brand-500',
  'lying-left': 'bg-brand-500',
  rest: 'bg-yellow-400',
  'long-rest': 'bg-red-500',
};

const CURRENT_RING_COLORS: Record<PositionKind, string> = {
  sitting: 'ring-brand-500',
  'lying-right': 'ring-brand-500',
  'lying-left': 'ring-brand-500',
  rest: 'ring-yellow-400',
  'long-rest': 'ring-red-500',
};

const PAUSED_COMPLETED_COLORS: Record<PositionKind, string> = {
  sitting: 'bg-amber-500',
  'lying-right': 'bg-amber-500',
  'lying-left': 'bg-amber-500',
  rest: 'bg-amber-600',
  'long-rest': 'bg-red-700',
};

const PAUSED_CURRENT_RING_COLORS: Record<PositionKind, string> = {
  sitting: 'ring-amber-500',
  'lying-right': 'ring-amber-500',
  'lying-left': 'ring-amber-500',
  rest: 'ring-amber-600',
  'long-rest': 'ring-red-700',
};

export const CycleProgressDots = memo(function CycleProgressDots({
  total,
  currentIndex,
  kind,
  isPaused = false,
}: CycleProgressDotsProps) {
  const completedColor = isPaused ? PAUSED_COMPLETED_COLORS[kind] : COMPLETED_COLORS[kind];
  const currentRingColor = isPaused ? PAUSED_CURRENT_RING_COLORS[kind] : CURRENT_RING_COLORS[kind];

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {Array.from({ length: total }).map((_, i) => {
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <span
            key={i}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ease-out sm:h-3 sm:w-3 ${
              isCompleted
                ? `scale-100 ${completedColor}`
                : isCurrent
                  ? `scale-125 ring-2 bg-transparent ${currentRingColor}`
                  : 'scale-100 bg-slate-600'
            }`}
          />
        );
      })}
    </div>
  );
});
