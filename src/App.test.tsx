import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';
import { useTreatmentStore } from '@/store/useTreatmentStore';

function findButtonByText(text: string): HTMLElement | undefined {
  return screen.getAllByRole('button').find((b) => b.textContent?.includes(text));
}

describe('App routing', () => {
  beforeEach(() => {
    localStorage.clear();
    useTreatmentStore.getState().fullReset();
    vi.clearAllMocks();
  });

  it('renders LanguageSelector when onboarding is not complete', () => {
    render(<App />);
    expect(screen.getByText('app.name')).toBeInTheDocument();
    expect(screen.getByText('app.tagline')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'English' })).toBeInTheDocument();
  });

  it('renders Home when onboarding is complete', () => {
    useTreatmentStore.getState().completeOnboarding();
    render(<App />);
    expect(screen.getByText('home.title')).toBeInTheDocument();
    expect(screen.getByText('home.day:{"x":1,"total":14}')).toBeInTheDocument();
  });

  it('language selection navigates to the wizard', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'English' }));
    expect(screen.getByText('wizard.choiceSubtitle')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /wizard.defaults/i })).toBeInTheDocument();
  });

  it('completing the wizard navigates to home', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'English' }));
    fireEvent.click(screen.getByRole('button', { name: /wizard.defaults/i }));
    expect(screen.getByText('home.title')).toBeInTheDocument();
    expect(screen.getByText('home.day:{"x":1,"total":14}')).toBeInTheDocument();
  });

  it('starting a session navigates to the cycle screen', () => {
    useTreatmentStore.getState().completeOnboarding();
    render(<App />);
    const startButton = screen.getByRole('button', { name: /home.start/i });
    fireEvent.click(startButton);
    expect(screen.getByText('cycle.title:{"x":1}')).toBeInTheDocument();
  });

  it('settings and info navigation works', () => {
    useTreatmentStore.getState().completeOnboarding();
    render(<App />);

    const settingsButton = findButtonByText('home.settings');
    expect(settingsButton).toBeDefined();
    fireEvent.click(settingsButton!);
    expect(screen.getByText('settings.title')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'common.back' }));
    expect(screen.getByText('home.title')).toBeInTheDocument();

    const infoButton = findButtonByText('info.title');
    expect(infoButton).toBeDefined();
    fireEvent.click(infoButton!);
    expect(screen.getByText('info.title')).toBeInTheDocument();
  });

  it('full reset returns to the language screen', () => {
    useTreatmentStore.getState().completeOnboarding();
    render(<App />);

    fireEvent.click(findButtonByText('home.settings')!);
    expect(screen.getByText('settings.title')).toBeInTheDocument();

    fireEvent.click(findButtonByText('home.reset')!);
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: 'home.reset' }));

    expect(screen.getByText('app.name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'English' })).toBeInTheDocument();
  });
});
