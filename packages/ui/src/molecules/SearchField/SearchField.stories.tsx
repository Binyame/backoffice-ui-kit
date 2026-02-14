import type { Meta, StoryObj } from '@storybook/react';
import { SearchField } from './SearchField';

const meta = {
  title: 'Molecules/SearchField',
  component: SearchField,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => (<div style={{ width: '400px' }}><Story /></div>)],
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Search owners...',
    onSearch: (value) => console.log('Searching for:', value),
  },
};

export const WithDefaultValue: Story = {
  args: {
    placeholder: 'Search...',
    defaultValue: 'John Doe',
    onSearch: (value) => console.log('Searching for:', value),
  },
};

export const Loading: Story = {
  args: {
    placeholder: 'Search...',
    loading: true,
    onSearch: (value) => console.log('Searching for:', value),
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Search disabled...',
    disabled: true,
    onSearch: (value) => console.log('Searching for:', value),
  },
};
