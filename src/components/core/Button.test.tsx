import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children with default primary variant', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-brand-600');
    expect(button).toHaveClass('min-h-touch');
  });

  it('renders secondary variant', () => {
    render(<Button variant="secondary">Cancel</Button>);
    const button = screen.getByRole('button', { name: 'Cancel' });
    expect(button).toHaveClass('bg-slate-700/80');
  });

  it('renders outline variant', () => {
    render(<Button variant="outline">Settings</Button>);
    const button = screen.getByRole('button', { name: 'Settings' });
    expect(button).toHaveClass('border-slate-700/80');
  });

  it('renders danger variant', () => {
    render(<Button variant="danger">Reset</Button>);
    const button = screen.getByRole('button', { name: 'Reset' });
    expect(button).toHaveClass('border-state-danger/50');
  });

  it('renders solid-danger variant', () => {
    render(<Button variant="solid-danger">Delete</Button>);
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toHaveClass('bg-state-danger');
  });

  it('renders ghost variant', () => {
    render(<Button variant="ghost">Skip</Button>);
    const button = screen.getByRole('button', { name: 'Skip' });
    expect(button).toHaveClass('text-slate-300');
  });

  it('applies fullWidth and size lg', () => {
    render(<Button fullWidth size="lg">Large</Button>);
    const button = screen.getByRole('button', { name: 'Large' });
    expect(button).toHaveClass('w-full');
    expect(button).toHaveClass('rounded-2xl');
  });

  it('applies size icon with square touch target', () => {
    render(<Button size="icon">X</Button>);
    const button = screen.getByRole('button', { name: 'X' });
    expect(button).toHaveClass('min-h-touch');
    expect(button).toHaveClass('min-w-touch');
  });

  it('handles click events and disabled state', () => {
    const handleClick = vi.fn();
    const { rerender } = render(<Button onClick={handleClick}>Tap</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Tap' }));
    expect(handleClick).toHaveBeenCalledTimes(1);

    rerender(<Button disabled onClick={handleClick}>Tap</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Tap' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
