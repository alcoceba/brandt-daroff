import type { Meta, StoryObj } from '@storybook/react';
import { ConfirmDialog } from './ConfirmDialog';

const meta: Meta<typeof ConfirmDialog> = {
  title: 'Core/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  argTypes: {
    onConfirm: { action: 'confirm clicked' },
    onCancel: { action: 'cancel clicked' },
  },
  args: {
    open: true,
    title: 'Confirm Action',
    body: 'Are you sure you want to proceed with this action?',
    danger: false,
    single: false,
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

export const Default: Story = {
  args: {
    title: 'Save Changes?',
    body: 'Your custom protocol configuration will be applied to future sessions.',
    confirmLabel: 'Save',
    cancelLabel: 'Cancel',
  },
};

export const Danger: Story = {
  args: {
    title: 'Reset Treatment?',
    body: 'This will erase all recorded sessions, streaks, and progress. This action cannot be undone.',
    confirmLabel: 'Reset Everything',
    cancelLabel: 'Keep Progress',
    danger: true,
  },
};

export const SingleButtonNotice: Story = {
  args: {
    title: 'Clinical Safety Notice',
    body: 'If you experience severe headache, speech difficulties, or limb weakness, stop immediately and seek medical attention.',
    confirmLabel: 'I Understand',
    single: true,
  },
};
