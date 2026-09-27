import type { Meta, StoryObj } from '@storybook/react';
import { SessionCompletionCard } from './SessionCompletionCard';

const meta: Meta<typeof SessionCompletionCard> = {
  title: 'Cycle/SessionCompletionCard',
  component: SessionCompletionCard,
  tags: ['autodocs'],
  argTypes: {
    dayNumber: { control: { type: 'number', min: 1, max: 30 } },
    isExtraSession: { control: 'boolean' },
    completedCount: { control: { type: 'number', min: 1, max: 42 } },
    extraCompletedCount: { control: { type: 'number', min: 0, max: 10 } },
    totalSessions: { control: { type: 'number', min: 1, max: 42 } },
    elapsedSeconds: { control: { type: 'number', min: 60, max: 3600, step: 30 } },
    onDone: { action: 'done clicked' },
  },
  args: {
    dayNumber: 3,
    isExtraSession: false,
    completedCount: 8,
    extraCompletedCount: 0,
    totalSessions: 42,
    elapsedSeconds: 680,
  },
};

export default meta;
type Story = StoryObj<typeof SessionCompletionCard>;

export const ScheduledSessionComplete: Story = {
  args: {
    dayNumber: 1,
    isExtraSession: false,
    completedCount: 1,
    extraCompletedCount: 0,
    totalSessions: 42,
    elapsedSeconds: 615,
  },
};

export const ExtraSessionComplete: Story = {
  args: {
    dayNumber: 4,
    isExtraSession: true,
    completedCount: 12,
    extraCompletedCount: 1,
    totalSessions: 42,
    elapsedSeconds: 590,
  },
};

export const FinalTreatmentDayComplete: Story = {
  args: {
    dayNumber: 14,
    isExtraSession: false,
    completedCount: 42,
    extraCompletedCount: 3,
    totalSessions: 42,
    elapsedSeconds: 630,
  },
};
