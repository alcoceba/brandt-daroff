import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { PositionIcon } from './PositionIcon';

describe('PositionIcon component', () => {
  it('should render sitting icon with correct classes and no sway animation', () => {
    const { container } = render(<PositionIcon kind="sitting" className="w-10 h-10" />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-10');
    expect(svg).toHaveClass('h-10');
    expect(svg).toHaveClass('text-amber-400');
    expect(svg).not.toHaveClass('animate-arrow-sway');
    expect(svg).not.toHaveClass('animate-coffee-bob');
  });

  it('should render lying-right icon with correct sway animation class', () => {
    const { container } = render(<PositionIcon kind="lying-right" />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('text-brand-500');
    expect(svg).toHaveClass('animate-arrow-sway');
  });

  it('should render rest icon with correct coffee bob animation class', () => {
    const { container } = render(<PositionIcon kind="rest" />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('text-yellow-400');
    expect(svg).toHaveClass('animate-coffee-bob');
  });
});
