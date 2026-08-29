import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DEFAULT_CONFIG } from '@/constants/treatment';
import { WizardManualStep } from './WizardManualStep';

describe('WizardManualStep', () => {
  it('renders title and all field steppers', () => {
    render(
      <WizardManualStep
        values={DEFAULT_CONFIG}
        mode="onboarding"
        onChange={vi.fn()}
        onSave={vi.fn()}
      />,
    );

    expect(screen.getByText('wizard.manualTitle')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'increase' }).length).toBe(6);
    expect(screen.getAllByRole('button', { name: 'decrease' }).length).toBe(6);
  });

  it('calls onChange with incremented value', () => {
    const onChange = vi.fn();
    render(
      <WizardManualStep
        values={DEFAULT_CONFIG}
        mode="onboarding"
        onChange={onChange}
        onSave={vi.fn()}
      />,
    );

    const increaseButtons = screen.getAllByRole('button', { name: 'increase' });
    fireEvent.click(increaseButtons[0]);
    expect(onChange).toHaveBeenCalledWith('cyclesPerSession', 6);
  });

  it('calls onChange with decremented value', () => {
    const onChange = vi.fn();
    render(
      <WizardManualStep
        values={DEFAULT_CONFIG}
        mode="onboarding"
        onChange={onChange}
        onSave={vi.fn()}
      />,
    );

    const decreaseButtons = screen.getAllByRole('button', { name: 'decrease' });
    fireEvent.click(decreaseButtons[0]);
    expect(onChange).toHaveBeenCalledWith('cyclesPerSession', 4);
  });

  it('calls onSave when save button is clicked', () => {
    const onSave = vi.fn();
    render(
      <WizardManualStep
        values={DEFAULT_CONFIG}
        mode="onboarding"
        onChange={vi.fn()}
        onSave={onSave}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'wizard.save' }));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('shows save-only label in reconfigure mode', () => {
    render(
      <WizardManualStep
        values={DEFAULT_CONFIG}
        mode="reconfigure"
        onChange={vi.fn()}
        onSave={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'wizard.saveOnly' })).toBeInTheDocument();
  });
});
