import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FilterToolbar } from './FilterToolbar';
import { Button } from '../../atoms/Button';

const meta = {
  title: 'Organisms/FilterToolbar',
  component: FilterToolbar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof FilterToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive with all features
export const Interactive: Story = {
  render: () => {
    const [searchValue, setSearchValue] = useState('');
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});

    const filters = [
      {
        key: 'role',
        label: 'Role',
        options: [
          { value: 'ceo', label: 'CEO' },
          { value: 'cto', label: 'CTO' },
          { value: 'cfo', label: 'CFO' },
          { value: 'shareholder', label: 'Shareholder' },
        ],
        placeholder: 'All roles',
      },
      {
        key: 'status',
        label: 'Status',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ],
        placeholder: 'All statuses',
      },
    ];

    return (
      <div>
        <FilterToolbar
          searchValue={searchValue}
          searchPlaceholder="Search owners..."
          onSearch={setSearchValue}
          filters={filters}
          filterValues={filterValues}
          onFilterChange={(key, value) => setFilterValues({ ...filterValues, [key]: value })}
          onClearFilters={() => {
            setSearchValue('');
            setFilterValues({});
          }}
          actions={<Button variant="primary">Add Owner</Button>}
        />
        <div style={{ padding: '1rem', background: '#f9fafb', marginTop: '1rem', borderRadius: '4px' }}>
          <strong>Current State:</strong>
          <pre style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            {JSON.stringify({ searchValue, filterValues }, null, 2)}
          </pre>
        </div>
      </div>
    );
  },
};

// Search only
export const SearchOnly: Story = {
  args: {
    searchPlaceholder: 'Search...',
    onSearch: (value) => console.log('Search:', value),
  },
};

// With filters
export const WithFilters: Story = {
  args: {
    searchPlaceholder: 'Search owners...',
    onSearch: (value) => console.log('Search:', value),
    filters: [
      {
        key: 'role',
        label: 'Role',
        options: [
          { value: 'ceo', label: 'CEO' },
          { value: 'cto', label: 'CTO' },
          { value: 'cfo', label: 'CFO' },
        ],
      },
      {
        key: 'status',
        label: 'Status',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ],
      },
    ],
    filterValues: {},
    onFilterChange: (key, value) => console.log('Filter changed:', key, value),
  },
};

// With active filters
export const WithActiveFilters: Story = {
  args: {
    searchPlaceholder: 'Search owners...',
    onSearch: (value) => console.log('Search:', value),
    filters: [
      {
        key: 'role',
        label: 'Role',
        options: [
          { value: 'ceo', label: 'CEO' },
          { value: 'cto', label: 'CTO' },
        ],
      },
      {
        key: 'status',
        label: 'Status',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ],
      },
    ],
    filterValues: { role: 'ceo', status: 'active' },
    onFilterChange: (key, value) => console.log('Filter changed:', key, value),
    onClearFilters: () => console.log('Clear filters'),
  },
};

// With actions
export const WithActions: Story = {
  args: {
    searchPlaceholder: 'Search...',
    onSearch: (value) => console.log('Search:', value),
    actions: (
      <>
        <Button variant="secondary">Export</Button>
        <Button variant="primary">Add New</Button>
      </>
    ),
  },
};

// Filters only (no search)
export const FiltersOnly: Story = {
  args: {
    filters: [
      {
        key: 'category',
        label: 'Category',
        options: [
          { value: 'finance', label: 'Finance' },
          { value: 'operations', label: 'Operations' },
          { value: 'sales', label: 'Sales' },
        ],
      },
      {
        key: 'priority',
        label: 'Priority',
        options: [
          { value: 'high', label: 'High' },
          { value: 'medium', label: 'Medium' },
          { value: 'low', label: 'Low' },
        ],
      },
    ],
    filterValues: {},
    onFilterChange: (key, value) => console.log('Filter changed:', key, value),
  },
};
