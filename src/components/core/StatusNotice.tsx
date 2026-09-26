import { memo, useEffect, type ReactNode } from 'react';

export interface StatusNoticeProps {
  icon: ReactNode;
  iconBadgeClassName?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  onDone: () => void;
  durationMs?: number;
  className?: string;
}

export const StatusNotice = memo(function StatusNotice({
  icon,
  iconBadgeClassName = 'bg-state-done/20 text-state-done',
  title,
  subtitle,
  onDone,
  durationMs = 2500,
  className = '',
}: StatusNoticeProps) {
  useEffect(() => {
    if (!durationMs) return;
    const timer = setTimeout(onDone, durationMs);
    return () => clearTimeout(timer);
  }, [onDone, durationMs]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onDone}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onDone();
      }}
      className={`flex flex-1 cursor-pointer select-none flex-col items-center justify-center gap-6 px-6 text-center outline-none ${className}`}
    >
      <div
        className={`flex h-24 w-24 animate-scale-in items-center justify-center rounded-full ${iconBadgeClassName}`}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-lg text-slate-300">{subtitle}</p>}
      </div>
    </div>
  );
});
