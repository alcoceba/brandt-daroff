import { memo } from 'react';
import { ArrowLeft, ArrowRight, Circle, Coffee, Hourglass, type LucideIcon } from 'lucide-react';
import type { PositionKind } from '@/types';

interface PositionIconProps {
  kind: PositionKind;
  className?: string;
}

const ICONS: Record<PositionKind, LucideIcon> = {
  sitting: Circle,
  'lying-right': ArrowRight,
  'lying-left': ArrowLeft,
  rest: Coffee,
  'long-rest': Hourglass,
};

const COLORS: Record<PositionKind, string> = {
  sitting: 'text-amber-400',
  'lying-right': 'text-brand-500',
  'lying-left': 'text-brand-500',
  rest: 'text-yellow-400',
  'long-rest': 'text-red-600',
};

export const PositionIcon = memo(function PositionIcon({ kind, className }: PositionIconProps) {
  const Icon = ICONS[kind];
  const color = COLORS[kind];
  return <Icon className={`${className} ${color}`} strokeWidth={1.5} />;
});
