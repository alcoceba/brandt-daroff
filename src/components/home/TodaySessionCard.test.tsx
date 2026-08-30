import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodaySessionCard } from './TodaySessionCard';

describe('TodaySessionCard', () => {
  const baseProps = {
    todaysSessionsLabel: "Today's sessions",
    progressLabel: '1 / 3',
    goalReached: false,
    hasInProgress: false,
    isInProgress: false,
    extrasCompletedToday: 0,
    buttonLabel: 'Start',
    buttonSubLabel: 'Session 1',
    showExtraBadge: false,
    extraBadgeLabel: 'Extra',
    goalReachedLabel: 'Goal reached',
    extraDoneLabel: '+1 extra',
    extrasDoneLabel: '+2 extras',
    onStart: vi.fn(),
  };

  it('renders pending session and starts on click', () => {
    render(<TodaySessionCard {...baseProps} />);
    expect(screen.getByText("Today's sessions")).toBeInTheDocument();
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Start/ }));
    expect(baseProps.onStart).toHaveBeenCalledTimes(1);
  });

  it('shows in-progress styling when a session is in progress', () => {
    render(<TodaySessionCard {...baseProps} isInProgress buttonLabel="Resume" buttonSubLabel="Session 2" />);
    const button = screen.getByRole('button', { name: /Resume/ });
    expect(button).toBeInTheDocument();
    expect(button.className).toContain('border-state-progress');
  });

  it('shows goal reached banner and extra count', () => {
    render(
      <TodaySessionCard
        {...baseProps}
        goalReached
        hasInProgress={false}
        extrasCompletedToday={2}
        buttonLabel="Extra session"
      />,
    );
    expect(screen.getByText('Goal reached')).toBeInTheDocument();
    expect(screen.getByText('+2 extras')).toBeInTheDocument();
  });

  it('shows extra badge on the sublabel', () => {
    render(<TodaySessionCard {...baseProps} showExtraBadge buttonSubLabel="Session 4" />);
    expect(screen.getByText('Extra')).toBeInTheDocument();
    expect(screen.getByText('Session 4')).toBeInTheDocument();
  });
});
