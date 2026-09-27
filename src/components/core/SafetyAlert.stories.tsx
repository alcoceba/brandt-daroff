import type { Meta, StoryObj } from '@storybook/react';
import { SafetyAlert } from './SafetyAlert';

const meta: Meta<typeof SafetyAlert> = {
  title: 'Core/SafetyAlert',
  component: SafetyAlert,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['danger', 'warning'],
    },
  },
  args: {
    variant: 'danger',
  },
};

export default meta;
type Story = StoryObj<typeof SafetyAlert>;

export const Danger: Story = {
  args: {
    variant: 'danger',
    title: 'Emergency Warning Signs',
    children: (
      <div className="flex flex-col gap-2 text-sm text-red-200/90">
        <p>Stop exercises immediately and seek urgent medical care if you notice:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Sudden facial drooping, arm, or leg weakness</li>
          <li>Double vision or acute vision loss</li>
          <li>Difficulty speaking or slurred speech</li>
        </ul>
      </div>
    ),
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Consult Your Physician First',
    children: (
      <p className="text-sm text-amber-200/90">
        These exercises should only be performed after a medical diagnosis of BPPV by a healthcare professional.
      </p>
    ),
  },
};
