import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SafetyAlert } from './SafetyAlert';

describe('SafetyAlert component', () => {
  it('renders children with danger styling by default', () => {
    render(<SafetyAlert>Emergency Warning Text</SafetyAlert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Emergency Warning Text')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <SafetyAlert title="Stop Treatment" variant="warning">
        <span>Warning details</span>
      </SafetyAlert>,
    );
    expect(screen.getByText('Stop Treatment')).toBeInTheDocument();
    expect(screen.getByText('Warning details')).toBeInTheDocument();
  });
});
