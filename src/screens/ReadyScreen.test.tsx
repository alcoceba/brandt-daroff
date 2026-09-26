import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ReadyScreen } from './ReadyScreen';

describe('ReadyScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders title and subtitle', () => {
    const onDone = vi.fn();
    render(<ReadyScreen onDone={onDone} />);

    expect(screen.getByText('ready.title')).toBeInTheDocument();
    expect(screen.getByText('ready.subtitle')).toBeInTheDocument();
  });

  it('calls onDone after 2500ms', () => {
    const onDone = vi.fn();
    render(<ReadyScreen onDone={onDone} />);

    expect(onDone).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(2500);
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('calls onDone immediately when tapped', () => {
    const onDone = vi.fn();
    render(<ReadyScreen onDone={onDone} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
