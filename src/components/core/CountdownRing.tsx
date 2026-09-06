import { memo, useMemo, type ReactNode } from 'react';
import { Pause } from 'lucide-react';
import { formatTime } from '@/utils/format';

export interface CountdownRingProps {
  secondsRemaining: number;
  totalDuration: number;
  isRunning: boolean;
  strokeColor: string;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  centerContent?: ReactNode;
  className?: string;
}

export const CountdownRing = memo(function CountdownRing({
  secondsRemaining,
  totalDuration,
  isRunning,
  strokeColor,
  size = 300,
  strokeWidth = 20,
  trackColor = '#1e293b',
  centerContent,
  className = '',
}: CountdownRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = totalDuration > 0 ? Math.min(secondsRemaining / totalDuration, 1) : 0;

  const offset = useMemo(() => {
    const raw = circumference * (1 - progress);
    return raw < 0.001 ? 0.001 : raw;
  }, [circumference, progress]);

  const dashArray = circumference.toFixed(3);
  const dashOffset = offset.toFixed(3);

  return (
    <div
      className={`relative grid h-auto w-full max-w-[260px] place-items-center sm:max-w-[300px] timer-container ${className}`}
    >
      <svg viewBox={`0 0 ${size} ${size}`} className="h-auto w-full -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
        />
      </svg>
      {totalDuration > 0 && (
        <span className="absolute text-5xl font-bold tabular-nums text-white sm:text-7xl timer-text">
          {centerContent !== undefined ? (
            centerContent
          ) : !isRunning ? (
            <Pause size={48} className="sm:h-16 sm:w-16 timer-pause-icon" />
          ) : (
            formatTime(secondsRemaining)
          )}
        </span>
      )}
    </div>
  );
});
