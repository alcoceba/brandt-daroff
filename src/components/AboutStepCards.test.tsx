import { render, screen } from '@testing-library/react';
import { AboutStepCards } from './AboutStepCards';

describe('AboutStepCards', () => {
  it('renders 7 step cards', () => {
    render(<AboutStepCards />);
    for (let i = 1; i <= 7; i += 1) {
      expect(screen.getAllByText(`wizard.aboutStep${i}`).length).toBeGreaterThanOrEqual(1);
    }
  });

  it('renders duration badges for timed steps', () => {
    render(<AboutStepCards />);
    expect(screen.getAllByText('30s').length).toBeGreaterThanOrEqual(3);
    expect(screen.getAllByText('2 min').length).toBeGreaterThanOrEqual(1);
  });

  it('renders step images from public/steps', () => {
    render(<AboutStepCards />);
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThanOrEqual(7);
    images.forEach((img) => {
      expect(img).toHaveAttribute('src', expect.stringMatching(/\/steps\/step-\d+\.png$/));
    });
  });
});
