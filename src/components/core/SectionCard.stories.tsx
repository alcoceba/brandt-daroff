import type { Meta, StoryObj } from '@storybook/react';
import { CalendarDays, Ear, Move } from 'lucide-react';
import { SectionCard } from './SectionCard';

const meta: Meta<typeof SectionCard> = {
  title: 'Core/SectionCard',
  component: SectionCard,
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
type Story = StoryObj<typeof SectionCard>;

export const Default: Story = {
  args: {
    icon: <Ear className="h-5 w-5" />,
    iconBadgeClassName: 'bg-blue-500/15 text-blue-400',
    title: 'What is BPPV?',
    children: (
      <p className="text-sm leading-relaxed text-slate-300">
        Benign Paroxysmal Positional Vertigo is the most common cause of vertigo, caused by otolith particles in semicircular canals.
      </p>
    ),
  },
};

export const WithBadgeAndAction: Story = {
  args: {
    icon: <CalendarDays className="h-5 w-5" />,
    iconBadgeClassName: 'bg-purple-500/15 text-purple-400',
    title: 'Protocol Schedule',
    headerRight: (
      <span className="rounded-full bg-brand-500/20 px-2.5 py-0.5 text-xs font-semibold text-brand-400">
        14 Days
      </span>
    ),
    children: (
      <p className="text-sm leading-relaxed text-slate-300">
        3 sessions daily, with 5 cycles each, until 2 consecutive days without dizziness.
      </p>
    ),
  },
};

export const MovementSection: Story = {
  args: {
    icon: <Move className="h-5 w-5" />,
    iconBadgeClassName: 'bg-brand-500/15 text-brand-400',
    title: 'How It Works',
    children: (
      <div className="flex flex-col gap-2 text-sm text-slate-300">
        <p>Alternating lateral drops allow gravity to move free-floating otolith particles.</p>
      </div>
    ),
  },
};
