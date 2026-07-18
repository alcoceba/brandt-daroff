import { memo, useMemo } from 'react';
import { Pause } from 'lucide-react';
import type { PositionKind } from '@/types';

interface TimerProps {
  secondsRemaining: number;
  totalDuration: number;
  isRunning: boolean;
  kind?: PositionKind;
}

const SIZE = 300;
const STROKE = 20;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const RING_COLOR: Record<PositionKind, { running: string; paused: string }> = {
  sitting: { running: '#22c55e', paused: '#f59e0b' },
  'lying-right': { running: '#22c55e', paused: '#f59e0b' },
  'lying-left': { running: '#22c55e', paused: '#f59e0b' },
  rest: { running: '#facc15', paused: '#ca8a04' },
  'long-rest': { running: '#dc2626', paused: '#b91c1c' },
};

function formatTime(seconds: number): string {
  const total = Math.max(Math.ceil(seconds), 0);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return m > 0 ? `${m}:${String(s).padStart(2, '0')}` : String(s);
}

export const Timer = memo(function Timer({
  secondsRemaining,
  totalDuration,
  isRunning,
  kind = 'sitting',
}: TimerProps) {
  const progress = totalDuration > 0 ? Math.min(secondsRemaining / totalDuration, 1) : 0;
  const offset = useMemo(() => {
    const raw = CIRCUMFERENCE * (1 - progress);
    return raw < 0.001 ? 0.001 : raw;
  }, [progress]);
  const display = formatTime(secondsRemaining);
  const strokeColor = isRunning ? RING_COLOR[kind].running : RING_COLOR[kind].paused;

  const dashArray = CIRCUMFERENCE.toFixed(3);
  const dashOffset = offset.toFixed(3);

  return (
    <div className="relative grid h-auto w-full max-w-[260px] place-items-center sm:max-w-[300px]">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-auto w-full -rotate-90">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="#1e293b"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={strokeColor}
          strokeWidth={STROKE}
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
        />
      </svg>
      {totalDuration > 0 && (
        <span className="absolute text-5xl font-bold tabular-nums text-white sm:text-7xl">
          {!isRunning ? <Pause size={48} className="sm:h-16 sm:w-16" /> : display}
        </span>
      )}
    </div>
  );
});
