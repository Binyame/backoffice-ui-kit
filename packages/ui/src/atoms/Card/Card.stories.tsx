import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta = {
  title: 'Atoms/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => (<div style={{ width: '400px' }}><Story /></div>)],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: <div><h3 style={{ marginBottom: '0.5rem' }}>Card Title</h3><p style={{ color: '#6b7280' }}>Card content goes here</p></div> },
};
export const NoPadding: Story = { args: { ...Default.args, padding: 'none' } };
export const WithShadow: Story = { args: { ...Default.args, shadow: 'medium' } };
export const Clickable: Story = { args: { ...Default.args, onClick: () => alert('Card clicked!') } };
