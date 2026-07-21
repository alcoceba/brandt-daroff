import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WizardScreen } from './WizardScreen';
import { useTreatmentStore } from '@/store/useTreatmentStore';

describe('WizardScreen', () => {
  const onDone = vi.fn();
  const onBack = vi.fn();

  beforeEach(() => {
    useTreatmentStore.getState().fullReset();
    vi.clearAllMocks();
  });

  it('renders the onboarding choice screen', () => {
    render(<WizardScreen onDone={onDone} />);
    expect(screen.getByText((text) => text.includes('wizard.choiceTitle'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /wizard.defaults/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /wizard.manual/i })).toBeInTheDocument();
    expect(screen.getByText('wizard.disclaimerTitle')).toBeInTheDocument();
  });

  it('chooses defaults path and completes onboarding', () => {
    render(<WizardScreen onDone={onDone} />);
    fireEvent.click(screen.getByRole('button', { name: /wizard.defaults/i }));

    expect(onDone).toHaveBeenCalledTimes(1);
    expect(useTreatmentStore.getState().onboardingComplete).toBe(true);
    expect(useTreatmentStore.getState().startDate).not.toBeNull();
  });

  it('navigates to manual configuration with steppers', () => {
    render(<WizardScreen onDone={onDone} />);
    fireEvent.click(screen.getByRole('button', { name: /wizard.manual/i }));

    expect(screen.getByText('wizard.manualTitle')).toBeInTheDocument();
    expect(screen.getByText('wizard.cyclesPerSession')).toBeInTheDocument();
    expect(screen.getByText('wizard.positionDuration')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'wizard.save' })).toBeInTheDocument();
  });

  it('saves manual configuration to the store', () => {
    render(<WizardScreen onDone={onDone} />);
    fireEvent.click(screen.getByRole('button', { name: /wizard.manual/i }));

    const increaseButtons = screen.getAllByRole('button', { name: 'increase' });
    // Increase cycles per session from 5 to 6.
    fireEvent.click(increaseButtons[0]);

    fireEvent.click(screen.getByRole('button', { name: 'wizard.save' }));

    expect(useTreatmentStore.getState().config.cyclesPerSession).toBe(6);
    expect(useTreatmentStore.getState().onboardingComplete).toBe(true);
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('resets values to defaults from the manual screen', () => {
    render(<WizardScreen onDone={onDone} />);
    fireEvent.click(screen.getByRole('button', { name: /wizard.manual/i }));

    const increaseButtons = screen.getAllByRole('button', { name: 'increase' });
    fireEvent.click(increaseButtons[0]);

    expect(screen.getAllByText('6')[0]).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'wizard.resetDefault' }));

    expect(useTreatmentStore.getState().config.cyclesPerSession).toBe(5);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders reconfigure mode with back button and using-now indicator', () => {
    render(<WizardScreen onDone={onDone} onBack={onBack} mode="reconfigure" />);

    expect(screen.getByText('wizard.reconfigureTitle')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'common.back' })).toBeInTheDocument();
    expect(screen.getAllByText('wizard.usingNow').length).toBeGreaterThanOrEqual(1);
  });

  it('calls onBack from reconfigure choice screen', () => {
    render(<WizardScreen onDone={onDone} onBack={onBack} mode="reconfigure" />);
    fireEvent.click(screen.getByRole('button', { name: 'common.back' }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('shows using-now on manual option when config differs from defaults', () => {
    useTreatmentStore.getState().setConfig({ positionDuration: 45 });
    render(<WizardScreen onDone={onDone} onBack={onBack} mode="reconfigure" />);

    expect(screen.getAllByText('wizard.usingNow').length).toBeGreaterThanOrEqual(1);
  });

  it('uses save-only label in reconfigure manual mode', () => {
    render(<WizardScreen onDone={onDone} onBack={onBack} mode="reconfigure" />);
    fireEvent.click(screen.getByRole('button', { name: /wizard.manual/i }));

    expect(screen.getByRole('button', { name: 'wizard.saveOnly' })).toBeInTheDocument();
  });
});
