import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DevScenariosScreen } from './DevScenariosScreen';

const { seedScenarioMock, clearStoredStateMock, copyCurrentStateMock } = vi.hoisted(() => ({
  seedScenarioMock: vi.fn(),
  clearStoredStateMock: vi.fn(),
  copyCurrentStateMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/testing/scenarios', () => ({
  getScenarioNames: () => ['fresh', 'day1-none', 'treatment-complete'],
  getScenarioLabel: (name: string) => `Label: ${name}`,
  seedScenario: seedScenarioMock,
  clearStoredState: clearStoredStateMock,
  copyCurrentState: copyCurrentStateMock,
}));

describe('DevScenariosScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders scenario buttons', () => {
    render(<DevScenariosScreen />);

    expect(screen.getByText('Label: fresh')).toBeInTheDocument();
    expect(screen.getByText('Label: day1-none')).toBeInTheDocument();
    expect(screen.getByText('Label: treatment-complete')).toBeInTheDocument();
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
});
