import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta = {
  title: 'Atoms/Select',
  component: Select,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => (<div style={{ width: '300px' }}><Story /></div>)],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
];

export const Default: Story = { args: { options, placeholder: 'Select a fruit...' } };
export const WithValue: Story = { args: { options, value: 'banana' } };
export const Disabled: Story = { args: { options, value: 'apple', disabled: true } };
export const ErrorState: Story = { args: { options, error: true } };
