import type { Meta, StoryObj } from '@storybook/react';
import { Logo } from './Logo';

const meta: Meta<typeof Logo> = {
  title: 'Core/Logo',
  component: Logo,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'number', min: 48, max: 192, step: 12 },
    },
    showWordmark: {
      control: 'boolean',
    },
    name: {
      control: 'text',
    },
    tagline: {
      control: 'text',
    },
  },
  args: {
    size: 96,
    showWordmark: true,
  },
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const Default: Story = {
  args: {},
};

export const CustomText: Story = {
  args: {
    name: 'Brandt-Daroff',
    tagline: 'VPPB Home Rehabilitation',
  },
};

export const MarkOnly: Story = {
  args: {
    showWordmark: false,
    size: 72,
  },
};

export const SmallHeader: Story = {
  args: {
    size: 48,
    showWordmark: false,
  },
};
