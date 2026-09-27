import type { Meta, StoryObj } from '@storybook/react';
import { Clock, Flame, ShieldCheck, Target } from 'lucide-react';
import { StatCard } from './StatCard';

const meta: Meta<typeof StatCard> = {
  title: 'Core/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['subtle', 'default', 'compact'],
    },
  },
  args: {
    variant: 'subtle',
  },
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const DefaultSubtle: Story = {
  args: {
    label: 'Duració habitual',
    value: '10 a 14 dies',
    variant: 'subtle',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Streak',
    value: '5 days',
    icon: <Flame className="h-4 w-4 text-amber-400" />,
    variant: 'subtle',
  },
};

export const Compact: Story = {
  args: {
    label: 'Racha',
    value: '7',
    icon: <Flame className="h-3 w-3 text-amber-400" />,
    variant: 'compact',
  },
};

export const StatsGrid: Story = {
  render: () => (
    <div className="grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
      <StatCard
        label="Pauta clàssica"
        value="3 sessions / dia"
        icon={<Target className="h-4 w-4 text-brand-400" />}
      />
      <StatCard
        label="Temps invertit"
        value="1h 45m"
        icon={<Clock className="h-4 w-4 text-blue-400" />}
      />
      <StatCard
        label="Privadesa"
        value="100% local"
        icon={<ShieldCheck className="h-4 w-4 text-emerald-400" />}
      />
    </div>
  ),
};
