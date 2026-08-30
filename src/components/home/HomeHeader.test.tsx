import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomeHeader } from './HomeHeader';

describe('HomeHeader', () => {
  it('renders the title and day label while treatment is active', () => {
    render(<HomeHeader finished={false} dayNumber={3} totalDays={14} title="Home" completeLabel="Done" dayLabel="Day 3 / 14" />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Day 3 / 14')).toBeInTheDocument();
    expect(screen.queryByText('Done')).not.toBeInTheDocument();
  });

  it('shows the completed label when treatment is finished', () => {
    render(<HomeHeader finished dayNumber={14} totalDays={14} title="Home" completeLabel="Done" dayLabel="Day 14 / 14" />);
    expect(screen.getByText('Done')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.queryByText('Day 14 / 14')).not.toBeInTheDocument();
  });
});
