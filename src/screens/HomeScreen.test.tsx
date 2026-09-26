import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HomeScreen } from './HomeScreen';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { todayISO, addDays } from '@/utils/date';

describe('HomeScreen', () => {
  const onStartSession = vi.fn();
  const onOpenSettings = vi.fn();
  const onOpenInfo = vi.fn();

  beforeEach(() => {
    useTreatmentStore.getState().fullReset();
    vi.clearAllMocks();
  });

  function renderScreen() {
    return render(
      <HomeScreen
        onStartSession={onStartSession}
        onOpenSettings={onOpenSettings}
        onOpenInfo={onOpenInfo}
      />,
    );
  }

  it('shows the day header and today sessions section', () => {
    useTreatmentStore.getState().completeOnboarding();
    renderScreen();

    expect(screen.getByText('home.day:{"x":1,"total":14}')).toBeInTheDocument();
    expect(screen.getByText('home.todaysSessions')).toBeInTheDocument();
  });

  it('lists pending sessions and starts the first session', () => {
    useTreatmentStore.getState().completeOnboarding();
    renderScreen();

    expect(
      screen.getByText('home.sessionsCompleted:{"completed":0,"total":3}'),
    ).toBeInTheDocument();

    const startButton = screen.getByRole('button', { name: /home.start/i });
    fireEvent.click(startButton);

    expect(onStartSession).toHaveBeenCalledTimes(1);
    expect(onStartSession).toHaveBeenCalledWith('session-1');
  });

  it('shows resume when a session is in progress', () => {
    useTreatmentStore.getState().completeOnboarding();
    useTreatmentStore.getState().setSessionStatus(todayISO(), 'session-1', 'in-progress');
    renderScreen();

    expect(screen.getByRole('button', { name: /home.resume/i })).toBeInTheDocument();
    expect(screen.getByText('session.sessionN:{"n":1}')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /home.resume/i }));
    expect(onStartSession).toHaveBeenCalledWith('session-1');
  });

  it('advances to the next pending session after earlier sessions are completed', () => {
    useTreatmentStore.getState().completeOnboarding();
    useTreatmentStore.getState().setSessionStatus(todayISO(), 'session-1', 'completed');
    renderScreen();

    fireEvent.click(screen.getByRole('button', { name: /home.start/i }));
    expect(onStartSession).toHaveBeenCalledWith('session-2');
  });

  it('shows goal reached and allows an extra session', () => {
    useTreatmentStore.getState().completeOnboarding();
    useTreatmentStore.getState().setSessionStatus(todayISO(), 'session-1', 'completed');
    useTreatmentStore.getState().setSessionStatus(todayISO(), 'session-2', 'completed');
    useTreatmentStore.getState().setSessionStatus(todayISO(), 'session-3', 'completed');
    renderScreen();

    expect(screen.getByText('home.goalReached')).toBeInTheDocument();
    expect(screen.getByText('home.allSessionsCompletedToday')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /home.addExtraSession/i }));
    expect(onStartSession).toHaveBeenCalledWith('session-4');
  });

  it('does not offer extra sessions before scheduled sessions are complete', () => {
    useTreatmentStore.getState().completeOnboarding();
    useTreatmentStore.getState().setSessionStatus(todayISO(), 'session-1', 'completed');
    useTreatmentStore.getState().setSessionStatus(todayISO(), 'session-2', 'completed');
    renderScreen();

    expect(screen.queryByText('home.goalReached')).not.toBeInTheDocument();
    expect(screen.queryByText('home.addExtraSession')).not.toBeInTheDocument();
    expect(screen.getByText('session.sessionN:{"n":3}')).toBeInTheDocument();
  });

  it('resumes an in-progress extra session and shows the extra badge', () => {
    useTreatmentStore.getState().completeOnboarding();
    useTreatmentStore.getState().setSessionStatus(todayISO(), 'session-1', 'completed');
    useTreatmentStore.getState().setSessionStatus(todayISO(), 'session-2', 'completed');
    useTreatmentStore.getState().setSessionStatus(todayISO(), 'session-3', 'completed');
    useTreatmentStore.getState().setSessionStatus(todayISO(), 'session-4', 'in-progress');
    renderScreen();

    expect(screen.getByRole('button', { name: /home.resume/i })).toBeInTheDocument();
    expect(screen.getByText('session.sessionN:{"n":4}')).toBeInTheDocument();
    expect(screen.getByText('home.extraBadge')).toBeInTheDocument();
    expect(screen.queryByText('home.goalReached')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /home.resume/i }));
    expect(onStartSession).toHaveBeenCalledWith('session-4');
  });

  it('starts the next extra session from the treatment complete card', () => {
    useTreatmentStore.getState().completeOnboarding();
    useTreatmentStore.setState({ startDate: addDays(todayISO(), -15) });
    useTreatmentStore.getState().setSessionStatus(todayISO(), 'session-4', 'in-progress');
    renderScreen();

    fireEvent.click(screen.getByRole('button', { name: /home.addExtraSession/i }));
    expect(onStartSession).toHaveBeenCalledWith('session-5');
  });

  it('shows treatment complete state when treatment days have passed', () => {
    useTreatmentStore.getState().completeOnboarding();
    useTreatmentStore.setState({ startDate: addDays(todayISO(), -15) });
    renderScreen();

    expect(screen.getByText('home.complete')).toBeInTheDocument();
    expect(screen.getByText('home.treatmentComplete')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'home.startNewTreatment' })).toBeInTheDocument();
  });

  it('starts a new treatment from the complete card after confirmation', () => {
    useTreatmentStore.getState().completeOnboarding();
    useTreatmentStore.setState({ startDate: addDays(todayISO(), -15) });
    renderScreen();

    fireEvent.click(screen.getByRole('button', { name: 'home.startNewTreatment' }));

    expect(screen.getByText('home.confirmStartNewTreatment')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'common.confirm' }));

    expect(screen.queryByText('home.treatmentComplete')).not.toBeInTheDocument();
    expect(screen.getByText('home.day:{"x":1,"total":14}')).toBeInTheDocument();
  });

  it('cancels starting new treatment when cancel is clicked', () => {
    useTreatmentStore.getState().completeOnboarding();
    useTreatmentStore.setState({ startDate: addDays(todayISO(), -15) });
    renderScreen();

    fireEvent.click(screen.getByRole('button', { name: 'home.startNewTreatment' }));
    expect(screen.getByText('home.confirmStartNewTreatment')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'common.cancel' }));
    expect(screen.queryByText('home.confirmStartNewTreatment')).not.toBeInTheDocument();
  });

  it('shows different motivation messages depending on time of day and progress', () => {
    vi.useFakeTimers();
    useTreatmentStore.getState().completeOnboarding();

    // Morning, 0 completed
    vi.setSystemTime(new Date(2026, 0, 15, 9, 0, 0));
    const { unmount: u1 } = renderScreen();
    expect(screen.getByText('home.motivationStartDay')).toBeInTheDocument();
    u1();

    // Afternoon, 0 completed
    vi.setSystemTime(new Date(2026, 0, 15, 16, 0, 0));
    const { unmount: u2 } = renderScreen();
    expect(screen.getByText('home.motivationNoSessionsAfternoon')).toBeInTheDocument();
    u2();

    // Night (>= 20h)
    useTreatmentStore.getState().setSessionStatus(todayISO(), 'session-1', 'completed');
    vi.setSystemTime(new Date(2026, 0, 15, 21, 0, 0));
    const { unmount: u3 } = renderScreen();
    expect(screen.getByText('home.motivationLateReminder')).toBeInTheDocument();
    u3();

    // With progress > 0 in morning
    useTreatmentStore.getState().setSessionStatus(todayISO(), 'session-1', 'completed');
    vi.setSystemTime(new Date(2026, 0, 15, 10, 0, 0));
    const { unmount: u4 } = renderScreen();
    expect(screen.getByText('home.motivationProgress')).toBeInTheDocument();
    u4();

    vi.useRealTimers();
  });

  it('opens settings and info screens', () => {
    useTreatmentStore.getState().completeOnboarding();
    renderScreen();

    fireEvent.click(screen.getByText('info.title').closest('button') as HTMLButtonElement);
    expect(onOpenInfo).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('home.settings').closest('button') as HTMLButtonElement);
    expect(onOpenSettings).toHaveBeenCalledTimes(1);
  });

  it('handles null startDate gracefully with default day 1', () => {
    useTreatmentStore.setState({ startDate: null });
    renderScreen();
    expect(screen.getByText('home.day:{"x":1,"total":14}')).toBeInTheDocument();
  });
});
