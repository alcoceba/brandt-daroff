import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SplashScreen } from './SplashScreen';

describe('SplashScreen', () => {
  it('renders the logo SVG', () => {
    render(<SplashScreen />);
    expect(screen.getByRole('img', { name: 'app.name' })).toBeInTheDocument();
  });

  it('renders the app name wordmark', () => {
    render(<SplashScreen />);
    expect(screen.getByText('app.name')).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    render(<SplashScreen />);
    expect(screen.getByText('app.tagline')).toBeInTheDocument();
  });
});
