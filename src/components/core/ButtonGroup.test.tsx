import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ButtonGroup } from './ButtonGroup';

describe('ButtonGroup', () => {
  it('renders title and children', () => {
    render(
      <ButtonGroup title="Group title">
        <button type="button">First</button>
        <button type="button">Second</button>
      </ButtonGroup>,
    );

    expect(screen.getByText('Group title')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'First' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Second' })).toBeInTheDocument();
  });
});
