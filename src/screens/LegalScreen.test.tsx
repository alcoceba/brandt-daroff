import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LegalScreen } from './LegalScreen';

describe('LegalScreen', () => {
  it('renders all legal sections and headers', () => {
    const onBack = vi.fn();
    render(<LegalScreen onBack={onBack} />);

    expect(screen.getByText('legal.title')).toBeInTheDocument();
    expect(screen.getByText('legal.medicalDisclaimerTitle')).toBeInTheDocument();
    expect(screen.getByText('legal.privacyTitle')).toBeInTheDocument();
    expect(screen.getByText('legal.termsTitle')).toBeInTheDocument();
    expect(screen.getByText('legal.contactTitle')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'legal.githubLink' })).toHaveAttribute(
      'href',
      'https://github.com/alcoceba/brandt-daroff',
    );
  });

  it('calls onBack when back button is clicked', () => {
    const onBack = vi.fn();
    render(<LegalScreen onBack={onBack} />);

    const backBtn = screen.getByRole('button', { name: 'common.back' });
    fireEvent.click(backBtn);
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
