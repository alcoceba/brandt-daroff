import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';

const meta: Meta<typeof ButtonGroup> = {
  title: 'Core/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  args: {
    title: 'Daily Sessions',
  },
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="primary">Morning</Button>
      <Button variant="secondary">Midday</Button>
      <Button variant="secondary">Evening</Button>
    </ButtonGroup>
  ),
};

export const ActionsGrid: Story = {
  args: {
    title: 'Quick Actions',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="secondary">Reconfigure</Button>
      <Button variant="danger">Reset Data</Button>
    </ButtonGroup>
  ),
};
