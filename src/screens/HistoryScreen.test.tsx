import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HistoryScreen } from './HistoryScreen';
import { useTreatmentStore } from '@/store/useTreatmentStore';

describe('HistoryScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 15, 8, 0, 0));
    useTreatmentStore.getState().fullReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders null when there is no startDate', () => {
    const { container } = render(<HistoryScreen onBack={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders title, summary metrics and day cards', () => {
    const onBack = vi.fn();
    useTreatmentStore.getState().setConfig({ totalDays: 3, sessionsPerDay: 3 });
    useTreatmentStore.setState({
      startDate: '2026-01-14',
      sessions: {
        '2026-01-14': {
          'session-1': 'completed',
          'session-2': 'completed',
          'session-3': 'completed',
        },
        '2026-01-15': {
          'session-1': 'completed',
        },
      },
      sessionDurations: {
        '2026-01-14': {
          'session-1': 180,
          'session-2': 195,
          'session-3': 210,
        },
        '2026-01-15': {
          'session-1': 200,
        },
      },
    });

    render(<HistoryScreen onBack={onBack} />);

    expect(screen.getByText('history.title')).toBeInTheDocument();
    expect(screen.getByText('history.dayN:{"n":1}')).toBeInTheDocument();
    expect(screen.getByText('history.dayN:{"n":2}')).toBeInTheDocument();
    expect(screen.getByText('history.dayN:{"n":3}')).toBeInTheDocument();

    const backBtn = screen.getByRole('button', { name: 'common.back' });
    fireEvent.click(backBtn);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('filters by completed and pending days', () => {
    useTreatmentStore.getState().setConfig({ totalDays: 3, sessionsPerDay: 2 });
    useTreatmentStore.setState({
      startDate: '2026-01-14',
      sessions: {
        '2026-01-14': {
          'session-1': 'completed',
          'session-2': 'completed',
        },
        '2026-01-15': {
          'session-1': 'completed',
        },
      },
    });

    render(<HistoryScreen onBack={vi.fn()} />);

    expect(screen.getByText('history.dayN:{"n":1}')).toBeInTheDocument();
    expect(screen.getByText('history.dayN:{"n":2}')).toBeInTheDocument();
    expect(screen.getByText('history.dayN:{"n":3}')).toBeInTheDocument();

    const completedFilter = screen.getByRole('button', { name: 'history.filterCompleted' });
    fireEvent.click(completedFilter);

    expect(screen.getByText('history.dayN:{"n":1}')).toBeInTheDocument();
    expect(screen.queryByText('history.dayN:{"n":2}')).not.toBeInTheDocument();
    expect(screen.queryByText('history.dayN:{"n":3}')).not.toBeInTheDocument();

    const pendingFilter = screen.getByRole('button', { name: 'history.filterPending' });
    fireEvent.click(pendingFilter);

    expect(screen.queryByText('history.dayN:{"n":1}')).not.toBeInTheDocument();
    expect(screen.getByText('history.dayN:{"n":2}')).toBeInTheDocument();
    expect(screen.getByText('history.dayN:{"n":3}')).toBeInTheDocument();
  });

  it('renders morning, midday, and evening slot names when sessionsPerDay is 3', () => {
    useTreatmentStore.getState().setConfig({ totalDays: 1, sessionsPerDay: 3 });
    useTreatmentStore.setState({
      startDate: '2026-01-15',
      sessions: {
        '2026-01-15': {
          'session-1': 'completed',
          'session-4': 'completed',
        },
      },
    });

    render(<HistoryScreen onBack={vi.fn()} />);

    expect(screen.getByText('session.slotMorning')).toBeInTheDocument();
    expect(screen.getByText('session.slotMidday')).toBeInTheDocument();
    expect(screen.getByText('session.slotEvening')).toBeInTheDocument();
    expect(screen.getByText('session.slotExtra:{"n":1}')).toBeInTheDocument();
  });
});
