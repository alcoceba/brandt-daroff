import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSelectorScreen } from './LanguageSelectorScreen';
import { LANGUAGES } from '@/constants/languages';

describe('LanguageSelectorScreen', () => {
  const onSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the logo and app name', () => {
    render(<LanguageSelectorScreen onSelect={onSelect} />);
    expect(screen.getByText('app.name')).toBeInTheDocument();
    expect(screen.getByText('app.tagline')).toBeInTheDocument();
  });

  it('renders a button for each language', () => {
    render(<LanguageSelectorScreen onSelect={onSelect} />);
    LANGUAGES.forEach(({ label }) => {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    });
  });

  it('calls onSelect with the correct language code when a button is clicked', () => {
    render(<LanguageSelectorScreen onSelect={onSelect} />);
    const catalanButton = screen.getByRole('button', { name: 'Català' });
    fireEvent.click(catalanButton);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('ca');
  });
});
