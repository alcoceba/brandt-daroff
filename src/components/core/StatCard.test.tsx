import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from './StatCard';

describe('StatCard component', () => {
  it('renders label and value in subtle variant by default', () => {
    render(<StatCard label="Total Days" value="14" />);
    expect(screen.getByText('Total Days')).toBeInTheDocument();
    expect(screen.getByText('14')).toBeInTheDocument();
  });

  it('renders compact variant with custom icon', () => {
    render(
      <StatCard
        variant="compact"
        label="Streak"
        value="5 days"
        icon={<span data-testid="streak-icon">🔥</span>}
      />,
    );
    expect(screen.getByText('Streak')).toBeInTheDocument();
    expect(screen.getByText('5 days')).toBeInTheDocument();
    expect(screen.getByTestId('streak-icon')).toBeInTheDocument();
  });
});
