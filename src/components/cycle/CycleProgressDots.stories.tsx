import type { Meta, StoryObj } from '@storybook/react';
import { CycleProgressDots } from './CycleProgressDots';
import type { PositionKind } from '@/types';

const meta: Meta<typeof CycleProgressDots> = {
  title: 'Cycle/CycleProgressDots',
  component: CycleProgressDots,
  tags: ['autodocs'],
  argTypes: {
    total: {
      control: { type: 'number', min: 1, max: 10, step: 1 },
    },
    currentIndex: {
      control: { type: 'number', min: 0, max: 10, step: 1 },
    },
    kind: {
      control: 'select',
      options: ['sitting', 'lying-right', 'rest', 'lying-left', 'long-rest'] satisfies PositionKind[],
    },
    isPaused: {
      control: 'boolean',
    },
  },
  args: {
    total: 5,
    currentIndex: 1,
    kind: 'lying-right',
    isPaused: false,
  },
};

export default meta;
type Story = StoryObj<typeof CycleProgressDots>;

export const FirstCycle: Story = {
  args: {
    currentIndex: 0,
    kind: 'sitting',
  },
};

export const MiddleCycle: Story = {
  args: {
    currentIndex: 2,
    kind: 'lying-left',
  },
};

export const FinalCycle: Story = {
  args: {
    currentIndex: 4,
    kind: 'long-rest',
  },
};

export const PausedState: Story = {
  args: {
    currentIndex: 1,
    kind: 'lying-right',
    isPaused: true,
  },
};

export const CustomTotalCycles: Story = {
  args: {
    total: 7,
    currentIndex: 3,
    kind: 'rest',
  },
};
