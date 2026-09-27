import type { Meta, StoryObj } from '@storybook/react';
import { ProgressIndicator } from './ProgressIndicator';

const meta: Meta<typeof ProgressIndicator> = {
  title: 'Core/ProgressIndicator',
  component: ProgressIndicator,
  tags: ['autodocs'],
  argTypes: {
    onBack: { action: 'back clicked' },
    showBack: { control: 'boolean' },
    showProgress: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    steps: ['language', 'disclaimer', 'choice', 'config'],
    current: 'disclaimer',
    showBack: true,
    showProgress: true,
  },
};

export default meta;
type Story = StoryObj<typeof ProgressIndicator>;

export const StepTwo: Story = {
  args: {
    current: 'disclaimer',
  },
};

export const FirstStepWithoutBack: Story = {
  args: {
    current: 'language',
    showBack: false,
  },
};

export const FinalStep: Story = {
  args: {
    current: 'config',
  },
};

export const CustomLabel: Story = {
  args: {
    label: 'Pas 2 de 4',
    current: 'disclaimer',
  },
};
