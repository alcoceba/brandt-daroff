import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SessionReadyScreen } from './SessionReadyScreen';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { todayISO } from '@/utils/date';

describe('SessionReadyScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useTreatmentStore.getState().fullReset();
    useTreatmentStore.getState().completeOnboarding();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders title, day and scheduled session number', () => {
    const onDone = vi.fn();
    render(<SessionReadyScreen sessionId="session-1" onDone={onDone} />);

    expect(screen.getByText('sessionReady.title')).toBeInTheDocument();
    expect(
      screen.getByText('sessionReady.subtitle:{"day":1,"session":1,"totalSessions":3}'),
    ).toBeInTheDocument();
  });

  it('renders resume title when session is in progress', () => {
    const onDone = vi.fn();
    useTreatmentStore.getState().setSessionStatus(todayISO(), 'session-2', 'in-progress');
    render(<SessionReadyScreen sessionId="session-2" onDone={onDone} />);

    expect(screen.getByText('sessionReady.resumeTitle')).toBeInTheDocument();
    expect(
      screen.getByText('sessionReady.subtitle:{"day":1,"session":2,"totalSessions":3}'),
    ).toBeInTheDocument();
  });

  it('renders extra session label for extra sessions', () => {
    const onDone = vi.fn();
    render(<SessionReadyScreen sessionId="session-4" onDone={onDone} />);

    expect(screen.getByText('sessionReady.subtitleExtra:{"day":1,"n":1}')).toBeInTheDocument();
  });

  it('calls onDone after timer expires', () => {
    const onDone = vi.fn();
    render(<SessionReadyScreen sessionId="session-1" onDone={onDone} />);

    expect(onDone).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(2300);
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('calls onDone immediately when clicked or key pressed', () => {
    const onDone = vi.fn();
    render(<SessionReadyScreen sessionId="session-1" onDone={onDone} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
