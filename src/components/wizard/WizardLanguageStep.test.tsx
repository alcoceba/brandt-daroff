import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WizardLanguageStep } from './WizardLanguageStep';

describe('WizardLanguageStep', () => {
  it('renders title and subtitle', () => {
    render(
      <WizardLanguageStep
        selectedLanguage="en"
        storedLanguage="en"
        onSelect={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.getByText('language.title')).toBeInTheDocument();
    expect(screen.getByText('language.subtitle')).toBeInTheDocument();
  });

  it('puts detected language first', () => {
    render(
      <WizardLanguageStep
        selectedLanguage="en"
        detectedLanguage="ca"
        storedLanguage="en"
        onSelect={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveTextContent('Català');
  });

  it('puts stored language first when no detected language', () => {
    render(
      <WizardLanguageStep
        selectedLanguage="ca"
        storedLanguage="ca"
        onSelect={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveTextContent('Català');
  });

  it('marks selected language', () => {
    render(
      <WizardLanguageStep
        selectedLanguage="ca"
        storedLanguage="en"
        onSelect={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    const catalanButton = screen.getByRole('button', { name: /Català/i });
    expect(catalanButton).toHaveClass('border-brand-500');
  });

  it('calls onSelect when a language is clicked', () => {
    const onSelect = vi.fn();
    render(
      <WizardLanguageStep
        selectedLanguage="en"
        storedLanguage="en"
        onSelect={onSelect}
        onConfirm={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Català/i }));
    expect(onSelect).toHaveBeenCalledWith('ca');
  });

  it('calls onConfirm when confirm button is clicked', () => {
    const onConfirm = vi.fn();
    render(
      <WizardLanguageStep
        selectedLanguage="en"
        storedLanguage="en"
        onSelect={vi.fn()}
        onConfirm={onConfirm}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'common.confirm' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
