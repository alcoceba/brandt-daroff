import { memo } from 'react';
import { PositionIcon } from '@/components/PositionIcon';
import { Timer } from '@/components/Timer';
import { CycleProgressDots } from '@/components/CycleProgressDots';
import type { PositionDef } from '@/types';

interface CyclePositionViewProps {
  position: PositionDef;
  isTransition: boolean;
  isPaused: boolean;
  secondsRemaining: number;
  duration: number;
  isRunning: boolean;
  cycleNumber: number;
  totalCycles: number;
  label: string;
  cycleLabel: string;
}

export const CyclePositionView = memo(function CyclePositionView({
  position,
  isTransition,
  isPaused,
  secondsRemaining,
  duration,
  isRunning,
  cycleNumber,
  totalCycles,
  label,
  cycleLabel,
}: CyclePositionViewProps) {
  return (
    <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-5">
      <PositionIcon kind={position.kind} isPaused={isPaused} className="h-20 w-20 sm:h-28 sm:w-28" />
      <p className="whitespace-pre-line text-center text-xl font-bold text-white leading-7 h-14 sm:text-2xl sm:leading-8 sm:h-16 flex items-center justify-center">
        {label}
      </p>
      {!isTransition && (
        <>
          <Timer
            secondsRemaining={secondsRemaining}
            totalDuration={duration}
            isRunning={isRunning}
            kind={position.kind}
          />

          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-lg font-bold text-white">{cycleLabel}</p>
            <CycleProgressDots
              total={totalCycles}
              currentIndex={cycleNumber - 1}
              kind={position.kind}
              isPaused={isPaused}
            />
          </div>
        </>
      )}
    </div>
  );
});
