import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InfoContent } from './InfoContent';

describe('InfoContent', () => {
  it('renders all info sections', () => {
    render(<InfoContent />);

    expect(screen.getByText('info.whatIsVPPBTitle')).toBeInTheDocument();
    expect(screen.getByText('info.whatIsMethodTitle')).toBeInTheDocument();
    expect(screen.getByText('info.cycleTitle')).toBeInTheDocument();
    expect(screen.getByText('info.frequencyTitle')).toBeInTheDocument();
    expect(screen.getByText('info.tipsTitle')).toBeInTheDocument();
    expect(screen.getByText('info.effectivenessTitle')).toBeInTheDocument();
  });

  it('renders inline step cards', () => {
    const { container } = render(<InfoContent />);
    const images = container.querySelectorAll('img');
    expect(images.length).toBeGreaterThanOrEqual(7);
  });
});
