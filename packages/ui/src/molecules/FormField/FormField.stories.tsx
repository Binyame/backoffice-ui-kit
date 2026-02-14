import type { Meta, StoryObj } from '@storybook/react';
import { FormField } from './FormField';

const meta = {
  title: 'Molecules/FormField',
  component: FormField,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => (<div style={{ width: '400px' }}><Story /></div>)],
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextInput: Story = {
  args: {
    label: 'Email Address',
    id: 'email',
    required: true,
    inputProps: { type: 'email', placeholder: 'Enter your email' },
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Username',
    id: 'username',
    inputProps: { placeholder: 'Choose a username' },
    helperText: 'Must be 3-20 characters',
  },
};

export const WithError: Story = {
  args: {
    label: 'Password',
    id: 'password',
    required: true,
    inputProps: { type: 'password', value: '123' },
    errorText: 'Password must be at least 8 characters',
  },
};

export const SelectField: Story = {
  args: {
    label: 'Country',
    id: 'country',
    fieldType: 'select',
    selectProps: {
      options: [
        { value: 'us', label: 'United States' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'ca', label: 'Canada' },
      ],
      placeholder: 'Select a country',
    },
  },
};
