import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmDialog } from './ConfirmDialog';

describe('ConfirmDialog component', () => {
  const defaultProps = {
    open: true,
    title: 'Test Title',
    body: 'Test Body',
    confirmLabel: 'Confirm Option',
    cancelLabel: 'Cancel Option',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render nothing if open is false', () => {
    const { container } = render(<ConfirmDialog {...defaultProps} open={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render title and body when open is true', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Body')).toBeInTheDocument();
  });

  it('should render Confirm and Cancel buttons with labels', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    expect(screen.getByRole('button', { name: 'Confirm Option' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel Option' })).toBeInTheDocument();
  });

  it('should trigger onConfirm when confirm button is clicked', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Confirm Option' }));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should trigger onCancel when cancel button is clicked', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Cancel Option' }));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('should trigger onCancel when background overlay is clicked', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    const dialogOverlay = screen.getByRole('dialog');
    fireEvent.click(dialogOverlay);
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('should not trigger onCancel when dialog container itself is clicked', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    const container = screen.getByText('Test Title').parentElement!;
    fireEvent.click(container);
    expect(defaultProps.onCancel).not.toHaveBeenCalled();
  });

  it('should trigger onCancel when Escape key is pressed', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  describe('when single is true', () => {
    const props = {
      ...defaultProps,
      single: true,
    };

    it('should not render the cancel button', () => {
      render(<ConfirmDialog {...props} />);
      
      expect(screen.queryByRole('button', { name: 'Cancel Option' })).toBeNull();
    });

    it('should not trigger onCancel when background overlay is clicked', () => {
      render(<ConfirmDialog {...props} />);
      
      const dialogOverlay = screen.getByRole('dialog');
      fireEvent.click(dialogOverlay);
      expect(defaultProps.onCancel).not.toHaveBeenCalled();
    });

    it('should not trigger onCancel when Escape key is pressed', () => {
      render(<ConfirmDialog {...props} />);
      
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(defaultProps.onCancel).not.toHaveBeenCalled();
    });
  });

  describe('danger style', () => {
    it('should apply red state-danger class when danger is true', () => {
      render(<ConfirmDialog {...defaultProps} danger />);
      
      const confirmBtn = screen.getByRole('button', { name: 'Confirm Option' });
      expect(confirmBtn).toHaveClass('bg-state-danger');
    });

    it('should apply green bg-brand-600 class when danger is false', () => {
      render(<ConfirmDialog {...defaultProps} danger={false} />);
      
      const confirmBtn = screen.getByRole('button', { name: 'Confirm Option' });
      expect(confirmBtn).toHaveClass('bg-brand-600');
    });
  });
});
