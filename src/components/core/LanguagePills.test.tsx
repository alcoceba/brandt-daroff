import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguagePills } from './LanguagePills';

describe('LanguagePills component', () => {
  it('renders anchor tags when getHref is provided', () => {
    render(
      <LanguagePills
        currentLanguage="ca"
        getHref={(l) => `/info/${l}/`}
      />,
    );

    const caLink = screen.getByRole('link', { name: 'ca' });
    expect(caLink).toHaveAttribute('href', '/info/ca/');
    expect(caLink).toHaveAttribute('aria-current', 'page');

    const esLink = screen.getByRole('link', { name: 'es' });
    expect(esLink).toHaveAttribute('href', '/info/es/');
    expect(esLink).not.toHaveAttribute('aria-current');
  });

  it('renders buttons and triggers onSelectLanguage when clicked', () => {
    const onSelect = vi.fn();
    render(<LanguagePills currentLanguage="en" onSelectLanguage={onSelect} />);

    const esBtn = screen.getByRole('button', { name: 'es' });
    fireEvent.click(esBtn);

    expect(onSelect).toHaveBeenCalledWith('es');
  });
});
