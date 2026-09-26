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

  it('should render lying-left and long-rest icons properly', () => {
    const { container: leftContainer } = render(<PositionIcon kind="lying-left" />);
    expect(leftContainer.querySelector('svg')).toHaveClass('animate-arrow-sway');

    const { container: longRestContainer } = render(<PositionIcon kind="long-rest" />);
    expect(longRestContainer.querySelector('svg')).toHaveClass('text-red-500');
  });

  it('should apply paused colors when isPaused is true', () => {
    const { container: sittingPaused } = render(<PositionIcon kind="sitting" isPaused={true} />);
    expect(sittingPaused.querySelector('svg')).toHaveClass('text-amber-600');

    const { container: lyingPaused } = render(<PositionIcon kind="lying-right" isPaused={true} />);
    expect(lyingPaused.querySelector('svg')).toHaveClass('text-amber-500');

    const { container: longRestPaused } = render(<PositionIcon kind="long-rest" isPaused={true} />);
    expect(longRestPaused.querySelector('svg')).toHaveClass('text-red-700');
  });
});
