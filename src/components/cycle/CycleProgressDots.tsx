import { memo } from 'react';
import type { PositionKind } from '@/types';

interface CycleProgressDotsProps {
  total: number;
  currentIndex: number;
  kind: PositionKind;
  isPaused?: boolean;
}

const PALETTES: Record<'active' | 'paused', Record<PositionKind, { completed: string; ring: string }>> = {
  active: {
    sitting: { completed: 'bg-brand-500', ring: 'ring-brand-500' },
    'lying-right': { completed: 'bg-brand-500', ring: 'ring-brand-500' },
    'lying-left': { completed: 'bg-brand-500', ring: 'ring-brand-500' },
    rest: { completed: 'bg-yellow-400', ring: 'ring-yellow-400' },
    'long-rest': { completed: 'bg-red-500', ring: 'ring-red-500' },
  },
  paused: {
    sitting: { completed: 'bg-amber-500', ring: 'ring-amber-500' },
    'lying-right': { completed: 'bg-amber-500', ring: 'ring-amber-500' },
    'lying-left': { completed: 'bg-amber-500', ring: 'ring-amber-500' },
    rest: { completed: 'bg-amber-600', ring: 'ring-amber-600' },
    'long-rest': { completed: 'bg-red-700', ring: 'ring-red-700' },
  },
};

export const CycleProgressDots = memo(function CycleProgressDots({
  total,
  currentIndex,
  kind,
  isPaused = false,
}: CycleProgressDotsProps) {
  const palette = PALETTES[isPaused ? 'paused' : 'active'][kind];

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
                ? `scale-100 ${palette.completed}`
                : isCurrent
                  ? `scale-125 ring-2 bg-transparent ${palette.ring}`
                  : 'scale-100 bg-slate-600'
            }`}
          />
        );
      })}
    </div>
  );
});
