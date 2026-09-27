import type { Meta, StoryObj } from '@storybook/react';
import { CountdownRing } from './CountdownRing';

const meta: Meta<typeof CountdownRing> = {
  title: 'Core/CountdownRing',
  component: CountdownRing,
  tags: ['autodocs'],
  argTypes: {
    secondsRemaining: {
      control: { type: 'number', min: 0, max: 120, step: 1 },
    },
    totalDuration: {
      control: { type: 'number', min: 1, max: 120, step: 1 },
    },
    isRunning: {
      control: 'boolean',
    },
    strokeColor: {
      control: 'color',
    },
    trackColor: {
      control: 'color',
    },
  },
  args: {
    secondsRemaining: 24,
    totalDuration: 30,
    isRunning: true,
    strokeColor: '#22c55e',
    trackColor: '#1e293b',
  },
};

export default meta;
type Story = StoryObj<typeof CountdownRing>;

export const ActivePosition: Story = {
  args: {
    secondsRemaining: 18,
    totalDuration: 30,
    isRunning: true,
    strokeColor: '#22c55e',
  },
};

export const ShortRest: Story = {
  args: {
    secondsRemaining: 12,
    totalDuration: 30,
    isRunning: true,
    strokeColor: '#f59e0b',
  },
};

export const LongRest: Story = {
  args: {
    secondsRemaining: 95,
    totalDuration: 120,
    isRunning: true,
    strokeColor: '#ef4444',
  },
};

export const Paused: Story = {
  args: {
    secondsRemaining: 15,
    totalDuration: 30,
    isRunning: false,
    strokeColor: '#22c55e',
  },
};

export const CustomCenterContent: Story = {
  args: {
    secondsRemaining: 0,
    totalDuration: 30,
    isRunning: false,
    strokeColor: '#22c55e',
    centerContent: <span className="text-3xl font-bold text-emerald-400">Ready</span>,
  },
};
