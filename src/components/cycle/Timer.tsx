import { memo } from 'react';
import type { PositionKind } from '@/types';
import { CountdownRing } from '@/components/core/CountdownRing';

interface TimerProps {
  secondsRemaining: number;
  totalDuration: number;
  isRunning: boolean;
  kind?: PositionKind;
}

const RING_COLOR: Record<PositionKind, { running: string; paused: string }> = {
  sitting: { running: '#22c55e', paused: '#f59e0b' },
  'lying-right': { running: '#22c55e', paused: '#f59e0b' },
  'lying-left': { running: '#22c55e', paused: '#f59e0b' },
  rest: { running: '#facc15', paused: '#ca8a04' },
  'long-rest': { running: '#dc2626', paused: '#b91c1c' },
};

export const Timer = memo(function Timer({
  secondsRemaining,
  totalDuration,
  isRunning,
  kind = 'sitting',
}: TimerProps) {
  const strokeColor = isRunning ? RING_COLOR[kind].running : RING_COLOR[kind].paused;

  return (
    <CountdownRing
      secondsRemaining={secondsRemaining}
      totalDuration={totalDuration}
      isRunning={isRunning}
      strokeColor={strokeColor}
    />
  );
});
