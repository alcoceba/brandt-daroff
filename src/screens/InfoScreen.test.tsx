import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InfoScreen } from './InfoScreen';

describe('InfoScreen', () => {
  const onBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the header with title', () => {
    render(<InfoScreen onBack={onBack} />);
    expect(screen.getByText('info.title')).toBeInTheDocument();
  });

  it('renders all info sections', () => {
    render(<InfoScreen onBack={onBack} />);
    expect(screen.getByText('wizard.disclaimerTitle')).toBeInTheDocument();
    expect(screen.getByText('info.whatIsVPPBTitle')).toBeInTheDocument();
    expect(screen.getByText('info.whatIsMethodTitle')).toBeInTheDocument();
    expect(screen.getByText('info.cycleTitle')).toBeInTheDocument();
    expect(screen.getByText('info.frequencyTitle')).toBeInTheDocument();
    expect(screen.getByText('info.tipsTitle')).toBeInTheDocument();
    expect(screen.getByText('info.effectivenessTitle')).toBeInTheDocument();
  });

  it('calls onBack when the back button is clicked', () => {
    render(<InfoScreen onBack={onBack} />);
    const backButton = screen.getByRole('button', { name: 'common.back' });
    fireEvent.click(backButton);
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
