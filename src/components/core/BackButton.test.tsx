import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BackButton } from './BackButton';

describe('BackButton component', () => {
  it('should render the button with the correct translation aria-label', () => {
    render(<BackButton onBack={() => {}} />);
    
    const button = screen.getByRole('button', { name: 'common.back' });
    expect(button).toBeInTheDocument();
  });

  it('should call onBack callback when clicked', () => {
    const handleBack = vi.fn();
    render(<BackButton onBack={handleBack} />);
    
    const button = screen.getByRole('button', { name: 'common.back' });
    fireEvent.click(button);

    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('should apply custom className', () => {
    render(<BackButton onBack={() => {}} className="custom-class" />);
    
    const button = screen.getByRole('button', { name: 'common.back' });
    expect(button).toHaveClass('custom-class');
  });
});
