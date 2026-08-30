import { memo } from 'react';
import { ChevronRight, Trophy } from 'lucide-react';

interface TreatmentCompleteCardProps {
  addExtraLabel: string;
  startNewLabel: string;
  title: string;
  body: string;
  onAddExtra: () => void;
  onStartNewTreatment: () => void;
}

export const TreatmentCompleteCard = memo(function TreatmentCompleteCard({
  addExtraLabel,
  startNewLabel,
  title,
  body,
  onAddExtra,
  onStartNewTreatment,
}: TreatmentCompleteCardProps) {
  return (
    <section className="flex flex-col items-center gap-4 rounded-2xl border border-slate-700 bg-slate-800 p-6 text-center">
      <Trophy className="h-16 w-16 text-state-done" strokeWidth={1.5} />
      <div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="mt-2 text-sm text-slate-300">{body}</p>
      </div>
      <div className="flex w-full flex-col gap-3">
        <button
          type="button"
          onClick={onAddExtra}
          className="group flex min-h-touch w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-lg font-bold text-white transition-all duration-200 hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-500/25 active:scale-[0.98]"
        >
          <span>{addExtraLabel}</span>
          <ChevronRight size={20} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
        <button
          type="button"
          onClick={onStartNewTreatment}
          className="min-h-touch w-full rounded-xl bg-slate-700 text-lg font-semibold text-white transition-all duration-200 hover:bg-slate-600 active:scale-[0.98]"
        >
          {startNewLabel}
        </button>
      </div>
    </section>
  );
});
