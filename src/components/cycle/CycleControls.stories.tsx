import type { Meta, StoryObj } from '@storybook/react';
import { CycleControls } from './CycleControls';
import type { PositionKind } from '@/types';

const meta: Meta<typeof CycleControls> = {
  title: 'Cycle/CycleControls',
  component: CycleControls,
  tags: ['autodocs'],
  argTypes: {
    kind: {
      control: 'select',
      options: ['sitting', 'lying-right', 'rest', 'lying-left', 'long-rest'] satisfies PositionKind[],
    },
    isTransition: { control: 'boolean' },
    isRunning: { control: 'boolean' },
    isPaused: { control: 'boolean' },
    onAdvance: { action: 'advance clicked' },
    onAdvanceSkip: { action: 'advance skip clicked' },
    onPauseResume: { action: 'pause/resume clicked' },
  },
  args: {
    kind: 'lying-right',
    isTransition: false,
    isRunning: true,
    isPaused: false,
    startLabel: 'Start Position',
    pauseLabel: 'Pause',
    resumeLabel: 'Resume',
    nextLabel: 'Dizziness Passed',
  },
};

export default meta;
type Story = StoryObj<typeof CycleControls>;

export const ActiveTicking: Story = {
  args: {
    kind: 'lying-right',
    isTransition: false,
    isRunning: true,
    isPaused: false,
  },
};

export const Paused: Story = {
  args: {
    kind: 'lying-right',
    isTransition: false,
    isRunning: false,
    isPaused: true,
  },
};

export const TransitionReadyToStart: Story = {
  args: {
    kind: 'sitting',
    isTransition: true,
    isRunning: false,
    isPaused: false,
    startLabel: 'Begin Cycle',
  },
};

export const ShortRestControls: Story = {
  args: {
    kind: 'rest',
    isTransition: false,
    isRunning: true,
    isPaused: false,
    nextLabel: 'Skip Rest',
  },
};

export const LongRestControls: Story = {
  args: {
    kind: 'long-rest',
    isTransition: false,
    isRunning: true,
    isPaused: false,
    nextLabel: 'Skip to Next Cycle',
  },
};
