import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CycleProgressDots } from './CycleProgressDots';
import type { PositionKind } from '@/types';

describe('CycleProgressDots component', () => {
  it('renders the correct number of dots', () => {
    const { container } = render(<CycleProgressDots total={5} currentIndex={0} kind="sitting" />);
    expect(container.querySelectorAll('span')).toHaveLength(5);
  });

  it('applies completed, current and pending styles', () => {
    const { container } = render(<CycleProgressDots total={5} currentIndex={2} kind="sitting" />);
    const dots = container.querySelectorAll('span');

    expect(dots[0]).toHaveClass('bg-brand-500');
    expect(dots[1]).toHaveClass('bg-brand-500');

    expect(dots[2]).toHaveClass('scale-125');
    expect(dots[2]).toHaveClass('ring-2');
    expect(dots[2]).toHaveClass('bg-transparent');
    expect(dots[2]).toHaveClass('ring-brand-500');

    expect(dots[3]).toHaveClass('bg-slate-600');
    expect(dots[4]).toHaveClass('bg-slate-600');
  });

  it.each<[PositionKind, string, string]>([
    ['sitting', 'bg-brand-500', 'ring-brand-500'],
    ['lying-right', 'bg-brand-500', 'ring-brand-500'],
    ['lying-left', 'bg-brand-500', 'ring-brand-500'],
    ['rest', 'bg-yellow-400', 'ring-yellow-400'],
    ['long-rest', 'bg-red-500', 'ring-red-500'],
  ])('uses %s colors when not paused', (kind, completedClass, ringClass) => {
    const { container } = render(<CycleProgressDots total={3} currentIndex={1} kind={kind} />);
    const dots = container.querySelectorAll('span');
    expect(dots[0]).toHaveClass(completedClass);
    expect(dots[1]).toHaveClass(ringClass);
  });

  it.each<[PositionKind, string, string]>([
    ['sitting', 'bg-amber-500', 'ring-amber-500'],
    ['lying-right', 'bg-amber-500', 'ring-amber-500'],
    ['lying-left', 'bg-amber-500', 'ring-amber-500'],
    ['rest', 'bg-amber-600', 'ring-amber-600'],
    ['long-rest', 'bg-red-700', 'ring-red-700'],
  ])('uses %s paused colors', (kind, completedClass, ringClass) => {
    const { container } = render(
      <CycleProgressDots total={3} currentIndex={1} kind={kind} isPaused />
    );
    const dots = container.querySelectorAll('span');
    expect(dots[0]).toHaveClass(completedClass);
    expect(dots[1]).toHaveClass(ringClass);
  });

  it('marks every dot as completed when currentIndex is the last position', () => {
    const { container } = render(<CycleProgressDots total={4} currentIndex={3} kind="rest" />);
    const dots = container.querySelectorAll('span');
    expect(dots[0]).toHaveClass('bg-yellow-400');
    expect(dots[1]).toHaveClass('bg-yellow-400');
    expect(dots[2]).toHaveClass('bg-yellow-400');
    expect(dots[3]).toHaveClass('scale-125');
  });
});
