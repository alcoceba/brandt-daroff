import { memo } from 'react';

interface HomeHeaderProps {
  finished: boolean;
  dayNumber: number;
  totalDays: number;
  title: string;
  completeLabel: string;
  dayLabel: string;
}

export const HomeHeader = memo(function HomeHeader({
  finished,
  title,
  completeLabel,
  dayLabel,
}: HomeHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <h1 className="whitespace-nowrap text-xl font-bold text-white">{title}</h1>
          {finished ? (
            <span className="text-lg font-bold text-state-done">{completeLabel}</span>
          ) : (
            <span className="whitespace-nowrap text-lg font-semibold text-brand-500">
              {dayLabel}
            </span>
          )}
        </div>
      </div>
    </header>
  );
});
