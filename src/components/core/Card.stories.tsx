import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Button } from './Button';

const meta: Meta<typeof Card> = {
  title: 'Core/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'solid', 'subtle'],
    },
  },
  args: {
    variant: 'default',
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <h3 className="text-lg font-bold text-white">Card Title</h3>
      <p className="mt-1 text-sm text-slate-300">
        This is a standard card container with frosted blur and subtle border.
      </p>
    </Card>
  ),
};

export const Solid: Story = {
  args: {
    variant: 'solid',
  },
  render: (args) => (
    <Card {...args}>
      <h3 className="text-lg font-bold text-white">Solid Card</h3>
      <p className="mt-1 text-sm text-slate-300">
        A more opaque background for elevated contrast.
      </p>
    </Card>
  ),
};

export const Subtle: Story = {
  args: {
    variant: 'subtle',
  },
  render: (args) => (
    <Card {...args}>
      <h3 className="text-lg font-bold text-white">Subtle Card</h3>
      <p className="mt-1 text-sm text-slate-400">
        A darker, less prominent card style for secondary elements.
      </p>
    </Card>
  ),
};

export const WithInteractiveContent: Story = {
  render: () => (
    <Card className="flex flex-col gap-3">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
          Scheduled
        </span>
        <h3 className="text-lg font-bold text-white">Session 1 · Morning</h3>
        <p className="text-sm text-slate-300">5 cycles · Approx 12 min</p>
      </div>
      <Button variant="primary" fullWidth>
        Start Session
      </Button>
    </Card>
  ),
};
