import { memo, useMemo } from 'react';

interface TimerProps {
  secondsRemaining: number;
  totalDuration: number;
  isRunning: boolean;
}

const SIZE = 300;
const STROKE = 20;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function formatTime(seconds: number): string {
  const total = Math.max(Math.ceil(seconds), 0);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return m > 0 ? `${m}:${String(s).padStart(2, '0')}` : String(s);
}

export const Timer = memo(function Timer({ secondsRemaining, totalDuration, isRunning }: TimerProps) {
  const progress = totalDuration > 0 ? Math.min(secondsRemaining / totalDuration, 1) : 0;
  const offset = useMemo(() => CIRCUMFERENCE * (1 - progress), [progress]);
  const display = totalDuration > 0 ? formatTime(secondsRemaining) : '–';

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
          stroke={isRunning ? '#22c55e' : '#f59e0b'}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-100 ease-linear"
        />
      </svg>
      <span className="absolute text-7xl font-bold tabular-nums text-white">
        {display}
      </span>
    </div>
  );
});
