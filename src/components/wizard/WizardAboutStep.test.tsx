import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WizardAboutStep } from './WizardAboutStep';

describe('WizardAboutStep', () => {
  it('renders title, subtitle and step summary', () => {
    render(<WizardAboutStep onTellMeMore={vi.fn()} onStart={vi.fn()} />);

    expect(screen.getByText('info.title')).toBeInTheDocument();
    expect(screen.getByText('wizard.aboutSubtitle')).toBeInTheDocument();
    expect(screen.getByText('wizard.aboutSummary')).toBeInTheDocument();
  });

  it('calls onTellMeMore when tell me more button is clicked', () => {
    const onTellMeMore = vi.fn();
    render(<WizardAboutStep onTellMeMore={onTellMeMore} onStart={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'wizard.tellMeMore' }));
    expect(onTellMeMore).toHaveBeenCalledTimes(1);
  });

  it('calls onStart when continue button is clicked', () => {
    const onStart = vi.fn();
    render(<WizardAboutStep onTellMeMore={vi.fn()} onStart={onStart} />);

    fireEvent.click(screen.getByRole('button', { name: 'wizard.aboutContinue' }));
    expect(onStart).toHaveBeenCalledTimes(1);
  });
});
