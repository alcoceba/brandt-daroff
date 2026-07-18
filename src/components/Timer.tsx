import { memo, useMemo } from 'react';
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
    // Safari/WebKit bug: stroke-dashoffset=0 with round cap renders as empty.
    // Use a tiny positive value so the full ring is always visible.
    return raw < 0.001 ? 0.001 : raw;
  }, [progress]);
  const display = totalDuration > 0 ? formatTime(secondsRemaining) : '–';
  const strokeColor = isRunning ? RING_COLOR[kind].running : RING_COLOR[kind].paused;

  const dashArray = CIRCUMFERENCE.toFixed(3);
  const dashOffset = offset.toFixed(3);

  return (
    <div className="relative grid place-items-center" style={{ width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} className="-rotate-90">
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
          strokeLinecap="round"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <span className="absolute text-7xl font-bold tabular-nums text-white">
        {display}
      </span>
    </div>
  );
});
