import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WizardShell } from './WizardShell';

describe('WizardShell', () => {
  it('renders children', () => {
    render(
      <WizardShell>
        <div data-testid="child">Content</div>
      </WizardShell>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(
      <WizardShell footer={<div data-testid="footer">Footer</div>}>
        <div>Content</div>
      </WizardShell>,
    );

    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders action when provided', () => {
    render(
      <WizardShell action={<button type="button">Action</button>}>
        <div>Content</div>
      </WizardShell>,
    );

    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('uses narrow inner layout by default', () => {
    const { container } = render(
      <WizardShell>
        <div>Content</div>
      </WizardShell>,
    );

    const inner = (container.firstChild as HTMLElement).firstChild as HTMLElement;
    expect(inner).toHaveClass('max-w-[480px]');
  });

  it('uses wide inner layout when wide is true', () => {
    const { container } = render(
      <WizardShell wide>
        <div>Content</div>
      </WizardShell>,
    );

    const inner = (container.firstChild as HTMLElement).firstChild as HTMLElement;
    expect(inner).toHaveClass('max-w-[700px]');
  });
});
