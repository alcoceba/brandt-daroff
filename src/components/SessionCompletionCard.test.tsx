import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SessionCompletionCard } from './SessionCompletionCard';

describe('SessionCompletionCard component', () => {
  const onDone = vi.fn();
  const defaultProps = {
    dayNumber: 5,
    isExtraSession: false,
    completedCount: 7,
    extraCompletedCount: 0,
    totalSessions: 14,
    elapsedSeconds: 95,
    onDone,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders completion stats and elapsed time', () => {
    render(<SessionCompletionCard {...defaultProps} />);

    expect(screen.getByText('cycle.title:{"x":5}')).toBeInTheDocument();
    expect(screen.getByText('cycle.completionTitle')).toBeInTheDocument();
    expect(screen.getByText('cycle.completionBody')).toBeInTheDocument();
    expect(screen.getByText('cycle.timeInvested')).toBeInTheDocument();
    expect(screen.getByText('1:35')).toBeInTheDocument();
    expect(screen.getByText('cycle.completionTotalSessions')).toBeInTheDocument();
    expect(screen.getByText('7 / 14')).toBeInTheDocument();
  });

  it('renders the extra-session badge only when isExtraSession is true', () => {
    const { rerender } = render(<SessionCompletionCard {...defaultProps} />);
    expect(screen.queryByText('home.extraSession')).not.toBeInTheDocument();

    rerender(<SessionCompletionCard {...defaultProps} isExtraSession />);
    expect(screen.getByText('home.extraSession')).toBeInTheDocument();
  });

  it('renders the extra-sessions count card only when extraCompletedCount is greater than 0', () => {
    const { rerender } = render(
      <SessionCompletionCard {...defaultProps} extraCompletedCount={0} />
    );
    expect(screen.queryByText('cycle.completionExtraSessions')).not.toBeInTheDocument();

    rerender(<SessionCompletionCard {...defaultProps} extraCompletedCount={2} />);
    expect(screen.getByText('cycle.completionExtraSessions')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('calls onDone when the done button is clicked', () => {
    render(<SessionCompletionCard {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'cycle.done' }));
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
