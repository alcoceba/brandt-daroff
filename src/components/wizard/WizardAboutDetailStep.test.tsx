import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WizardAboutDetailStep } from './WizardAboutDetailStep';

describe('WizardAboutDetailStep', () => {
  it('renders title and all info sections with inline steps', () => {
    const { container } = render(<WizardAboutDetailStep onStart={vi.fn()} />);

    expect(screen.getByText('info.title')).toBeInTheDocument();
    expect(screen.getByText('info.whatIsVPPBTitle')).toBeInTheDocument();
    const images = container.querySelectorAll('img');
    expect(images.length).toBeGreaterThanOrEqual(7);
  });

  it('calls onStart when lets start button is clicked', () => {
    const onStart = vi.fn();
    render(<WizardAboutDetailStep onStart={onStart} />);

    fireEvent.click(screen.getByRole('button', { name: 'wizard.letsStart' }));
    expect(onStart).toHaveBeenCalledTimes(1);
  });
});
