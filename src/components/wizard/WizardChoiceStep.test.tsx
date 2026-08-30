import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WizardChoiceStep } from './WizardChoiceStep';

describe('WizardChoiceStep', () => {
  it('renders title and subtitle in onboarding mode', () => {
    render(
      <WizardChoiceStep
        selectedChoice="defaults"
        isReconfigure={false}
        isUsingDefaults={false}
        onSelectChoice={vi.fn()}
      />,
    );

    expect(screen.getByText('wizard.choiceTitle')).toBeInTheDocument();
    expect(screen.getByText('wizard.choiceSubtitle')).toBeInTheDocument();
  });

  it('renders reconfigure title and subtitle', () => {
    render(
      <WizardChoiceStep
        selectedChoice="defaults"
        isReconfigure
        isUsingDefaults={false}
        onSelectChoice={vi.fn()}
      />,
    );

    expect(screen.getByText('wizard.reconfigureTitle')).toBeInTheDocument();
    expect(screen.getByText('wizard.reconfigureSubtitle')).toBeInTheDocument();
  });

  it('highlights the selected choice', () => {
    render(
      <WizardChoiceStep
        selectedChoice="defaults"
        isReconfigure={false}
        isUsingDefaults={false}
        onSelectChoice={vi.fn()}
      />,
    );

    const defaultsButton = screen.getByRole('button', { name: /wizard.defaults/i });
    expect(defaultsButton).toHaveClass('border-brand-500');
  });

  it('calls onSelectChoice with defaults when defaults option is clicked', () => {
    const onSelectChoice = vi.fn();
    render(
      <WizardChoiceStep
        selectedChoice="manual"
        isReconfigure={false}
        isUsingDefaults={false}
        onSelectChoice={onSelectChoice}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /wizard.defaults/i }));
    expect(onSelectChoice).toHaveBeenCalledWith('defaults');
  });

  it('calls onSelectChoice with manual when manual option is clicked', () => {
    const onSelectChoice = vi.fn();
    render(
      <WizardChoiceStep
        selectedChoice="defaults"
        isReconfigure={false}
        isUsingDefaults={false}
        onSelectChoice={onSelectChoice}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /wizard.manual/i }));
    expect(onSelectChoice).toHaveBeenCalledWith('manual');
  });

  it('shows using-now indicator for defaults when using defaults in reconfigure mode', () => {
    render(
      <WizardChoiceStep
        selectedChoice="defaults"
        isReconfigure
        isUsingDefaults
        onSelectChoice={vi.fn()}
      />,
    );

    expect(screen.getByText('wizard.usingNow')).toBeInTheDocument();
  });

  it('shows using-now indicator for manual when not using defaults in reconfigure mode', () => {
    render(
      <WizardChoiceStep
        selectedChoice="manual"
        isReconfigure
        isUsingDefaults={false}
        onSelectChoice={vi.fn()}
      />,
    );

    expect(screen.getByText('wizard.usingNow')).toBeInTheDocument();
  });
});
