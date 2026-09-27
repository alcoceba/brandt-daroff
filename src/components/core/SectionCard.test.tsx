import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionCard } from './SectionCard';

describe('SectionCard component', () => {
  it('renders title and content inside Card', () => {
    render(
      <SectionCard title="Test Title" titleId="test-id">
        <p>Section Content</p>
      </SectionCard>,
    );

    const heading = screen.getByRole('heading', { level: 2, name: 'Test Title' });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveAttribute('id', 'test-id');
    expect(screen.getByText('Section Content')).toBeInTheDocument();
  });
});
