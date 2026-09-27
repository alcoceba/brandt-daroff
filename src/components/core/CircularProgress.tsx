import { memo, useEffect, useState } from 'react';

interface CircularProgressProps {
  value: number;
  secondaryValue?: number;
  size?: number;
  strokeWidth?: number;
  trackClassName?: string;
  fillClassName?: string;
  secondaryClassName?: string;
  children?: React.ReactNode;
}

export const CircularProgress = memo(function CircularProgress({
  value,
  secondaryValue = 0,
  size = 72,
  strokeWidth = 6,
  trackClassName = 'stroke-slate-700',
  fillClassName = 'stroke-brand-500',
  secondaryClassName = 'stroke-amber-400',
  children,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Number.isFinite(value) ? Math.min(Math.max(value, 0), 1) : 0;
  const clampedSecondary = Number.isFinite(secondaryValue)
    ? Math.min(Math.max(secondaryValue, 0), Math.max(0, 1 - clamped))
    : 0;
  const [animatedValue, setAnimatedValue] = useState(0);
  const [animatedTotalValue, setAnimatedTotalValue] = useState(0);

  useEffect(() => {
    setAnimatedValue(clamped);
    setAnimatedTotalValue(clamped + clampedSecondary);
  }, [clamped, clampedSecondary]);

  const offset = circumference * (1 - animatedValue);
  const totalOffset = circumference * (1 - animatedTotalValue);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90 transform"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={trackClassName}
        />
        {clampedSecondary > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={totalOffset}
            strokeLinecap="round"
            className={`transition-all duration-700 ease-out ${secondaryClassName} ${
              animatedTotalValue === 0 ? 'opacity-0' : 'opacity-100'
            }`}
          />
        )}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`transition-all duration-700 ease-out ${fillClassName} ${
            animatedValue === 0 ? 'opacity-0' : 'opacity-100'
          }`}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
});
