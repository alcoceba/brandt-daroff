import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WizardAboutDetailStep } from './WizardAboutDetailStep';

describe('WizardAboutDetailStep', () => {
  it('renders title and all info sections with inline steps', () => {
    const { container } = render(<WizardAboutDetailStep />);

    expect(screen.getByText('info.title')).toBeInTheDocument();
    expect(screen.getByText('info.whatIsVPPBTitle')).toBeInTheDocument();
    const images = container.querySelectorAll('img');
    expect(images.length).toBeGreaterThanOrEqual(7);
  });
});
