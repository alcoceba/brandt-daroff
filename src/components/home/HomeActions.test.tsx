import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HomeActions } from './HomeActions';

describe('HomeActions', () => {
  it('renders info and settings buttons and calls handlers', () => {
    const onOpenInfo = vi.fn();
    const onOpenSettings = vi.fn();
    render(<HomeActions infoLabel="Info" settingsLabel="Settings" onOpenInfo={onOpenInfo} onOpenSettings={onOpenSettings} />);

    const infoButton = screen.getByText('Info').closest('button') as HTMLButtonElement;
    const settingsButton = screen.getByText('Settings').closest('button') as HTMLButtonElement;

    fireEvent.click(infoButton);
    expect(onOpenInfo).toHaveBeenCalledTimes(1);

    fireEvent.click(settingsButton);
    expect(onOpenSettings).toHaveBeenCalledTimes(1);
  });
});
