import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScreenHeader } from './ScreenHeader';

describe('ScreenHeader', () => {
  it('renders title', () => {
    render(<ScreenHeader title="My Title" />);
    expect(screen.getByRole('heading', { name: 'My Title', level: 1 })).toBeInTheDocument();
  });

  it('renders back button when onBack is provided', () => {
    const onBack = vi.fn();
    render(<ScreenHeader title="Test" onBack={onBack} />);
    const backBtn = screen.getByRole('button', { name: 'common.back' });
    expect(backBtn).toBeInTheDocument();
    fireEvent.click(backBtn);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('does not render back button when onBack is not provided', () => {
    render(<ScreenHeader title="Test" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders rightAction content when provided', () => {
    render(<ScreenHeader title="Test" rightAction={<button type="button">Action</button>} />);
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });
});
