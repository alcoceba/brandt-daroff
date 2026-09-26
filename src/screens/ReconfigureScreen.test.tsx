import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReconfigureScreen } from './ReconfigureScreen';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { DEFAULT_CONFIG } from '@/constants/treatment';

describe('ReconfigureScreen', () => {
  const onBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useTreatmentStore.getState().fullReset();
  });

  it('renders header, form, defaults button and save button', () => {
    render(<ReconfigureScreen onBack={onBack} />);

    expect(screen.getByText('home.reconfigure')).toBeInTheDocument();
    expect(screen.getByText('wizard.defaults')).toBeInTheDocument();
    expect(screen.getByText('wizard.save')).toBeInTheDocument();
  });

  it('calls onBack when back button is pressed', () => {
    render(<ReconfigureScreen onBack={onBack} />);

    const backButton = screen.getByRole('button', { name: 'common.back' });
    fireEvent.click(backButton);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('updates a value, saves, and updates the store and navigates back', () => {
    render(<ReconfigureScreen onBack={onBack} />);

    const increaseButtons = screen.getAllByRole('button', { name: 'increase' });
    fireEvent.click(increaseButtons[0]); // Increases cyclesPerSession from 5 to 6

    const saveButton = screen.getByRole('button', { name: /wizard\.save/i });
    fireEvent.click(saveButton);

    expect(useTreatmentStore.getState().config.cyclesPerSession).toBe(6);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('restores defaults when restore button is clicked', () => {
    useTreatmentStore.getState().setConfig({ ...DEFAULT_CONFIG, totalDays: 30 });
    render(<ReconfigureScreen onBack={onBack} />);

    const defaultsButton = screen.getByRole('button', { name: /wizard\.defaults/i });
    fireEvent.click(defaultsButton);

    const saveButton = screen.getByRole('button', { name: /wizard\.save/i });
    fireEvent.click(saveButton);

    expect(useTreatmentStore.getState().config.totalDays).toBe(DEFAULT_CONFIG.totalDays);
  });
});
