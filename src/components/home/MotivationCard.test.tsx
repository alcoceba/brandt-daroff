import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MotivationCard } from './MotivationCard';

describe('MotivationCard', () => {
  it('renders the message when provided', () => {
    render(<MotivationCard message="Keep going!" />);
    expect(screen.getByText('Keep going!')).toBeInTheDocument();
  });

  it('renders nothing when message is null', () => {
    const { container } = render(<MotivationCard message={null} />);
    expect(container.firstChild).toBeNull();
  });
});
