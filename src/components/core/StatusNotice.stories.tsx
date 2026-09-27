import type { Meta, StoryObj } from '@storybook/react';
import { CheckCircle2, AlertTriangle, XCircle, Award } from 'lucide-react';
import { StatusNotice } from './StatusNotice';

const meta: Meta<typeof StatusNotice> = {
  title: 'Core/StatusNotice',
  component: StatusNotice,
  tags: ['autodocs'],
  argTypes: {
    onDone: { action: 'done triggered' },
    durationMs: { control: { type: 'number', min: 0, max: 10000, step: 500 } },
  },
  args: {
    durationMs: 0, // Disabled auto-dismiss in storybook by default so it stays visible
  },
};

export default meta;
type Story = StoryObj<typeof StatusNotice>;

export const SessionCompleted: Story = {
  args: {
    icon: <CheckCircle2 size={48} className="text-emerald-400" />,
    iconBadgeClassName: 'bg-emerald-500/20 text-emerald-400',
    title: 'Session Complete!',
    subtitle: 'Great job staying consistent with your treatment.',
  },
};

export const TreatmentFinished: Story = {
  args: {
    icon: <Award size={48} className="text-amber-400" />,
    iconBadgeClassName: 'bg-amber-500/20 text-amber-400',
    title: 'Treatment Completed!',
    subtitle: 'You have completed the entire 14-day protocol.',
  },
};

export const SafetyAlert: Story = {
  args: {
    icon: <AlertTriangle size={48} className="text-red-400" />,
    iconBadgeClassName: 'bg-red-500/20 text-red-400',
    title: 'Exercise Stopped',
    subtitle: 'Rest comfortably and monitor your symptoms.',
  },
};

export const AbandonedSession: Story = {
  args: {
    icon: <XCircle size={48} className="text-slate-400" />,
    iconBadgeClassName: 'bg-slate-700 text-slate-300',
    title: 'Session Paused',
    subtitle: 'You can resume this session at any time today.',
  },
};
