import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Logo } from './Logo';

describe('Logo component', () => {
  it('should render SVG circles and wordmark with tagline by default', () => {
    const { container } = render(<Logo />);
    
    // SVG is rendered
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '96');
    expect(svg).toHaveAttribute('height', '96');

    // Translates app title and tagline
    expect(screen.getByText('app.name')).toBeInTheDocument();
    expect(screen.getByText('app.tagline')).toBeInTheDocument();
  });

  it('should hide wordmark if showWordmark is false', () => {
    render(<Logo showWordmark={false} />);
    
    expect(screen.queryByText('app.name')).toBeNull();
    expect(screen.queryByText('app.tagline')).toBeNull();
  });

  it('should apply custom size parameter to the SVG', () => {
    const { container } = render(<Logo size={64} />);
    
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '64');
    expect(svg).toHaveAttribute('height', '64');
  });
});
