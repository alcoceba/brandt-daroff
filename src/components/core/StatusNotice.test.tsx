import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { StatusNotice } from './StatusNotice';

describe('StatusNotice', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders icon, title and subtitle', () => {
    render(
      <StatusNotice
        icon={<span>Icon</span>}
        title="Success"
        subtitle="You did it"
        onDone={vi.fn()}
      />,
    );
    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('You did it')).toBeInTheDocument();
  });

  it('triggers onDone after durationMs expires', () => {
    const onDone = vi.fn();
    render(
      <StatusNotice
        icon={<span>Icon</span>}
        title="Title"
        durationMs={2000}
        onDone={onDone}
      />,
    );
    expect(onDone).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('triggers onDone on click', () => {
    const onDone = vi.fn();
    render(
      <StatusNotice
        icon={<span>Icon</span>}
        title="Title"
        onDone={onDone}
      />,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('triggers onDone on Enter or Space key down', () => {
    const onDone = vi.fn();
    render(
      <StatusNotice
        icon={<span>Icon</span>}
        title="Title"
        onDone={onDone}
      />,
    );
    const container = screen.getByRole('button');
    fireEvent.keyDown(container, { key: 'Enter' });
    expect(onDone).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(container, { key: ' ' });
    expect(onDone).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(container, { key: 'Tab' });
    expect(onDone).toHaveBeenCalledTimes(2);
  });

  it('does not set a timer when durationMs is 0', () => {
    const onDone = vi.fn();
    render(
      <StatusNotice
        icon={<span>Icon</span>}
        title="Title"
        durationMs={0}
        onDone={onDone}
      />,
    );
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(onDone).not.toHaveBeenCalled();
  });
});
