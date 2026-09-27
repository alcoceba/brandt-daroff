import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StoragePrivacyNotice } from './StoragePrivacyNotice';

describe('StoragePrivacyNotice component', () => {
  it('renders privacy notice and highlighted private browsing warning', () => {
    render(<StoragePrivacyNotice />);

    expect(screen.getByText('wizard.storagePrivacyNotice')).toBeInTheDocument();
    expect(screen.getByText('wizard.privateBrowsingWarningHighlight')).toBeInTheDocument();
  });
});
