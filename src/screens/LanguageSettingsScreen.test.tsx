import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSettingsScreen } from './LanguageSettingsScreen';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { LANGUAGES } from '@/constants/languages';

describe('LanguageSettingsScreen', () => {
  const onBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useTreatmentStore.getState().fullReset();
  });

  it('renders the header with title', () => {
    render(<LanguageSettingsScreen onBack={onBack} />);
    expect(screen.getByText('settings.language')).toBeInTheDocument();
  });

  it('renders a button for each language', () => {
    render(<LanguageSettingsScreen onBack={onBack} />);
    LANGUAGES.forEach(({ label }) => {
      expect(screen.getByRole('button', { name: (name) => name.includes(label) })).toBeInTheDocument();
    });
  });

  it('highlights the active language', () => {
    useTreatmentStore.getState().setLanguage('ca');
    render(<LanguageSettingsScreen onBack={onBack} />);
    const activeButton = screen.getByRole('button', { name: /Català/i });
    expect(activeButton).toHaveClass('border-brand-500');
    expect(activeButton).toHaveClass('bg-brand-600');
  });

  it('does not highlight inactive languages', () => {
    useTreatmentStore.getState().setLanguage('ca');
    render(<LanguageSettingsScreen onBack={onBack} />);
    const englishButton = screen.getByRole('button', { name: 'English' });
    expect(englishButton).toHaveClass('border-slate-700');
    expect(englishButton).toHaveClass('bg-slate-800');
  });

  it('calls setLanguage and updates the active language when a button is clicked', () => {
    render(<LanguageSettingsScreen onBack={onBack} />);
    const spanishButton = screen.getByRole('button', { name: 'Castellano' });
    fireEvent.click(spanishButton);
    expect(useTreatmentStore.getState().language).toBe('es');
  });

  it('calls onBack when the back button is clicked', () => {
    render(<LanguageSettingsScreen onBack={onBack} />);
    const backButton = screen.getByRole('button', { name: 'common.back' });
    fireEvent.click(backButton);
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
