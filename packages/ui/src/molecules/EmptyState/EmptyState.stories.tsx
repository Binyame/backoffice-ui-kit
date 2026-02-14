import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';
import { Button } from '../../atoms/Button';

const meta = {
  title: 'Molecules/EmptyState',
  component: EmptyState,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => (<div style={{ width: '500px', height: '400px' }}><Story /></div>)],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoOwners: Story = {
  args: {
    icon: '👥',
    title: 'No owners yet',
    description: 'Get started by adding your first owner to the system.',
    action: <Button variant="primary">Add Owner</Button>,
  },
};

export const NoSearchResults: Story = {
  args: {
    icon: '🔍',
    title: 'No results found',
    description: 'Try adjusting your search terms or filters.',
  },
};

export const NoAuditLogs: Story = {
  args: {
    icon: '📋',
    title: 'No audit logs',
    description: 'Audit logs will appear here once actions are performed in the system.',
  },
};

export const ErrorState: Story = {
  args: {
    icon: '⚠️',
    title: 'Something went wrong',
    description: 'We couldn\'t load the data. Please try again.',
    action: <Button variant="secondary">Retry</Button>,
  },
};

export const WithoutIcon: Story = {
  args: {
    title: 'No data available',
    description: 'This is an empty state without an icon.',
  },
};

export const WithoutAction: Story = {
  args: {
    icon: '📭',
    title: 'Inbox empty',
    description: 'You\'re all caught up! No new notifications.',
  },
};
