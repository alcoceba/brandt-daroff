import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WizardDisclaimerStep } from './WizardDisclaimerStep';

describe('WizardDisclaimerStep', () => {
  it('renders title, body and storage/privacy warning', () => {
    render(<WizardDisclaimerStep />);

    expect(screen.getByText('wizard.disclaimerTitle')).toBeInTheDocument();
    expect(screen.getByText('wizard.disclaimerBody')).toBeInTheDocument();
    expect(screen.getByText('wizard.disclaimerBody2')).toBeInTheDocument();
    expect(screen.getByText('wizard.storagePrivacyNotice')).toBeInTheDocument();
    expect(screen.getByText('wizard.privateBrowsingWarningHighlight')).toBeInTheDocument();
  });
});
