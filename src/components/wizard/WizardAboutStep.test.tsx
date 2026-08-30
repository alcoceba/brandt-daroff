import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WizardAboutStep } from './WizardAboutStep';

describe('WizardAboutStep', () => {
  it('renders title, subtitle and step summary', () => {
    render(<WizardAboutStep onTellMeMore={vi.fn()} />);

    expect(screen.getByText('info.title')).toBeInTheDocument();
    expect(screen.getByText('wizard.aboutSubtitle')).toBeInTheDocument();
    expect(screen.getByText('wizard.aboutSummary')).toBeInTheDocument();
  });

  it('calls onTellMeMore when tell me more button is clicked', () => {
    const onTellMeMore = vi.fn();
    render(<WizardAboutStep onTellMeMore={onTellMeMore} />);

    fireEvent.click(screen.getByRole('button', { name: 'wizard.tellMeMore' }));
    expect(onTellMeMore).toHaveBeenCalledTimes(1);
  });
});
