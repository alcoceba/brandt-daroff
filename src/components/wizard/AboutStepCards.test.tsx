import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AboutStepCards } from './AboutStepCards';

describe('AboutStepCards', () => {
  it('renders summary by default', () => {
    render(<AboutStepCards />);
    expect(screen.getByText('wizard.aboutSummary')).toBeInTheDocument();
  });

  it('renders 7 step cards in full variant', () => {
    render(<AboutStepCards variant="full" />);
    for (let i = 1; i <= 7; i += 1) {
      expect(screen.getAllByText(`wizard.aboutStep${i}`).length).toBeGreaterThanOrEqual(1);
    }
  });

  it('renders duration badges for timed steps in full variant', () => {
    render(<AboutStepCards variant="full" />);
    expect(screen.getAllByText('30s').length).toBeGreaterThanOrEqual(3);
    expect(screen.getAllByText('2 min').length).toBeGreaterThanOrEqual(1);
  });

  it('renders step images from public/steps in full variant', () => {
    const { container } = render(<AboutStepCards variant="full" />);
    const images = container.querySelectorAll('img');
    expect(images.length).toBeGreaterThanOrEqual(7);
    images.forEach((img) => {
      expect(img).toHaveAttribute('src', expect.stringMatching(/\/steps\/step-\d+\.png$/));
    });
  });
});
