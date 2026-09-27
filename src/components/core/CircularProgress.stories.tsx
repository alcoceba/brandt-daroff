import type { Meta, StoryObj } from '@storybook/react';
import { CircularProgress } from './CircularProgress';

const meta: Meta<typeof CircularProgress> = {
  title: 'Core/CircularProgress',
  component: CircularProgress,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
    },
    secondaryValue: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
    },
    size: {
      control: { type: 'number', min: 40, max: 200, step: 8 },
    },
    strokeWidth: {
      control: { type: 'number', min: 2, max: 16, step: 1 },
    },
  },
  args: {
    value: 0.65,
    secondaryValue: 0,
    size: 80,
    strokeWidth: 6,
  },
};

export default meta;
type Story = StoryObj<typeof CircularProgress>;

export const Default: Story = {
  args: {
    value: 0.6,
  },
};

export const WithCenterContent: Story = {
  args: {
    value: 0.75,
    size: 100,
    strokeWidth: 8,
    children: <span className="text-xl font-bold text-white">75%</span>,
  },
};

export const WithSecondaryProgress: Story = {
  args: {
    value: 0.5,
    secondaryValue: 0.25,
    size: 96,
    strokeWidth: 8,
    children: (
      <div className="flex flex-col items-center">
        <span className="text-xs text-slate-400">Total</span>
        <span className="text-lg font-bold text-white">75%</span>
      </div>
    ),
  },
};

export const Empty: Story = {
  args: {
    value: 0,
  },
};

export const Complete: Story = {
  args: {
    value: 1,
    fillClassName: 'stroke-emerald-400',
    children: <span className="text-lg font-bold text-emerald-400">✓</span>,
  },
};
