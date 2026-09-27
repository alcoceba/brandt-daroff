import type { Meta, StoryObj } from '@storybook/react';
import { CyclePositionView } from './CyclePositionView';
import { POSITIONS } from '@/constants/positions';

const meta: Meta<typeof CyclePositionView> = {
  title: 'Cycle/CyclePositionView',
  component: CyclePositionView,
  tags: ['autodocs'],
  argTypes: {
    isTransition: { control: 'boolean' },
    isPaused: { control: 'boolean' },
    isRunning: { control: 'boolean' },
    secondsRemaining: { control: { type: 'number', min: 0, max: 120 } },
    duration: { control: { type: 'number', min: 1, max: 120 } },
    cycleNumber: { control: { type: 'number', min: 1, max: 10 } },
    totalCycles: { control: { type: 'number', min: 1, max: 10 } },
  },
  args: {
    position: POSITIONS[1], // lying-right
    isTransition: false,
    isPaused: false,
    secondsRemaining: 24,
    duration: 30,
    isRunning: true,
    cycleNumber: 2,
    totalCycles: 5,
    label: 'Lying right · head 45°',
    cycleLabel: 'Cycle 2 / 5',
  },
};

export default meta;
type Story = StoryObj<typeof CyclePositionView>;

export const ActiveExercisePosition: Story = {
  args: {
    position: POSITIONS[1],
    label: 'Lying right · head 45°',
    secondsRemaining: 21,
    duration: 30,
    cycleNumber: 1,
    totalCycles: 5,
  },
};

export const TransitionInitialSitting: Story = {
  args: {
    position: POSITIONS[0],
    isTransition: true,
    isRunning: false,
    label: 'Sit upright on the bed edge',
    cycleNumber: 1,
    totalCycles: 5,
  },
};

export const ShortRest: Story = {
  args: {
    position: POSITIONS[2],
    label: 'Sit upright and rest',
    secondsRemaining: 18,
    duration: 30,
    cycleNumber: 2,
    totalCycles: 5,
  },
};

export const LyingLeft: Story = {
  args: {
    position: POSITIONS[3],
    label: 'Lying left · head 45°',
    secondsRemaining: 27,
    duration: 30,
    cycleNumber: 3,
    totalCycles: 5,
  },
};

export const LongRestBetweenCycles: Story = {
  args: {
    position: POSITIONS[4],
    label: 'Rest before next cycle',
    secondsRemaining: 90,
    duration: 120,
    cycleNumber: 3,
    totalCycles: 5,
  },
};

export const PausedState: Story = {
  args: {
    position: POSITIONS[1],
    isPaused: true,
    isRunning: false,
    secondsRemaining: 16,
    duration: 30,
    label: 'Lying right · head 45°',
    cycleNumber: 2,
    totalCycles: 5,
  },
};
