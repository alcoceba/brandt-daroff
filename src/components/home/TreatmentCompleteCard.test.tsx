import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TreatmentCompleteCard } from './TreatmentCompleteCard';

describe('TreatmentCompleteCard', () => {
  it('renders completion info and both actions', () => {
    const onAddExtra = vi.fn();
    const onStartNew = vi.fn();
    render(
      <TreatmentCompleteCard
        title="Complete"
        body="Great job"
        addExtraLabel="Extra"
        startNewLabel="New"
        onAddExtra={onAddExtra}
        onStartNewTreatment={onStartNew}
      />,
    );

    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.getByText('Great job')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Extra' }));
    expect(onAddExtra).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'New' }));
    expect(onStartNew).toHaveBeenCalledTimes(1);
  });
});
