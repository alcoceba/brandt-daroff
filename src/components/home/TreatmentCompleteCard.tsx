import { memo } from 'react';
import { ChevronRight, Trophy } from 'lucide-react';
import { Button } from '@/components/core/Button';

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
    <section className="flex flex-col items-center gap-4 rounded-2xl border border-slate-700/80 bg-slate-800/80 p-6 text-center backdrop-blur-sm shadow-xl">
      <Trophy className="h-16 w-16 text-state-done" strokeWidth={1.5} />
      <div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="mt-2 text-sm text-slate-300">{body}</p>
      </div>
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        <Button
          variant="primary"
          fullWidth
          onClick={onAddExtra}
          className="group py-3 text-lg"
        >
          <span>{addExtraLabel}</span>
          <ChevronRight size={20} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </Button>
        <Button
          variant="secondary"
          fullWidth
          onClick={onStartNewTreatment}
          className="py-3 text-lg"
        >
          {startNewLabel}
        </Button>
      </div>
    </section>
  );
});
