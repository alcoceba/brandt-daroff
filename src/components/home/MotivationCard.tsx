import { memo } from 'react';
import { Sparkles } from 'lucide-react';

interface MotivationCardProps {
  message: string | null;
}

export const MotivationCard = memo(function MotivationCard({ message }: MotivationCardProps) {
  if (!message) return null;
  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-800/75 p-4 flex items-start gap-3 backdrop-blur-sm shadow-md">
      <Sparkles className="h-5 w-5 text-brand-400 shrink-0 mt-0.5" strokeWidth={1.5} />
      <p className="text-sm text-slate-300 leading-relaxed">{message}</p>
    </div>
  );
});
