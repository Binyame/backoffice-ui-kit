import type { Meta, StoryObj } from '@storybook/react';
import { TextInput } from './TextInput';

const meta = {
  title: 'Atoms/TextInput',
  component: TextInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'url', 'tel', 'number'],
    },
    disabled: {
      control: 'boolean',
    },
    readOnly: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
    onChange: { action: 'changed' },
    onFocus: { action: 'focused' },
    onBlur: { action: 'blurred' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithValue: Story = {
  args: {
    value: 'Hello World',
    placeholder: 'Enter text...',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'email@example.com',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: '0',
    min: 0,
    max: 100,
  },
};

export const Disabled: Story = {
  args: {
    value: 'Disabled input',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    value: 'Read-only input',
    readOnly: true,
  },
};

export const ErrorState: Story = {
  args: {
    value: 'Invalid input',
    error: true,
    'aria-invalid': true,
    'aria-describedby': 'error-message',
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div style={{ width: '100%' }}>
      <label
        htmlFor="input-with-label"
        style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        Full Name
      </label>
      <TextInput {...args} id="input-with-label" />
    </div>
  ),
  args: {
    placeholder: 'John Doe',
  },
};

export const WithError: Story = {
  render: (args) => (
    <div style={{ width: '100%' }}>
      <label
        htmlFor="input-with-error"
        style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        Email
      </label>
      <TextInput
        {...args}
        id="input-with-error"
        error
        aria-describedby="error-msg"
      />
      <span
        id="error-msg"
        style={{
          display: 'block',
          marginTop: '0.25rem',
          fontSize: '0.875rem',
          color: '#dc2626',
        }}
      >
        Invalid email format
      </span>
    </div>
  ),
  args: {
    type: 'email',
    value: 'invalid-email',
  },
};
