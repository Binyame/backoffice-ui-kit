import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: 'Default' } };
export const Primary: Story = { args: { children: 'Primary', variant: 'primary' } };
export const Success: Story = { args: { children: 'Success', variant: 'success' } };
export const Warning: Story = { args: { children: 'Warning', variant: 'warning' } };
export const Danger: Story = { args: { children: 'Danger', variant: 'danger' } };
export const Small: Story = { args: { children: 'Small', size: 'small' } };
export const Large: Story = { args: { children: 'Large', size: 'large' } };
