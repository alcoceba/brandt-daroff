import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WizardFooter } from './WizardFooter';

describe('WizardFooter', () => {
  it('renders back button when showBack is true', () => {
    render(<WizardFooter showBack onBack={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'common.back' })).toBeInTheDocument();
  });

  it('does not render back button when showBack is false', () => {
    render(<WizardFooter showBack={false} onBack={vi.fn()} />);
    expect(screen.queryByRole('button', { name: 'common.back' })).not.toBeInTheDocument();
  });

  it('renders a size placeholder so dots stay aligned with other steps', () => {
    const { container } = render(
      <WizardFooter showBack={false} onBack={vi.fn()} showDots steps={['a']} current="a" />,
    );

    const placeholder = container.querySelector('[aria-hidden="true"]');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveClass('min-h-touch', 'min-w-touch');
  });

  it('calls onBack when back button is clicked', () => {
    const onBack = vi.fn();
    render(<WizardFooter showBack onBack={onBack} />);
    fireEvent.click(screen.getByRole('button', { name: 'common.back' }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders step dots when showDots is true with steps and current', () => {
    const { container } = render(
      <WizardFooter showBack onBack={vi.fn()} showDots steps={['a', 'b', 'c']} current="b" />,
    );

    const dotsContainer = container.querySelector('.flex-1');
    expect(dotsContainer).toBeInTheDocument();
    expect(dotsContainer?.querySelectorAll('span').length).toBe(4);
  });

  it('renders step indicator above the dots', () => {
    render(
      <WizardFooter showBack onBack={vi.fn()} showDots steps={['a', 'b', 'c']} current="b" />,
    );

    expect(screen.getByText(/wizard.stepIndicator/)).toBeInTheDocument();
  });

  it('does not render step dots when showDots is false', () => {
    const { container } = render(<WizardFooter showBack onBack={vi.fn()} showDots={false} />);

    expect(container.querySelector('.flex-1')).not.toBeInTheDocument();
  });

  it('does not render step dots when steps are missing', () => {
    const { container } = render(
      <WizardFooter showBack onBack={vi.fn()} showDots current="b" />,
    );

    expect(container.querySelector('.flex-1')).not.toBeInTheDocument();
  });
});
