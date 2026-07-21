import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppLayout } from './AppLayout';

describe('AppLayout', () => {
  it('renders children', () => {
    render(
      <AppLayout>
        <div data-testid="child-content">Hello from child</div>
      </AppLayout>,
    );
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Hello from child')).toBeInTheDocument();
  });

  it('renders the global footer with copyright, privacy note, and GitHub link', () => {
    render(
      <AppLayout>
        <div>Child content</div>
      </AppLayout>,
    );
    expect(screen.getByText((content) => content.includes('footer.privacyNote'))).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'footer.github' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'footer.github' })).toHaveAttribute(
      'href',
      'https://github.com/alcoceba/brandt-daroff',
    );
  });

  it('renders the current year in the copyright text', () => {
    render(
      <AppLayout>
        <div>Child content</div>
      </AppLayout>,
    );
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText((content) => content.includes(`footer.copyright:{"year":${currentYear}}`)),
    ).toBeInTheDocument();
  });
});
