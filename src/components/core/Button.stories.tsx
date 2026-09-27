import type { Meta, StoryObj } from '@storybook/react';
import { Play, RotateCcw, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Core/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'outline',
        'danger',
        'solid-danger',
        'warning',
        'solid-warning',
        'ghost',
      ],
    },
    size: {
      control: 'radio',
      options: ['md', 'lg', 'icon'],
    },
    fullWidth: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    children: 'Action Button',
    variant: 'primary',
    size: 'md',
    fullWidth: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Start Session',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Configure',
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    children: 'View Details',
    variant: 'outline',
  },
};

export const Danger: Story = {
  args: {
    children: 'Emergency Stop',
    variant: 'danger',
  },
};

export const SolidDanger: Story = {
  args: {
    children: 'Reset Treatment',
    variant: 'solid-danger',
  },
};

export const Warning: Story = {
  args: {
    children: 'Skip Exercise',
    variant: 'warning',
  },
};

export const SolidWarning: Story = {
  args: {
    children: 'Caution Warning',
    variant: 'solid-warning',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Skip for now',
    variant: 'ghost',
  },
};

export const Large: Story = {
  args: {
    children: 'Next Position',
    size: 'lg',
    variant: 'primary',
  },
};

export const FullWidth: Story = {
  args: {
    children: 'Continue Treatment',
    fullWidth: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Locked Action',
    disabled: true,
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    children: (
      <>
        <Play size={20} className="fill-current" />
        <span>Resume Cycle</span>
      </>
    ),
  },
};

export const IconButton: Story = {
  args: {
    size: 'icon',
    variant: 'secondary',
    'aria-label': 'Reset',
    children: <RotateCcw size={22} />,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="danger">Danger Outline</Button>
      <Button variant="solid-danger">Solid Danger</Button>
      <Button variant="warning">Warning Outline</Button>
      <Button variant="solid-warning">Solid Warning</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="primary" size="lg">
        <Play size={22} className="fill-current" /> Large with Icon
      </Button>
      <Button variant="danger">
        <AlertTriangle size={20} /> Stop Exercise
      </Button>
    </div>
  ),
};
