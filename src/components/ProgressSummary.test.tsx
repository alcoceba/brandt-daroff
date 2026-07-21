import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressSummary } from './ProgressSummary';
import { useTreatmentStore } from '@/store/useTreatmentStore';

describe('ProgressSummary component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 15, 8, 0, 0));
    useTreatmentStore.getState().fullReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing when there is no startDate', () => {
    const { container } = render(<ProgressSummary />);
    expect(container.firstChild).toBeNull();
  });

  it('shows completed sessions and percentage', () => {
    const store = useTreatmentStore.getState();
    store.setConfig({ totalDays: 10, sessionsPerDay: 2 });
    useTreatmentStore.setState({ startDate: '2026-01-14' });
    store.setSessionStatus('2026-01-14', 'session-1', 'completed');

    render(<ProgressSummary />);

    expect(screen.getByText('home.sessionsSummary:{"done":1,"total":20}')).toBeInTheDocument();
    expect(screen.getByText('5%')).toBeInTheDocument();
  });

  it('shows streak, invested time and days left', () => {
    const store = useTreatmentStore.getState();
    store.setConfig({ totalDays: 4, sessionsPerDay: 1 });
    useTreatmentStore.setState({ startDate: '2026-01-14' });
    store.setSessionStatus('2026-01-14', 'session-1', 'completed');
    store.setSessionDuration('2026-01-14', 'session-1', 90);

    render(<ProgressSummary />);

    expect(screen.getByText('home.streak:{"count":1}')).toBeInTheDocument();
    expect(screen.getByText('1m')).toBeInTheDocument();
    expect(screen.getByText('home.daysLeft:{"count":3}')).toBeInTheDocument();
    expect(screen.queryByText(/home.estimatedLeft/)).toBeNull();
  });

  it('hides days left and estimated time when treatment is finished', () => {
    const store = useTreatmentStore.getState();
    store.setConfig({ totalDays: 1, sessionsPerDay: 1 });
    useTreatmentStore.setState({ startDate: '2026-01-14' });
    store.setSessionStatus('2026-01-14', 'session-1', 'completed');

    render(<ProgressSummary />);

    expect(screen.queryByText(/home.daysLeft/)).toBeNull();
    expect(screen.queryByText(/home.estimatedLeft/)).toBeNull();
  });

  it('does not show streak when it is zero', () => {
    const store = useTreatmentStore.getState();
    store.setConfig({ totalDays: 4, sessionsPerDay: 1 });
    useTreatmentStore.setState({ startDate: '2026-01-14' });

    render(<ProgressSummary />);

    expect(screen.queryByText(/home.streak/)).toBeNull();
  });
});
