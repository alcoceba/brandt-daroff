import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WizardInfoSection } from './WizardInfoSection';

describe('WizardInfoSection', () => {
  it('renders icon, title and children', () => {
    render(
      <WizardInfoSection icon={<span data-testid="icon">Icon</span>} title="Section title">
        <p>Section body</p>
      </WizardInfoSection>,
    );

    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Section title' })).toBeInTheDocument();
    expect(screen.getByText('Section body')).toBeInTheDocument();
  });
});
