import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DevScenariosScreen } from './DevScenariosScreen';

const { seedScenarioMock, clearStoredStateMock, copyCurrentStateMock } = vi.hoisted(() => ({
  seedScenarioMock: vi.fn(),
  clearStoredStateMock: vi.fn(),
  copyCurrentStateMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/testing/scenarios', () => ({
  getScenarioNames: () => [
    'fresh',
    'day1-none',
    'day1-goal-reached',
    'day5-on-track',
    'treatment-complete',
    'in-progress',
    'language-ca',
    'language-es',
  ],
  getScenarioLabel: (name: string) => `Label: ${name}`,
  seedScenario: seedScenarioMock,
  clearStoredState: clearStoredStateMock,
  copyCurrentState: copyCurrentStateMock,
  STORAGE_KEY: 'brandt-daroff-store',
  STORAGE_VERSION: 5,
}));

const STORAGE_KEY = 'brandt-daroff-store';
const STORAGE_VERSION = 5;

describe('DevScenariosScreen', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.stubGlobal('location', { ...window.location, href: 'http://localhost/?dev=scenarios' });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders scenario buttons except language scenarios', () => {
    render(<DevScenariosScreen />);

    expect(screen.getByText('Label: fresh')).toBeInTheDocument();
    expect(screen.getByText('Label: day1-none')).toBeInTheDocument();
    expect(screen.queryByText('Label: language-ca')).not.toBeInTheDocument();
    expect(screen.queryByText('Label: language-es')).not.toBeInTheDocument();
  });

  it('seeds a scenario when its button is clicked', () => {
    render(<DevScenariosScreen />);

    fireEvent.click(screen.getByText('Label: day1-none'));

    expect(seedScenarioMock).toHaveBeenCalledTimes(1);
    expect(seedScenarioMock).toHaveBeenCalledWith('day1-none');
  });

  it('clears storage when clear button is clicked', () => {
    render(<DevScenariosScreen />);

    fireEvent.click(screen.getByRole('button', { name: /clear storage/i }));

    expect(clearStoredStateMock).toHaveBeenCalledTimes(1);
  });

  it('copies current state when copy button is clicked', async () => {
    render(<DevScenariosScreen />);

    fireEvent.click(screen.getByRole('button', { name: /copy current/i }));

    expect(copyCurrentStateMock).toHaveBeenCalledTimes(1);
  });

  it('renders manual state builder inputs', () => {
    render(<DevScenariosScreen />);

    expect(screen.getByLabelText('Day')).toBeInTheDocument();
    expect(screen.getByLabelText('Sessions completed')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate & go to app/i })).toBeInTheDocument();
  });

  it('shows an error when requested sessions exceed the day maximum', () => {
    render(<DevScenariosScreen />);

    fireEvent.change(screen.getByLabelText('Day'), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText('Sessions completed'), { target: { value: '10' } });

    expect(screen.getByText(/max 6 sessions possible by day 2/i)).toBeInTheDocument();
  });

  it('disables generate button while there is an error', () => {
    render(<DevScenariosScreen />);

    fireEvent.change(screen.getByLabelText('Sessions completed'), { target: { value: '10' } });

    expect(screen.getByRole('button', { name: /generate & go to app/i })).toBeDisabled();
  });

  it('writes a versioned state to localStorage and navigates to app root on generate', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    render(<DevScenariosScreen />);

    fireEvent.change(screen.getByLabelText('Day'), { target: { value: '3' } });
    fireEvent.change(screen.getByLabelText('Sessions completed'), { target: { value: '4' } });
    fireEvent.click(screen.getByRole('button', { name: /generate & go to app/i }));

    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();

    const parsed = JSON.parse(raw!);
    expect(parsed.version).toBe(STORAGE_VERSION);
    expect(parsed.state.onboardingComplete).toBe(true);
    expect(parsed.state.startDate).toBeTruthy();

    const sessions = parsed.state.sessions as Record<string, Record<string, string>>;
    const completedCount = Object.values(sessions).reduce(
      (dayTotal: number, daySessions: Record<string, string>) =>
        dayTotal + Object.values(daySessions).filter((s) => s === 'completed').length,
      0,
    );
    expect(completedCount).toBe(4);
    expect(window.location.href).toBe('http://localhost/');

    vi.restoreAllMocks();
  });
});
