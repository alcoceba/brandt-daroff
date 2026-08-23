import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WizardScreen } from './WizardScreen';
import { useTreatmentStore } from '@/store/useTreatmentStore';

describe('WizardScreen', () => {
  const onDone = vi.fn();
  const onBack = vi.fn();

  beforeEach(() => {
    useTreatmentStore.getState().fullReset();
    vi.clearAllMocks();
  });

  describe('onboarding — language step', () => {
    it('renders the language step first', () => {
      render(<WizardScreen onDone={onDone} />);
      expect(screen.getByText('language.title')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /English/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'common.confirm' })).toBeInTheDocument();
    });

    it('pre-marks the detected language', () => {
      render(<WizardScreen onDone={onDone} detectedLanguage="ca" />);
      expect(screen.getByRole('button', { name: /Català/i }).className).toContain('border-brand-500');
    });

    it('changes selection when another language is tapped', () => {
      render(<WizardScreen onDone={onDone} detectedLanguage="en" />);
      fireEvent.click(screen.getByRole('button', { name: /Castellano/i }));
      expect(screen.getByRole('button', { name: /Castellano/i }).className).toContain('border-brand-500');
    });

    it('advances to disclaimer on confirm', () => {
      render(<WizardScreen onDone={onDone} />);
      fireEvent.click(screen.getByRole('button', { name: 'common.confirm' }));
      expect(screen.getByText('wizard.disclaimerTitle')).toBeInTheDocument();
    });
  });

  describe('onboarding — disclaimer step', () => {
    function goToDisclaimer() {
      fireEvent.click(screen.getByRole('button', { name: 'common.confirm' }));
    }

    it('shows disclaimer content and CTA', () => {
      render(<WizardScreen onDone={onDone} />);
      goToDisclaimer();
      expect(screen.getByText('wizard.disclaimerBody')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'wizard.disclaimerContinue' })).toBeInTheDocument();
    });

    it('advances to about step', () => {
      render(<WizardScreen onDone={onDone} />);
      goToDisclaimer();
      fireEvent.click(screen.getByRole('button', { name: 'wizard.disclaimerContinue' }));
      expect(screen.getByText('info.title')).toBeInTheDocument();
      expect(screen.getAllByText('wizard.aboutStep1').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('onboarding — about step', () => {
    function goToAbout() {
      fireEvent.click(screen.getByRole('button', { name: 'common.confirm' }));
      fireEvent.click(screen.getByRole('button', { name: 'wizard.disclaimerContinue' }));
    }

    it('shows brief summary and two CTAs', () => {
      render(<WizardScreen onDone={onDone} />);
      goToAbout();
      expect(screen.getByRole('button', { name: 'wizard.tellMeMore' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'wizard.letsStart' })).toBeInTheDocument();
    });

    it('"Let\'s start" skips to choice step', () => {
      render(<WizardScreen onDone={onDone} />);
      goToAbout();
      fireEvent.click(screen.getByRole('button', { name: 'wizard.letsStart' }));
      expect(screen.getByText((t) => t.includes('wizard.choiceTitle'))).toBeInTheDocument();
    });

    it('"Tell me more" opens the detail view', () => {
      render(<WizardScreen onDone={onDone} />);
      goToAbout();
      fireEvent.click(screen.getByRole('button', { name: 'wizard.tellMeMore' }));
      expect(screen.getByText('info.whatIsVPPBTitle')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'wizard.letsStart' })).toBeInTheDocument();
    });

    it('"Let\'s start" from detail view advances to choice', () => {
      render(<WizardScreen onDone={onDone} />);
      goToAbout();
      fireEvent.click(screen.getByRole('button', { name: 'wizard.tellMeMore' }));
      fireEvent.click(screen.getByRole('button', { name: 'wizard.letsStart' }));
      expect(screen.getByText((t) => t.includes('wizard.choiceTitle'))).toBeInTheDocument();
    });
  });

  describe('onboarding — choice step', () => {
    function goToChoice() {
      fireEvent.click(screen.getByRole('button', { name: 'common.confirm' }));
      fireEvent.click(screen.getByRole('button', { name: 'wizard.disclaimerContinue' }));
      fireEvent.click(screen.getByRole('button', { name: 'wizard.letsStart' }));
    }

    it('preselects the defaults option', () => {
      render(<WizardScreen onDone={onDone} />);
      goToChoice();
      const defaultsButton = screen.getByRole('button', { name: /wizard.defaults/i });
      expect(defaultsButton.className).toContain('border-brand-500');
      expect(screen.getByRole('button', { name: 'wizard.choiceConfirm' })).not.toBeDisabled();
    });

    it('chooses defaults and completes onboarding after confirming', () => {
      render(<WizardScreen onDone={onDone} />);
      goToChoice();
      fireEvent.click(screen.getByRole('button', { name: /wizard.defaults/i }));
      fireEvent.click(screen.getByRole('button', { name: 'wizard.choiceConfirm' }));
      expect(onDone).toHaveBeenCalledTimes(1);
      expect(useTreatmentStore.getState().onboardingComplete).toBe(true);
    });

    it('navigates to manual configuration when manual option is clicked', () => {
      render(<WizardScreen onDone={onDone} />);
      goToChoice();
      fireEvent.click(screen.getByRole('button', { name: /wizard.manual/i }));
      expect(screen.getByText('wizard.manualTitle')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'wizard.save' })).toBeInTheDocument();
    });
  });

  describe('onboarding — manual step', () => {
    function goToManual() {
      fireEvent.click(screen.getByRole('button', { name: 'common.confirm' }));
      fireEvent.click(screen.getByRole('button', { name: 'wizard.disclaimerContinue' }));
      fireEvent.click(screen.getByRole('button', { name: 'wizard.letsStart' }));
      fireEvent.click(screen.getByRole('button', { name: /wizard.manual/i }));
    }

    it('saves manual config and completes onboarding', () => {
      render(<WizardScreen onDone={onDone} />);
      goToManual();
      fireEvent.click(screen.getAllByRole('button', { name: 'increase' })[0]);
      fireEvent.click(screen.getByRole('button', { name: 'wizard.save' }));
      expect(useTreatmentStore.getState().config.cyclesPerSession).toBe(6);
      expect(onDone).toHaveBeenCalledTimes(1);
    });

  });

  describe('reconfigure mode', () => {
    it('starts directly at choice step', () => {
      render(<WizardScreen onDone={onDone} onBack={onBack} mode="reconfigure" />);
      expect(screen.queryByText('language.title')).not.toBeInTheDocument();
      expect(screen.queryByText('wizard.disclaimerTitle')).not.toBeInTheDocument();
      expect(screen.queryByText('wizard.aboutSummary')).not.toBeInTheDocument();
      expect(screen.getByText('wizard.reconfigureTitle')).toBeInTheDocument();
    });

    it('shows using-now indicator', () => {
      render(<WizardScreen onDone={onDone} onBack={onBack} mode="reconfigure" />);
      expect(screen.getAllByText('wizard.usingNow').length).toBeGreaterThanOrEqual(1);
    });

    it('uses save-only label in manual mode', () => {
      render(<WizardScreen onDone={onDone} onBack={onBack} mode="reconfigure" />);
      fireEvent.click(screen.getByRole('button', { name: /wizard.manual/i }));
      expect(screen.getByRole('button', { name: 'wizard.saveOnly' })).toBeInTheDocument();
    });
  });
});
