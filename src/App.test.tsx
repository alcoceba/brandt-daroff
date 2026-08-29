import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import App from './App';
import { useTreatmentStore } from '@/store/useTreatmentStore';

function findButtonByText(text: string): HTMLElement | undefined {
  return screen.getAllByRole('button').find((b) => b.textContent?.includes(text));
}

function passSplash() {
  act(() => vi.advanceTimersByTime(1300));
}

describe('App routing', () => {
  beforeEach(() => {
    localStorage.clear();
    useTreatmentStore.getState().fullReset();
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows a splash screen on first render', () => {
    render(<App />);
    expect(screen.getByRole('img', { name: 'app.name' })).toBeInTheDocument();
    expect(screen.queryByText('language.title')).not.toBeInTheDocument();
  });

  it('renders language selector after splash when onboarding is not complete', () => {
    render(<App />);
    passSplash();
    expect(screen.getByText('language.title')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'English' })).toBeInTheDocument();
  });

  it('renders Home after splash when onboarding is complete', () => {
    useTreatmentStore.getState().completeOnboarding();
    render(<App />);
    passSplash();
    expect(screen.getByText('home.title')).toBeInTheDocument();
    expect(screen.getByText('home.day:{"x":1,"total":14}')).toBeInTheDocument();
  });

  it('confirming language selection navigates to the disclaimer step', () => {
    render(<App />);
    passSplash();
    fireEvent.click(screen.getByRole('button', { name: 'common.confirm' }));
    expect(screen.getByText('wizard.disclaimerTitle')).toBeInTheDocument();
  });

  it('completing the wizard navigates to home', () => {
    render(<App />);
    passSplash();
    fireEvent.click(screen.getByRole('button', { name: 'common.confirm' }));
    fireEvent.click(screen.getByRole('button', { name: 'wizard.disclaimerContinue' }));
    fireEvent.click(screen.getByRole('button', { name: 'wizard.aboutContinue' }));
    fireEvent.click(screen.getByRole('button', { name: /wizard.defaults/i }));
    fireEvent.click(screen.getByRole('button', { name: 'wizard.choiceConfirm' }));
    expect(screen.getByText('home.title')).toBeInTheDocument();
    expect(screen.getByText('home.day:{"x":1,"total":14}')).toBeInTheDocument();
  });

  it('starting a session navigates to the cycle screen', () => {
    useTreatmentStore.getState().completeOnboarding();
    render(<App />);
    passSplash();
    const startButton = screen.getByRole('button', { name: /home.start/i });
    fireEvent.click(startButton);
    expect(screen.getByText('cycle.title:{"x":1}')).toBeInTheDocument();
  });

  it('settings and info navigation works', () => {
    useTreatmentStore.getState().completeOnboarding();
    render(<App />);
    passSplash();

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

  it('full reset returns to the language step of the wizard', () => {
    useTreatmentStore.getState().completeOnboarding();
    render(<App />);
    passSplash();

    fireEvent.click(findButtonByText('home.settings')!);
    expect(screen.getByText('settings.title')).toBeInTheDocument();

    fireEvent.click(findButtonByText('home.reset')!);
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: 'home.reset' }));

    expect(screen.getByText('language.title')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'English' })).toBeInTheDocument();
  });
});
