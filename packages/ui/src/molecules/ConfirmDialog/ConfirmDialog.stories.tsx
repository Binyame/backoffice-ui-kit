import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ConfirmDialog } from './ConfirmDialog';
import { Button } from '../../atoms/Button';

const meta = {
  title: 'Molecules/ConfirmDialog',
  component: ConfirmDialog,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component to handle dialog state
const DialogWrapper = (args: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Dialog</Button>
      <ConfirmDialog
        {...args}
        isOpen={isOpen}
        onCancel={() => setIsOpen(false)}
        onConfirm={() => {
          console.log('Confirmed!');
          setIsOpen(false);
        }}
      />
    </>
  );
};

export const DeleteConfirmation: Story = {
  render: (args) => <DialogWrapper {...args} />,
  args: {
    title: 'Delete Owner',
    message: 'Are you sure you want to delete this owner? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    confirmVariant: 'danger',
  },
};

export const SaveConfirmation: Story = {
  render: (args) => <DialogWrapper {...args} />,
  args: {
    title: 'Save Changes',
    message: 'Do you want to save your changes before leaving?',
    confirmText: 'Save',
    cancelText: 'Discard',
    confirmVariant: 'primary',
  },
};

export const WithLoadingState: Story = {
  render: (args) => <DialogWrapper {...args} />,
  args: {
    title: 'Delete Owner',
    message: 'Are you sure you want to delete this owner?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    confirmVariant: 'danger',
    loading: true,
  },
};
