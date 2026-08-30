import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProgressIndicator } from './ProgressIndicator';

describe('ProgressIndicator', () => {
  it('renders back button and step dots by default', () => {
    render(<ProgressIndicator steps={['a', 'b', 'c']} current="b" onBack={vi.fn()} />);

    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    expect(screen.getByText(/wizard.stepIndicator/)).toBeInTheDocument();
    expect(document.querySelectorAll('.h-2.rounded-full')).toHaveLength(3);
  });

  it('hides back button when showBack is false', () => {
    const { container } = render(<ProgressIndicator steps={['a', 'b']} current="a" showBack={false} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(container.querySelector('.min-h-touch.min-w-touch')).toBeInTheDocument();
  });

  it('hides progress section when showProgress is false', () => {
    render(
      <ProgressIndicator
        steps={['a', 'b', 'c']}
        current="b"
        onBack={vi.fn()}
        showProgress={false}
      />,
    );

    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    expect(screen.queryByText('wizard.stepIndicator')).not.toBeInTheDocument();
    expect(document.querySelectorAll('.h-2.rounded-full')).toHaveLength(0);
  });

  it('calls onBack when back button is pressed', () => {
    const onBack = vi.fn();
    render(<ProgressIndicator steps={['a', 'b']} current="b" onBack={onBack} />);
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('uses custom label when provided', () => {
    render(<ProgressIndicator steps={['a', 'b']} current="a" label="custom label" />);
    expect(screen.getByText('custom label')).toBeInTheDocument();
    expect(screen.queryByText('wizard.stepIndicator')).not.toBeInTheDocument();
  });

  it('renders only back button when current is not in steps', () => {
    const { container } = render(<ProgressIndicator steps={['a', 'b']} current="c" onBack={vi.fn()} />);
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    expect(screen.queryByText(/wizard.stepIndicator/)).not.toBeInTheDocument();
    expect(document.querySelectorAll('.h-2.rounded-full')).toHaveLength(0);
    expect(container.querySelector('.grid')).toBeInTheDocument();
  });
});
