import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WizardHeader } from './WizardHeader';

describe('WizardHeader', () => {
  it('renders icon and title', () => {
    render(<WizardHeader icon={<span data-testid="icon">Icon</span>} title="Title" />);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<WizardHeader icon={<span>Icon</span>} title="Title" subtitle="Subtitle" />);

    expect(screen.getByText('Subtitle')).toBeInTheDocument();
  });

  it('does not render subtitle when omitted', () => {
    render(<WizardHeader icon={<span>Icon</span>} title="Title" />);

    expect(screen.queryByText('Subtitle')).not.toBeInTheDocument();
  });

  it('applies custom icon container classes', () => {
    const { container } = render(
      <WizardHeader icon={<span>Icon</span>} title="Title" iconClassName="custom-class" />,
    );

    const iconContainer = container.querySelector('.custom-class');
    expect(iconContainer).toBeInTheDocument();
  });
});
