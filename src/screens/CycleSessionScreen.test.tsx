import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { CycleSessionScreen } from './CycleSessionScreen';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { useCycleSession } from '@/hooks/useCycleSession';
import { DEFAULT_CONFIG } from '@/constants/treatment';
import type { PositionDef } from '@/types';

vi.mock('@/hooks/useCycleSession', () => ({
  useCycleSession: vi.fn(),
}));

const mockedUseCycleSession = useCycleSession as Mock;

describe('CycleSessionScreen', () => {
  const sessionId = 'session-1';
  const onExit = vi.fn();

  beforeEach(() => {
    useTreatmentStore.getState().fullReset();
    vi.clearAllMocks();
  });

  function baseMock(overrides: Record<string, unknown> = {}) {
    return {
      config: DEFAULT_CONFIG,
      position: {
        kind: 'lying-right',
        labelKey: 'position.lyingRight',
        durationKind: 'positionDuration',
        canAdvanceEarly: true,
      } as PositionDef,
      isTransition: false,
      duration: 30,
      isRunning: true,
      secondsRemaining: 30,
      cycleIndex: 0,
      cycleNumber: 1,
      dayNumber: 2,
      dialog: 'none',
      setDialog: vi.fn(),
      skipChecked: false,
      setSkipChecked: vi.fn(),
      showCompletion: false,
      completedCount: 1,
      extraCompletedCount: 0,
      totalSessions: 42,
      isExtraSession: false,
      advance: vi.fn(),
      goHome: vi.fn(),
      handleBack: vi.fn(),
      handlePauseResume: vi.fn(),
      confirmReset: vi.fn(),
      handleSafetyConfirm: vi.fn(),
      sessionElapsedSeconds: () => 120,
      ...overrides,
    };
  }

  it('renders the header, day number, and mute/reset buttons', () => {
    mockedUseCycleSession.mockReturnValue(baseMock());
    render(<CycleSessionScreen sessionId={sessionId} onExit={onExit} />);

    expect(screen.getByText('cycle.title:{"x":2}')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'cycle.resetProcess' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'cycle.mute' })).toBeInTheDocument();
  });

  it('renders the current position, timer, and cycle counter', () => {
    mockedUseCycleSession.mockReturnValue(baseMock());
    render(<CycleSessionScreen sessionId={sessionId} onExit={onExit} />);

    expect(screen.getByText('position.lyingRight')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('cycle.cycle:{"x":1,"total":5}')).toBeInTheDocument();
  });

  it('shows the start button during a transition position', () => {
    const advance = vi.fn();
    mockedUseCycleSession.mockReturnValue(
      baseMock({
        position: {
          kind: 'sitting',
          labelKey: 'position.sitting',
          durationKind: 'transition',
          canAdvanceEarly: false,
        } as PositionDef,
        isTransition: true,
        duration: 0,
        isRunning: false,
        secondsRemaining: 0,
        advance,
      }),
    );
    render(<CycleSessionScreen sessionId={sessionId} onExit={onExit} />);

    const startButton = screen.getByRole('button', { name: 'cycle.start' });
    expect(startButton).toBeInTheDocument();
    fireEvent.click(startButton);
    expect(advance).toHaveBeenCalledTimes(1);
  });

  it('calls advance(true) when the next button is pressed', () => {
    const advance = vi.fn();
    mockedUseCycleSession.mockReturnValue(baseMock({ advance }));
    render(<CycleSessionScreen sessionId={sessionId} onExit={onExit} />);

    fireEvent.click(screen.getByRole('button', { name: 'cycle.next' }));
    expect(advance).toHaveBeenCalledTimes(1);
    expect(advance).toHaveBeenCalledWith(true);
  });

  it('calls handlePauseResume when the pause/resume button is pressed', () => {
    const handlePauseResume = vi.fn();
    mockedUseCycleSession.mockReturnValue(baseMock({ handlePauseResume }));
    render(<CycleSessionScreen sessionId={sessionId} onExit={onExit} />);

    fireEvent.click(screen.getByRole('button', { name: 'cycle.pause' }));
    expect(handlePauseResume).toHaveBeenCalledTimes(1);
  });

  it('toggles sound via the mute button', () => {
    mockedUseCycleSession.mockReturnValue(baseMock());
    render(<CycleSessionScreen sessionId={sessionId} onExit={onExit} />);

    expect(useTreatmentStore.getState().settings.sound).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'cycle.mute' }));
    expect(useTreatmentStore.getState().settings.sound).toBe(false);
    expect(screen.getByRole('button', { name: 'cycle.unmute' })).toBeInTheDocument();
  });

  it('opens the reset dialog from the header reset button', () => {
    const setDialog = vi.fn();
    const confirmReset = vi.fn();
    mockedUseCycleSession.mockReturnValue(baseMock({ setDialog, confirmReset }));
    render(<CycleSessionScreen sessionId={sessionId} onExit={onExit} />);

    const resetButtons = screen.getAllByRole('button', { name: 'cycle.resetProcess' });
    fireEvent.click(resetButtons[0]);
    expect(setDialog).toHaveBeenCalledTimes(1);
    expect(setDialog).toHaveBeenCalledWith('reset');
  });

  it('confirms reset from the reset dialog', () => {
    const setDialog = vi.fn();
    const confirmReset = vi.fn();
    mockedUseCycleSession.mockReturnValue(baseMock({ dialog: 'reset', setDialog, confirmReset }));
    render(<CycleSessionScreen sessionId={sessionId} onExit={onExit} />);

    const dialog = screen.getByRole('dialog');
    const confirm = within(dialog).getByRole('button', { name: 'cycle.resetProcess' });
    fireEvent.click(confirm);

    expect(setDialog).toHaveBeenCalledWith('none');
    expect(confirmReset).toHaveBeenCalledTimes(1);
  });

  it('renders the safety dialog and confirms it', () => {
    const handleSafetyConfirm = vi.fn();
    const setSkipChecked = vi.fn();
    mockedUseCycleSession.mockReturnValue(
      baseMock({ dialog: 'safety', handleSafetyConfirm, setSkipChecked }),
    );
    render(<CycleSessionScreen sessionId={sessionId} onExit={onExit} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText('safety.title')).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(setSkipChecked).toHaveBeenCalledWith(true);

    fireEvent.click(within(dialog).getByRole('button', { name: 'cycle.start' }));
    expect(handleSafetyConfirm).toHaveBeenCalledTimes(1);
  });

  it('renders the session completion card and returns home', () => {
    const goHome = vi.fn();
    mockedUseCycleSession.mockReturnValue(baseMock({ showCompletion: true, goHome }));
    render(<CycleSessionScreen sessionId={sessionId} onExit={onExit} />);

    expect(screen.getByText('cycle.completionTitle')).toBeInTheDocument();
    expect(screen.getByText('cycle.completionBody')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'cycle.done' }));
    expect(goHome).toHaveBeenCalledTimes(1);
    expect(goHome).toHaveBeenCalledWith('completed');
  });
});
