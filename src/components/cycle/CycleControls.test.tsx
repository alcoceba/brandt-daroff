import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CycleControls } from './CycleControls';
import type { PositionKind } from '@/types';

describe('CycleControls', () => {
  const defaultProps = {
    kind: 'sitting' as PositionKind,
    isTransition: false,
    isRunning: true,
    isPaused: false,
    startLabel: 'Start',
    pauseLabel: 'Pause',
    resumeLabel: 'Resume',
    nextLabel: 'Next',
    onAdvance: vi.fn(),
    onAdvanceSkip: vi.fn(),
    onPauseResume: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders start button when in transition mode and calls onAdvance', () => {
    render(<CycleControls {...defaultProps} isTransition={true} />);

    const startBtn = screen.getByRole('button', { name: /Start/i });
    expect(startBtn).toBeInTheDocument();
    fireEvent.click(startBtn);
    expect(defaultProps.onAdvance).toHaveBeenCalledTimes(1);
  });

  it('renders pause and next buttons when running in exercise mode', () => {
    render(<CycleControls {...defaultProps} isRunning={true} isPaused={false} />);

    const pauseBtn = screen.getByRole('button', { name: 'Pause' });
    expect(pauseBtn).toBeInTheDocument();
    fireEvent.click(pauseBtn);
    expect(defaultProps.onPauseResume).toHaveBeenCalledTimes(1);

    const nextBtn = screen.getByRole('button', { name: 'Next' });
    expect(nextBtn).toBeInTheDocument();
    fireEvent.click(nextBtn);
    expect(defaultProps.onAdvanceSkip).toHaveBeenCalledTimes(1);
  });

  it('renders resume button when paused', () => {
    render(<CycleControls {...defaultProps} isRunning={false} isPaused={true} />);

    const resumeBtn = screen.getByRole('button', { name: 'Resume' });
    expect(resumeBtn).toBeInTheDocument();
    fireEvent.click(resumeBtn);
    expect(defaultProps.onPauseResume).toHaveBeenCalledTimes(1);
  });

  it('handles all position kinds in both active and paused themes', () => {
    const kinds: PositionKind[] = ['sitting', 'lying-right', 'lying-left', 'rest', 'long-rest'];
    kinds.forEach((kind) => {
      const { unmount: unmountActive } = render(
        <CycleControls {...defaultProps} kind={kind} isPaused={false} />,
      );
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
      unmountActive();

      const { unmount: unmountPaused } = render(
        <CycleControls {...defaultProps} kind={kind} isPaused={true} isRunning={false} />,
      );
      expect(screen.getByRole('button', { name: 'Resume' })).toBeInTheDocument();
      unmountPaused();
    });
  });
});
