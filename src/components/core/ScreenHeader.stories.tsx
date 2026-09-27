import type { Meta, StoryObj } from '@storybook/react';
import { Settings } from 'lucide-react';
import { ScreenHeader } from './ScreenHeader';
import { Button } from './Button';

const meta: Meta<typeof ScreenHeader> = {
  title: 'Core/ScreenHeader',
  component: ScreenHeader,
  tags: ['autodocs'],
  argTypes: {
    onBack: { action: 'back clicked' },
    title: { control: 'text' },
  },
  args: {
    title: 'Screen Title',
  },
};

export default meta;
type Story = StoryObj<typeof ScreenHeader>;

export const Default: Story = {
  args: {
    title: 'Settings',
  },
};

export const WithBackButton: Story = {
  args: {
    title: 'Reconfigure Protocol',
    onBack: () => alert('Back clicked'),
  },
};

export const WithRightAction: Story = {
  args: {
    title: 'Home',
    rightAction: (
      <Button size="icon" variant="ghost" aria-label="Settings">
        <Settings size={22} />
      </Button>
    ),
  },
};

export const WithBackAndRightAction: Story = {
  args: {
    title: 'Exercise Session',
    onBack: () => alert('Back clicked'),
    rightAction: (
      <span className="text-sm font-semibold text-brand-400">Day 3 / 14</span>
    ),
  },
};
