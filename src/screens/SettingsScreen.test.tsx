import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { SettingsScreen } from './SettingsScreen';
import { useTreatmentStore } from '@/store/useTreatmentStore';

describe('SettingsScreen', () => {
  const onBack = vi.fn();
  const onReconfigure = vi.fn();
  const onFullReset = vi.fn();

  beforeEach(() => {
    useTreatmentStore.getState().fullReset();
    vi.clearAllMocks();
  });

  it('renders the header with title', () => {
    render(<SettingsScreen onBack={onBack} onReconfigure={onReconfigure} onFullReset={onFullReset} />);
    expect(screen.getByText('settings.title')).toBeInTheDocument();
  });

  it('toggles sound setting and updates the store', () => {
    render(<SettingsScreen onBack={onBack} onReconfigure={onReconfigure} onFullReset={onFullReset} />);
    const soundButton = screen.getByRole('button', { name: /settings.sound/i });
    expect(useTreatmentStore.getState().settings.sound).toBe(true);
    fireEvent.click(soundButton);
    expect(useTreatmentStore.getState().settings.sound).toBe(false);
    fireEvent.click(soundButton);
    expect(useTreatmentStore.getState().settings.sound).toBe(true);
  });

  it('toggles vibration setting and updates the store', () => {
    render(<SettingsScreen onBack={onBack} onReconfigure={onReconfigure} onFullReset={onFullReset} />);
    const vibrationButton = screen.getByRole('button', { name: /settings.vibration/i });
    expect(useTreatmentStore.getState().settings.vibration).toBe(true);
    fireEvent.click(vibrationButton);
    expect(useTreatmentStore.getState().settings.vibration).toBe(false);
    fireEvent.click(vibrationButton);
    expect(useTreatmentStore.getState().settings.vibration).toBe(true);
  });

  it('opens the language screen when language row is clicked', () => {
    render(<SettingsScreen onBack={onBack} onReconfigure={onReconfigure} onFullReset={onFullReset} />);
    const languageButton = screen.getByRole('button', { name: /settings.language/i });
    fireEvent.click(languageButton);
    expect(screen.getByText('settings.language')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /English/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Català' })).toBeInTheDocument();
  });

  it('calls onReconfigure when reconfigure row is clicked', () => {
    render(<SettingsScreen onBack={onBack} onReconfigure={onReconfigure} onFullReset={onFullReset} />);
    const reconfigureButton = screen.getByRole('button', { name: /home.reconfigure/i });
    fireEvent.click(reconfigureButton);
    expect(onReconfigure).toHaveBeenCalledTimes(1);
  });

  it('calls onBack when the back button is clicked', () => {
    render(<SettingsScreen onBack={onBack} onReconfigure={onReconfigure} onFullReset={onFullReset} />);
    const backButton = screen.getByRole('button', { name: 'common.back' });
    fireEvent.click(backButton);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('triggers full reset after confirming the reset dialog', () => {
    render(<SettingsScreen onBack={onBack} onReconfigure={onReconfigure} onFullReset={onFullReset} />);
    useTreatmentStore.getState().completeOnboarding();
    useTreatmentStore.getState().setSessionStatus('2026-07-21', 'session-1', 'completed');

    const resetButton = screen.getByRole('button', { name: /home.reset/i });
    fireEvent.click(resetButton);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    const confirm = within(dialog).getByRole('button', { name: 'home.reset' });
    fireEvent.click(confirm);

    expect(onFullReset).toHaveBeenCalledTimes(1);
    expect(useTreatmentStore.getState().onboardingComplete).toBe(false);
    expect(useTreatmentStore.getState().sessions).toEqual({});
  });
});
