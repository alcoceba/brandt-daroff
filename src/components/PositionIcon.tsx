import { memo } from 'react';
import { Armchair, Bed, Coffee, Hourglass, type LucideIcon } from 'lucide-react';
import type { PositionKind } from '@/types';

interface PositionIconProps {
  kind: PositionKind;
  className?: string;
}

const ICONS: Record<PositionKind, LucideIcon> = {
  sitting: Armchair,
  'lying-right': Bed,
  'lying-left': Bed,
  rest: Coffee,
  'long-rest': Hourglass,
};

const COLORS: Record<PositionKind, string> = {
  sitting: 'text-amber-400',
  'lying-right': 'text-brand-500',
  'lying-left': 'text-brand-500',
  rest: 'text-slate-300',
  'long-rest': 'text-slate-400',
};

export const PositionIcon = memo(function PositionIcon({ kind, className }: PositionIconProps) {
  const Icon = ICONS[kind];
  const color = COLORS[kind];
  return <Icon className={`${className} ${color}`} strokeWidth={1.5} />;
});
