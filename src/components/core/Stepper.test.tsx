import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Stepper } from './Stepper';

describe('Stepper component', () => {
  const defaultProps = {
    label: 'Test Label',
    unit: 'sec',
    description: 'Test Description',
    icon: <span data-testid="stepper-icon">Icon</span>,
    value: 30,
    step: 5,
    min: 10,
    max: 50,
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correct label, description, unit, and icon', () => {
    render(<Stepper {...defaultProps} />);
    
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByTestId('stepper-icon')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('sec')).toBeInTheDocument();
  });

  it('should call onChange with value - step when decrease is clicked', () => {
    render(<Stepper {...defaultProps} />);
    
    const decreaseBtn = screen.getByRole('button', { name: 'decrease' });
    fireEvent.click(decreaseBtn);
    
    expect(defaultProps.onChange).toHaveBeenCalledWith(25);
  });

  it('should call onChange with value + step when increase is clicked', () => {
    render(<Stepper {...defaultProps} />);
    
    const increaseBtn = screen.getByRole('button', { name: 'increase' });
    fireEvent.click(increaseBtn);
    
    expect(defaultProps.onChange).toHaveBeenCalledWith(35);
  });

  it('should clamp value to min when decrease would go below min', () => {
    render(<Stepper {...defaultProps} value={12} min={10} step={5} />);
    
    const decreaseBtn = screen.getByRole('button', { name: 'decrease' });
    fireEvent.click(decreaseBtn);
    
    expect(defaultProps.onChange).toHaveBeenCalledWith(10);
  });

  it('should clamp value to max when increase would go above max', () => {
    render(<Stepper {...defaultProps} value={48} max={50} step={5} />);
    
    const increaseBtn = screen.getByRole('button', { name: 'increase' });
    fireEvent.click(increaseBtn);
    
    expect(defaultProps.onChange).toHaveBeenCalledWith(50);
  });
});
