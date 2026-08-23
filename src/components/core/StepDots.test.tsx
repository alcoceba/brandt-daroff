import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { StepDots } from './StepDots';

const STEPS = ['a', 'b', 'c'];

describe('StepDots', () => {
  it('renders one dot per step', () => {
    const { container } = render(<StepDots steps={STEPS} current="a" />);
    expect(container.querySelectorAll('span')).toHaveLength(STEPS.length);
  });

  it('returns null when current is not in steps', () => {
    const { container } = render(<StepDots steps={STEPS} current="x" />);
    expect(container.firstChild).toBeNull();
  });

  it('applies wide class to the active dot', () => {
    const { container } = render(<StepDots steps={STEPS} current="b" />);
    const dots = container.querySelectorAll('span');
    expect(dots[1].className).toContain('w-6');
    expect(dots[0].className).not.toContain('w-6');
    expect(dots[2].className).not.toContain('w-6');
  });

  it('applies default brand colour to the active dot', () => {
    const { container } = render(<StepDots steps={STEPS} current="a" />);
    const activeDot = container.querySelectorAll('span')[0];
    expect(activeDot.className).toContain('bg-brand-500');
  });

  it('applies custom activeClassName to the active dot', () => {
    const { container } = render(
      <StepDots steps={STEPS} current="a" activeClassName="bg-amber-400" />,
    );
    const activeDot = container.querySelectorAll('span')[0];
    expect(activeDot.className).toContain('bg-amber-400');
    expect(activeDot.className).not.toContain('bg-brand-500');
  });

  it('marks past dots with the muted brand colour', () => {
    const { container } = render(<StepDots steps={STEPS} current="c" />);
    const dots = container.querySelectorAll('span');
    expect(dots[0].className).toContain('bg-brand-500/60');
    expect(dots[1].className).toContain('bg-brand-500/60');
  });

  it('applies custom completedClassName to past dots', () => {
    const { container } = render(
      <StepDots steps={STEPS} current="c" completedClassName="bg-amber-400/60" />,
    );
    const dots = container.querySelectorAll('span');
    expect(dots[0].className).toContain('bg-amber-400/60');
    expect(dots[1].className).toContain('bg-amber-400/60');
    expect(dots[0].className).not.toContain('bg-brand-500/60');
  });

  it('marks future dots with the slate colour', () => {
    const { container } = render(<StepDots steps={STEPS} current="a" />);
    const dots = container.querySelectorAll('span');
    expect(dots[1].className).toContain('bg-slate-600');
    expect(dots[2].className).toContain('bg-slate-600');
  });

  it('works correctly on the first step', () => {
    const { container } = render(<StepDots steps={STEPS} current="a" />);
    const dots = container.querySelectorAll('span');
    expect(dots[0].className).toContain('w-6');
    expect(dots[1].className).toContain('bg-slate-600');
    expect(dots[2].className).toContain('bg-slate-600');
  });

  it('works correctly on the last step', () => {
    const { container } = render(<StepDots steps={STEPS} current="c" />);
    const dots = container.querySelectorAll('span');
    expect(dots[0].className).toContain('bg-brand-500/60');
    expect(dots[1].className).toContain('bg-brand-500/60');
    expect(dots[2].className).toContain('w-6');
  });
});
