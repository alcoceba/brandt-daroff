import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { FlagIcon } from './FlagIcon';

describe('FlagIcon component', () => {
  it('should render correct SVG for English (en)', () => {
    const { container } = render(<FlagIcon code="en" className="test-flag" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('test-flag');
    
    // English flag rect color check
    const rect = container.querySelector('rect');
    expect(rect).toHaveAttribute('fill', '#012169');
  });

  it('should render correct SVG for Catalan (ca)', () => {
    const { container } = render(<FlagIcon code="ca" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    
    // Catalan flag stripes checks (rect fill contains red stripes)
    const rects = container.querySelectorAll('rect');
    expect(rects.length).toBeGreaterThan(1);
    expect(rects[0]).toHaveAttribute('fill', '#FCDD09');
  });

  it('should render correct SVG for Spanish (es)', () => {
    const { container } = render(<FlagIcon code="es" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    
    // Spanish flag checks
    const rects = container.querySelectorAll('rect');
    expect(rects[0]).toHaveAttribute('fill', '#AA151B');
    expect(rects[1]).toHaveAttribute('fill', '#F1BF00');
  });
});
