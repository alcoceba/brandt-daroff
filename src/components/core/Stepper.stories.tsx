import type { Meta, StoryObj } from '@storybook/react';
import { Timer, Clock, Calendar, Repeat } from 'lucide-react';
import { Stepper } from './Stepper';

const meta: Meta<typeof Stepper> = {
  title: 'Core/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
    value: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
  },
  args: {
    label: 'Position Duration',
    unit: 's',
    description: 'Time spent maintaining each exercise position',
    icon: <Timer size={20} className="text-brand-400" />,
    value: 30,
    step: 5,
    min: 15,
    max: 60,
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const PositionDuration: Story = {
  args: {
    label: 'Position Duration',
    unit: 's',
    description: 'Recommended protocol duration is 30 seconds',
    icon: <Timer size={20} className="text-brand-400" />,
    value: 30,
    step: 5,
    min: 15,
    max: 60,
  },
};

export const RestBetweenCycles: Story = {
  args: {
    label: 'Rest Between Cycles',
    unit: 'min',
    description: 'Rest period between complete 5-position cycles',
    icon: <Clock size={20} className="text-amber-400" />,
    value: 2,
    step: 1,
    min: 1,
    max: 10,
  },
};

export const TreatmentDays: Story = {
  args: {
    label: 'Treatment Days',
    unit: 'days',
    description: 'Total consecutive days for the rehabilitation program',
    icon: <Calendar size={20} className="text-sky-400" />,
    value: 14,
    step: 1,
    min: 7,
    max: 30,
  },
};

export const CyclesPerSession: Story = {
  args: {
    label: 'Cycles per Session',
    unit: 'cycles',
    description: 'Number of repetitions per session',
    icon: <Repeat size={20} className="text-emerald-400" />,
    value: 5,
    step: 1,
    min: 1,
    max: 10,
  },
};

export const AtMinimumLimit: Story = {
  args: {
    label: 'Sessions per Day',
    unit: 'slots',
    icon: <Repeat size={20} className="text-slate-400" />,
    value: 1,
    step: 1,
    min: 1,
    max: 5,
  },
};
