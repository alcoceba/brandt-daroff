import type { Meta, StoryObj } from '@storybook/react';
import { CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { FeatureListItem } from './FeatureListItem';

const meta: Meta<typeof FeatureListItem> = {
  title: 'Core/FeatureListItem',
  component: FeatureListItem,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FeatureListItem>;

export const Default: Story = {
  args: {
    children: 'Large visual timer easy to read from your bed',
  },
};

export const CustomIcon: Story = {
  args: {
    children: '100% private: no data leaves your device',
    icon: <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />,
  },
};

export const ListExample: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-2.5 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <FeatureListItem icon={<CheckCircle2 className="h-4 w-4 shrink-0 text-brand-400" />}>
        Large visual timer easy to read from your bed
      </FeatureListItem>
      <FeatureListItem icon={<Zap className="h-4 w-4 shrink-0 text-amber-400" />}>
        Instant start with no login or signup
      </FeatureListItem>
      <FeatureListItem icon={<ShieldCheck className="h-4 w-4 shrink-0 text-blue-400" />}>
        Works completely offline as an installable PWA
      </FeatureListItem>
    </div>
  ),
};
