import type { Meta, StoryObj } from '@storybook/react';
import { CycleTopBar } from './CycleTopBar';

const meta: Meta<typeof CycleTopBar> = {
  title: 'Cycle/CycleTopBar',
  component: CycleTopBar,
  tags: ['autodocs'],
  argTypes: {
    onBack: { action: 'back clicked' },
    onReset: { action: 'reset clicked' },
    onToggleSound: { action: 'toggle sound clicked' },
    soundEnabled: { control: 'boolean' },
    title: { control: 'text' },
  },
  args: {
    title: 'Cycle 2 / 5',
    soundEnabled: true,
    moreActionsLabel: 'More actions',
    muteLabel: 'Mute sound',
    unmuteLabel: 'Enable sound',
    resetLabel: 'Reset cycle',
  },
};

export default meta;
type Story = StoryObj<typeof CycleTopBar>;

export const Default: Story = {
  args: {},
};

export const SoundMuted: Story = {
  args: {
    soundEnabled: false,
    title: 'Cycle 3 / 5',
  },
};

export const FirstCycle: Story = {
  args: {
    title: 'Cycle 1 / 5',
    soundEnabled: true,
  },
};
