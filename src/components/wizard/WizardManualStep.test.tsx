import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DEFAULT_CONFIG } from '@/constants/treatment';
import { WizardManualStep } from './WizardManualStep';

describe('WizardManualStep', () => {
  it('renders title and all field steppers', () => {
    render(<WizardManualStep values={DEFAULT_CONFIG} onChange={vi.fn()} />);

    expect(screen.getByText('wizard.manualTitle')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'increase' }).length).toBe(6);
    expect(screen.getAllByRole('button', { name: 'decrease' }).length).toBe(6);
  });

  it('calls onChange with incremented value', () => {
    const onChange = vi.fn();
    render(<WizardManualStep values={DEFAULT_CONFIG} onChange={onChange} />);

    const increaseButtons = screen.getAllByRole('button', { name: 'increase' });
    fireEvent.click(increaseButtons[0]);
    expect(onChange).toHaveBeenCalledWith('cyclesPerSession', 6);
  });

  it('calls onChange with decremented value', () => {
    const onChange = vi.fn();
    render(<WizardManualStep values={DEFAULT_CONFIG} onChange={onChange} />);

    const decreaseButtons = screen.getAllByRole('button', { name: 'decrease' });
    fireEvent.click(decreaseButtons[0]);
    expect(onChange).toHaveBeenCalledWith('cyclesPerSession', 4);
  });
});
