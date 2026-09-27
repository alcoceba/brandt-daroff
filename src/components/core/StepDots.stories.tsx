import type { Meta, StoryObj } from '@storybook/react';
import { StepDots } from './StepDots';

const meta: Meta<typeof StepDots> = {
  title: 'Core/StepDots',
  component: StepDots,
  tags: ['autodocs'],
  args: {
    steps: ['step-1', 'step-2', 'step-3', 'step-4', 'step-5'],
    current: 'step-2',
  },
};

export default meta;
type Story = StoryObj<typeof StepDots>;

export const Beginning: Story = {
  args: {
    current: 'step-1',
  },
};

export const Middle: Story = {
  args: {
    current: 'step-3',
  },
};

export const LastStep: Story = {
  args: {
    current: 'step-5',
  },
};

export const CustomColors: Story = {
  args: {
    current: 'step-2',
    activeClassName: 'bg-amber-400',
    completedClassName: 'bg-amber-400/50',
  },
};
