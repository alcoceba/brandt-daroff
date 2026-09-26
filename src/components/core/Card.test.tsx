import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card><span>Card Content</span></Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies default variant classes', () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild).toHaveClass('border-slate-700/80');
    expect(container.firstChild).toHaveClass('bg-slate-800/80');
  });

  it('applies subtle variant classes', () => {
    const { container } = render(<Card variant="subtle">Content</Card>);
    expect(container.firstChild).toHaveClass('border-slate-800/60');
    expect(container.firstChild).toHaveClass('bg-slate-900/40');
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
