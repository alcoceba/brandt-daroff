import type { Meta, StoryObj } from '@storybook/react';
import { BackButton } from './BackButton';

const meta: Meta<typeof BackButton> = {
  title: 'Core/BackButton',
  component: BackButton,
  tags: ['autodocs'],
  argTypes: {
    onBack: { action: 'back clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof BackButton>;

export const Default: Story = {
  args: {},
};

export const InHeaderContext: Story = {
  render: () => (
    <div className="flex items-center gap-3 rounded-xl border border-slate-700/80 bg-slate-800/80 p-3">
      <BackButton onBack={() => alert('Back pressed')} />
      <span className="font-bold text-white">Back Navigation Demo</span>
    </div>
  ),
};
