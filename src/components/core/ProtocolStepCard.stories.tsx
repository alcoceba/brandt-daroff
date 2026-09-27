import type { Meta, StoryObj } from '@storybook/react';
import { ProtocolStepCard } from './ProtocolStepCard';

const meta: Meta<typeof ProtocolStepCard> = {
  title: 'Core/ProtocolStepCard',
  component: ProtocolStepCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProtocolStepCard>;

export const Default: Story = {
  args: {
    number: 1,
    title: 'Starting Position: Sitting on the bed edge',
    duration: 'Initial transition',
    text: 'Sit in the center of the bed edge with your back straight and feet hanging down.',
    note: 'The app waits for you to tap start before timing begins.',
  },
};

export const WithoutNote: Story = {
  args: {
    number: 2,
    title: 'Lie on right side with head turned 45° upward',
    duration: '30 seconds',
    text: 'Drop onto your right side while turning your head 45 degrees upward.',
  },
};

export const RestStep: Story = {
  args: {
    number: 5,
    title: 'Rest between cycles',
    duration: '2 minutes',
    text: 'Sit upright again and rest for 2 full minutes before starting the next cycle.',
    note: 'Take your time: this rest prevents fatigue and nausea.',
    noteLabel: 'Consell:',
  },
};
