import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CountdownRing } from './CountdownRing';

describe('CountdownRing', () => {
  it('renders time when running', () => {
    render(
      <CountdownRing
        secondsRemaining={30}
        totalDuration={30}
        isRunning={true}
        strokeColor="#22c55e"
      />,
    );
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('renders pause icon when not running', () => {
    const { container } = render(
      <CountdownRing
        secondsRemaining={30}
        totalDuration={30}
        isRunning={false}
        strokeColor="#f59e0b"
      />,
    );
    expect(container.querySelector('.timer-pause-icon')).toBeInTheDocument();
  });

  it('renders custom center content if provided', () => {
    render(
      <CountdownRing
        secondsRemaining={15}
        totalDuration={30}
        isRunning={true}
        strokeColor="#22c55e"
        centerContent={<span>Custom</span>}
      />,
    );
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('handles totalDuration = 0 gracefully without center time text', () => {
    const { container } = render(
      <CountdownRing
        secondsRemaining={0}
        totalDuration={0}
        isRunning={false}
        strokeColor="#22c55e"
      />,
    );
    expect(container.querySelector('.timer-text')).toBeNull();
  });
});
