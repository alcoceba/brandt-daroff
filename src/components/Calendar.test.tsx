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

    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' });
    expect(grid?.children).toHaveLength(3);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
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

    const grid = container.querySelector('.grid') as HTMLElement;
    const dayColumns = Array.from(grid.children);
    expect(dayColumns).toHaveLength(3);

    const yesterdaySquares = Array.from(dayColumns[0].children).slice(1);
    expect(yesterdaySquares).toHaveLength(3);
    yesterdaySquares.forEach((square) => {
      expect(square).toHaveClass('from-state-done/25');
    });

    const todaySquares = Array.from(dayColumns[1].children).slice(1);
    expect(todaySquares).toHaveLength(3);
    todaySquares.forEach((square) => {
      expect(square).toHaveClass('ring-brand-500/40');
    });
    expect(screen.getByText('2')).toHaveClass('text-brand-400');

    const futureSquares = Array.from(dayColumns[2].children).slice(1);
    expect(futureSquares).toHaveLength(3);
    futureSquares.forEach((square) => {
      expect(square).toHaveClass('bg-slate-900/30');
    });
  });

  it('shows the extra sessions indicator when a day has more completions than sessionsPerDay', () => {
    const store = useTreatmentStore.getState();
    store.setConfig({ totalDays: 3, sessionsPerDay: 3 });
    useTreatmentStore.setState({ startDate: '2026-01-14' });

    store.setSessionStatus('2026-01-14', 'session-1', 'completed');
    store.setSessionStatus('2026-01-14', 'session-2', 'completed');
    store.setSessionStatus('2026-01-14', 'session-3', 'completed');
    store.setSessionStatus('2026-01-14', 'session-4', 'completed');

    const { container } = render(<Calendar />);

    const grid = container.querySelector('.grid') as HTMLElement;
    const firstDaySquares = Array.from(grid.children[0].children).slice(1);
    const lastSquare = firstDaySquares[firstDaySquares.length - 1];
    expect(lastSquare).toHaveTextContent('+1');
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

  it('shows inline day detail when a day column is tapped', () => {
    const store = useTreatmentStore.getState();
    store.setConfig({ totalDays: 3, sessionsPerDay: 2 });
    useTreatmentStore.setState({ startDate: '2026-01-14' });
    store.setSessionStatus('2026-01-14', 'session-1', 'completed');

    render(<Calendar />);

    const dayButtons = screen.getAllByRole('button');
    fireEvent.click(dayButtons[0]);

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
});
