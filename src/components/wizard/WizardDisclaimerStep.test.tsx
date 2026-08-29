import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WizardDisclaimerStep } from './WizardDisclaimerStep';

describe('WizardDisclaimerStep', () => {
  it('renders title, body and privacy note', () => {
    render(<WizardDisclaimerStep onContinue={vi.fn()} />);

    expect(screen.getByText('wizard.disclaimerTitle')).toBeInTheDocument();
    expect(screen.getByText('wizard.disclaimerBody')).toBeInTheDocument();
    expect(screen.getByText('wizard.disclaimerBody2')).toBeInTheDocument();
    expect(screen.getByText('footer.privacyNote')).toBeInTheDocument();
  });

  it('calls onContinue when continue button is clicked', () => {
    const onContinue = vi.fn();
    render(<WizardDisclaimerStep onContinue={onContinue} />);

    fireEvent.click(screen.getByRole('button', { name: 'wizard.disclaimerContinue' }));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });
});
