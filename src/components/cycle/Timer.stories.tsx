import type { Meta, StoryObj } from '@storybook/react';
import { Timer } from './Timer';
import type { PositionKind } from '@/types';

const meta: Meta<typeof Timer> = {
  title: 'Cycle/Timer',
  component: Timer,
  tags: ['autodocs'],
  argTypes: {
    kind: {
      control: 'select',
      options: ['sitting', 'lying-right', 'rest', 'lying-left', 'long-rest'] satisfies PositionKind[],
    },
    secondsRemaining: {
      control: { type: 'number', min: 0, max: 120, step: 1 },
    },
    totalDuration: {
      control: { type: 'number', min: 1, max: 120, step: 1 },
    },
    isRunning: {
      control: 'boolean',
    },
  },
  args: {
    secondsRemaining: 22,
    totalDuration: 30,
    isRunning: true,
    kind: 'lying-right',
  },
};

export default meta;
type Story = StoryObj<typeof Timer>;

export const ActivePositionRunning: Story = {
  args: {
    kind: 'lying-right',
    secondsRemaining: 20,
    totalDuration: 30,
    isRunning: true,
  },
};

export const ShortRestRunning: Story = {
  args: {
    kind: 'rest',
    secondsRemaining: 15,
    totalDuration: 30,
    isRunning: true,
  },
};

export const LongRestRunning: Story = {
  args: {
    kind: 'long-rest',
    secondsRemaining: 85,
    totalDuration: 120,
    isRunning: true,
  },
};

export const Paused: Story = {
  args: {
    kind: 'lying-left',
    secondsRemaining: 14,
    totalDuration: 30,
    isRunning: false,
  },
};

export const AboutToFinish: Story = {
  args: {
    kind: 'lying-right',
    secondsRemaining: 3,
    totalDuration: 30,
    isRunning: true,
  },
};
