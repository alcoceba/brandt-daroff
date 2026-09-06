import { memo } from 'react';
import { ArrowLeft, ArrowRight, Coffee, Flag, type LucideIcon } from 'lucide-react';
import type { PositionKind } from '@/types';

interface PositionIconProps {
  kind: PositionKind;
  className?: string;
  isPaused?: boolean;
}

const ICONS: Record<PositionKind, LucideIcon> = {
  sitting: Flag,
  'lying-right': ArrowRight,
  'lying-left': ArrowLeft,
  rest: Coffee,
  'long-rest': Coffee,
};

const COLORS: Record<PositionKind, string> = {
  sitting: 'text-amber-400',
  'lying-right': 'text-brand-500',
  'lying-left': 'text-brand-500',
  rest: 'text-yellow-400',
  'long-rest': 'text-red-500',
};

const PAUSED_COLORS: Record<PositionKind, string> = {
  sitting: 'text-amber-600',
  'lying-right': 'text-amber-500',
  'lying-left': 'text-amber-500',
  rest: 'text-amber-600',
  'long-rest': 'text-red-700',
};

const ANIMATIONS: Record<PositionKind, string> = {
  sitting: '',
  'lying-right': 'animate-arrow-sway',
  'lying-left': 'animate-arrow-sway',
  rest: 'animate-coffee-bob',
  'long-rest': 'animate-coffee-bob',
};

export const PositionIcon = memo(function PositionIcon({ kind, className, isPaused = false }: PositionIconProps) {
  const Icon = ICONS[kind];
  const color = isPaused ? PAUSED_COLORS[kind] : COLORS[kind];
  const animation = ANIMATIONS[kind];
  return <Icon className={`${className} ${color} ${animation}`} strokeWidth={1.5} />;
});
