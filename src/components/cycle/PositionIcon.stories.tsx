import type { Meta, StoryObj } from '@storybook/react';
import { PositionIcon } from './PositionIcon';
import type { PositionKind } from '@/types';

const meta: Meta<typeof PositionIcon> = {
  title: 'Cycle/PositionIcon',
  component: PositionIcon,
  tags: ['autodocs'],
  argTypes: {
    kind: {
      control: 'select',
      options: ['sitting', 'lying-right', 'rest', 'lying-left', 'long-rest'] satisfies PositionKind[],
    },
    isPaused: {
      control: 'boolean',
    },
  },
  args: {
    kind: 'sitting',
    isPaused: false,
    className: 'h-24 w-24',
  },
};

export default meta;
type Story = StoryObj<typeof PositionIcon>;

export const Sitting: Story = {
  args: {
    kind: 'sitting',
  },
};

export const LyingRight: Story = {
  args: {
    kind: 'lying-right',
  },
};

export const RestShort: Story = {
  args: {
    kind: 'rest',
  },
};

export const LyingLeft: Story = {
  args: {
    kind: 'lying-left',
  },
};

export const LongRest: Story = {
  args: {
    kind: 'long-rest',
  },
};

export const Paused: Story = {
  args: {
    kind: 'lying-right',
    isPaused: true,
  },
};

export const AllPositionsGrid: Story = {
  render: () => (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
      {(['sitting', 'lying-right', 'rest', 'lying-left', 'long-rest'] as PositionKind[]).map((kind) => (
        <div
          key={kind}
          className="flex flex-col items-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-800/80 p-4"
        >
          <PositionIcon kind={kind} className="h-16 w-16" />
          <span className="text-xs font-semibold capitalize text-slate-300">
            {kind.replace('-', ' ')}
          </span>
        </div>
      ))}
    </div>
  ),
};
