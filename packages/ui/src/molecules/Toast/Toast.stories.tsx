import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';

const meta = {
  title: 'Molecules/Toast',
  component: Toast,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => (<div style={{ width: '400px' }}><Story /></div>)],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    message: 'Owner created successfully!',
    variant: 'success',
    onClose: () => console.log('Toast closed'),
  },
};

export const Error: Story = {
  args: {
    message: 'Failed to delete owner. Please try again.',
    variant: 'error',
    onClose: () => console.log('Toast closed'),
  },
};

export const Warning: Story = {
  args: {
    message: 'Your session will expire in 5 minutes.',
    variant: 'warning',
    onClose: () => console.log('Toast closed'),
  },
};

export const Info: Story = {
  args: {
    message: 'New updates are available.',
    variant: 'info',
    onClose: () => console.log('Toast closed'),
  },
};

export const WithoutCloseButton: Story = {
  args: {
    message: 'This notification will auto-dismiss.',
    variant: 'success',
    showCloseButton: false,
    duration: 3000,
  },
};

export const LongMessage: Story = {
  args: {
    message: 'This is a longer notification message that demonstrates how the toast handles multiple lines of text content.',
    variant: 'info',
    onClose: () => console.log('Toast closed'),
  },
};
