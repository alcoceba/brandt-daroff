import type { Meta, StoryObj } from '@storybook/react';
import { StoragePrivacyNotice } from './StoragePrivacyNotice';

const meta = {
  title: 'Core/StoragePrivacyNotice',
  component: StoragePrivacyNotice,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof StoragePrivacyNotice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
