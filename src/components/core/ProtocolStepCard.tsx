import { memo, type ReactNode } from 'react';

export interface ProtocolStepCardProps {
  number: number | ReactNode;
  title: ReactNode;
  duration?: ReactNode;
  text: ReactNode;
  note?: ReactNode;
  noteLabel?: ReactNode;
  className?: string;
}

export const ProtocolStepCard = memo(function ProtocolStepCard({
  number,
  title,
  duration,
  text,
  note,
  noteLabel = 'Nota:',
  className = '',
}: ProtocolStepCardProps) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-xl border border-slate-700/60 bg-slate-900/60 p-4 transition-colors hover:border-slate-600 ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-xs font-bold text-brand-400">
            {number}
          </span>
          <span className="text-sm font-bold text-white sm:text-base">{title}</span>
        </div>
        {duration && (
          <span className="shrink-0 rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-300">
            {duration}
          </span>
        )}
      </div>
      <p className="pl-9 text-xs leading-relaxed text-slate-300 sm:text-sm">{text}</p>
      {note && (
        <p className="pl-9 text-xs text-slate-400">
          <span className="font-medium text-slate-300">{noteLabel}</span> {note}
        </p>
      )}
    </div>
  );
});
