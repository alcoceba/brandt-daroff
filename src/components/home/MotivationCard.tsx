import { memo } from 'react';
import { Sparkles } from 'lucide-react';
import { Card } from '@/components/core/Card';

interface MotivationCardProps {
  message: string | null;
}

export const MotivationCard = memo(function MotivationCard({ message }: MotivationCardProps) {
  if (!message) return null;
  return (
    <Card className="flex items-start gap-3 rounded-2xl shadow-md">
      <Sparkles className="h-5 w-5 text-brand-400 shrink-0 mt-0.5" strokeWidth={1.5} />
      <p className="text-sm text-slate-300 leading-relaxed">{message}</p>
    </Card>
  );
});
