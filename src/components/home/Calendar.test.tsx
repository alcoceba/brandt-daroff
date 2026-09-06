import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Calendar } from './Calendar';
import { useTreatmentStore } from '@/store/useTreatmentStore';

describe('Calendar component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 15, 8, 0, 0));
    useTreatmentStore.getState().fullReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders null when there is no startDate', () => {
    const { container } = render(<Calendar />);
    expect(container.firstChild).toBeNull();
  });

  it('renders progress bar and day grid with startDate', () => {
    useTreatmentStore.getState().setConfig({ totalDays: 3, sessionsPerDay: 3 });
    useTreatmentStore.setState({ startDate: '2026-01-14' });

    const { container } = render(<Calendar />);

    expect(screen.getByText('home.progress')).toBeInTheDocument();

    const progressBar = container.querySelector('.bg-state-done');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveStyle({ width: '0%' });

    const weeks = container.querySelectorAll('.grid-cols-7');
    expect(weeks.length).toBeGreaterThan(0);
    expect(weeks[0]?.children).toHaveLength(3);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('chunks days into rows of 7', () => {
    useTreatmentStore.getState().setConfig({ totalDays: 14, sessionsPerDay: 3 });
    useTreatmentStore.setState({ startDate: '2026-01-14' });

    const { container } = render(<Calendar />);
    const weeks = container.querySelectorAll('.grid-cols-7');
    expect(weeks).toHaveLength(2);
    weeks.forEach((week) => expect(week.children).toHaveLength(7));
  });

  it('handles completed, pending, future and today states', () => {
    const store = useTreatmentStore.getState();
    store.setConfig({ totalDays: 3, sessionsPerDay: 3 });
    useTreatmentStore.setState({ startDate: '2026-01-14' });

    store.setSessionStatus('2026-01-14', 'session-1', 'completed');
    store.setSessionStatus('2026-01-14', 'session-2', 'completed');
    store.setSessionStatus('2026-01-14', 'session-3', 'completed');

    const { container } = render(<Calendar />);

    const progressBar = container.querySelector('.bg-state-done');
    expect(progressBar).toHaveStyle({ width: '33%' });

    const dayButtons = screen.getAllByRole('button');
    expect(dayButtons).toHaveLength(3);

    expect(dayButtons[0]).toHaveClass('from-state-done/25');
    expect(dayButtons[1]).toHaveClass('ring-brand-500/60');
    expect(dayButtons[2]).toHaveClass('bg-slate-900/30');
    expect(screen.getByText('2')).toHaveClass('text-brand-400');
  });

  it('does not show extra count inside day cells', () => {
    const store = useTreatmentStore.getState();
    store.setConfig({ totalDays: 3, sessionsPerDay: 3 });
    useTreatmentStore.setState({ startDate: '2026-01-14' });

    store.setSessionStatus('2026-01-14', 'session-1', 'completed');
    store.setSessionStatus('2026-01-14', 'session-2', 'completed');
    store.setSessionStatus('2026-01-14', 'session-3', 'completed');
    store.setSessionStatus('2026-01-14', 'session-4', 'completed');

    const { container } = render(<Calendar />);

    expect(container.textContent).not.toContain('+1');
  });

  it('renders milestone ticks on the progress bar', () => {
    const store = useTreatmentStore.getState();
    store.setConfig({ totalDays: 4, sessionsPerDay: 1 });
    useTreatmentStore.setState({ startDate: '2026-01-14' });

    const { container } = render(<Calendar />);

    const barContainer = container.querySelector('.bg-slate-700');
    const ticks = barContainer?.querySelectorAll('.absolute');
    expect(ticks).toHaveLength(3);
  });

  it('renders day columns as accessible buttons', () => {
    const store = useTreatmentStore.getState();
    store.setConfig({ totalDays: 3, sessionsPerDay: 2 });
    useTreatmentStore.setState({ startDate: '2026-01-14' });
    store.setSessionStatus('2026-01-14', 'session-1', 'completed');

    render(<Calendar />);

    const dayButtons = screen.getAllByRole('button');
    expect(dayButtons).toHaveLength(3);
    expect(dayButtons[0]).toHaveAttribute('aria-pressed', 'false');
  });

  it('shows a hint when no day is selected and swaps it for the detail on tap', () => {
    const store = useTreatmentStore.getState();
    store.setConfig({ totalDays: 3, sessionsPerDay: 2 });
    useTreatmentStore.setState({ startDate: '2026-01-14' });
    store.setSessionStatus('2026-01-14', 'session-1', 'completed');

    render(<Calendar />);

    expect(screen.getByText('home.dayDetailHint')).toBeInTheDocument();

    const dayButtons = screen.getAllByRole('button');
    fireEvent.click(dayButtons[0]);

    expect(screen.queryByText('home.dayDetailHint')).not.toBeInTheDocument();

    expect(screen.getByText('home.dayDetail:{"n":1,"completed":1,"total":2}')).toBeInTheDocument();
    expect(dayButtons[0]).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(dayButtons[0]);
    expect(dayButtons[0]).toHaveAttribute('aria-pressed', 'false');
  });

  it('shows future day detail for upcoming days', () => {
    const store = useTreatmentStore.getState();
    store.setConfig({ totalDays: 3, sessionsPerDay: 2 });
    useTreatmentStore.setState({ startDate: '2026-01-14' });

    render(<Calendar />);

    const dayButtons = screen.getAllByRole('button');
    fireEvent.click(dayButtons[2]); // future day

    expect(screen.getByText('home.dayDetailFuture:{"n":3}')).toBeInTheDocument();
  });

  it('shows in-progress day detail', () => {
    const store = useTreatmentStore.getState();
    store.setConfig({ totalDays: 3, sessionsPerDay: 2 });
    useTreatmentStore.setState({ startDate: '2026-01-14' });
    store.setSessionStatus('2026-01-15', 'session-1', 'completed');
    store.setSessionStatus('2026-01-15', 'session-2', 'in-progress');

    render(<Calendar />);

    const dayButtons = screen.getAllByRole('button');
    fireEvent.click(dayButtons[1]); // today

    expect(screen.getByText('home.dayDetailInProgress:{"n":2}')).toBeInTheDocument();
  });

  it('shows extra day detail when a day has extra completions', () => {
    const store = useTreatmentStore.getState();
    store.setConfig({ totalDays: 3, sessionsPerDay: 2 });
    useTreatmentStore.setState({ startDate: '2026-01-14' });
    store.setSessionStatus('2026-01-15', 'session-1', 'completed');
    store.setSessionStatus('2026-01-15', 'session-2', 'completed');
    store.setSessionStatus('2026-01-15', 'session-3', 'completed');

    render(<Calendar />);

    const dayButtons = screen.getAllByRole('button');
    fireEvent.click(dayButtons[1]); // today

    expect(
      screen.getByText('home.dayDetailExtra:{"n":2,"completed":2,"total":2,"extras":1}'),
    ).toBeInTheDocument();
  });
});
