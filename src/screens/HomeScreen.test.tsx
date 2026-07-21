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

  it('shows treatment complete state when treatment days have passed', () => {
    useTreatmentStore.getState().completeOnboarding();
    useTreatmentStore.setState({ startDate: addDays(todayISO(), -15) });
    renderScreen();

    expect(screen.getByText('home.complete')).toBeInTheDocument();
    expect(screen.getByText('home.treatmentComplete')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'common.close' })).toBeInTheDocument();
  });

  it('dismisses the treatment complete notice', () => {
    useTreatmentStore.getState().completeOnboarding();
    useTreatmentStore.setState({ startDate: addDays(todayISO(), -15) });
    renderScreen();

    fireEvent.click(screen.getByRole('button', { name: 'common.close' }));

    expect(screen.queryByText('home.treatmentComplete')).not.toBeInTheDocument();
    expect(screen.getByText('home.todaysSessions')).toBeInTheDocument();
  });

  it('opens settings and info screens', () => {
    useTreatmentStore.getState().completeOnboarding();
    renderScreen();

    fireEvent.click(screen.getByText('info.title').closest('button') as HTMLButtonElement);
    expect(onOpenInfo).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('home.settings').closest('button') as HTMLButtonElement);
    expect(onOpenSettings).toHaveBeenCalledTimes(1);
  });
});
