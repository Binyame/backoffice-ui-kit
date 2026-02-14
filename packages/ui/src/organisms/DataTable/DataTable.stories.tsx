import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DataTable, SortDirection } from './DataTable';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';

interface SampleData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  percentage: number;
}

const sampleData: SampleData[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'CEO', status: 'active', percentage: 35 },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'CTO', status: 'active', percentage: 25 },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'CFO', status: 'inactive', percentage: 20 },
  { id: '4', name: 'Alice Williams', email: 'alice@example.com', role: 'Shareholder', status: 'active', percentage: 15 },
  { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Advisor', status: 'active', percentage: 5 },
];

const meta = {
  title: 'Organisms/DataTable',
  component: DataTable,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof DataTable<SampleData>>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic table
export const Basic: Story = {
  args: {
    data: sampleData,
    columns: [
      { key: 'name', header: 'Name', render: (row) => row.name },
      { key: 'email', header: 'Email', render: (row) => row.email },
      { key: 'role', header: 'Role', render: (row) => row.role },
      {
        key: 'status',
        header: 'Status',
        render: (row) => (
          <Badge variant={row.status === 'active' ? 'success' : 'default'}>
            {row.status}
          </Badge>
        ),
      },
      { key: 'percentage', header: 'Ownership %', render: (row) => `${row.percentage}%`, align: 'right' },
    ],
    rowKey: (row) => row.id,
  },
};

// With sorting
export const WithSorting: Story = {
  render: () => {
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: SortDirection }>({
      key: 'name',
      direction: 'asc',
    });

    const sortedData = [...sampleData].sort((a, b) => {
      if (!sortConfig.direction) return 0;
      const aValue = a[sortConfig.key as keyof SampleData];
      const bValue = b[sortConfig.key as keyof SampleData];
      const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return (
      <DataTable
        data={sortedData}
        columns={[
          { key: 'name', header: 'Name', render: (row) => row.name, sortable: true },
          { key: 'email', header: 'Email', render: (row) => row.email, sortable: true },
          { key: 'role', header: 'Role', render: (row) => row.role, sortable: true },
          { key: 'percentage', header: 'Ownership %', render: (row) => `${row.percentage}%`, sortable: true, align: 'right' },
        ]}
        rowKey={(row) => row.id}
        sortConfig={sortConfig}
        onSortChange={(key, direction) => setSortConfig({ key, direction })}
      />
    );
  },
};

// With selection
export const WithSelection: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

    return (
      <div>
        <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '4px' }}>
          Selected: {selectedKeys.length} row(s)
        </div>
        <DataTable
          data={sampleData}
          columns={[
            { key: 'name', header: 'Name', render: (row) => row.name },
            { key: 'email', header: 'Email', render: (row) => row.email },
            { key: 'role', header: 'Role', render: (row) => row.role },
          ]}
          rowKey={(row) => row.id}
          selectable
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        />
      </div>
    );
  },
};

// With row click
export const WithRowClick: Story = {
  render: () => {
    const [clickedRow, setClickedRow] = useState<SampleData | null>(null);

    return (
      <div>
        {clickedRow && (
          <div style={{ marginBottom: '1rem', padding: '1rem', background: '#eff6ff', borderRadius: '4px' }}>
            Clicked: {clickedRow.name} ({clickedRow.email})
          </div>
        )}
        <DataTable
          data={sampleData}
          columns={[
            { key: 'name', header: 'Name', render: (row) => row.name },
            { key: 'email', header: 'Email', render: (row) => row.email },
            { key: 'role', header: 'Role', render: (row) => row.role },
          ]}
          rowKey={(row) => row.id}
          onRowClick={(row) => setClickedRow(row)}
        />
      </div>
    );
  },
};

// Empty state
export const Empty: Story = {
  args: {
    data: [],
    columns: [
      { key: 'name', header: 'Name', render: (row) => row.name },
      { key: 'email', header: 'Email', render: (row) => row.email },
    ],
    rowKey: (row) => row.id,
    emptyState: {
      icon: '👥',
      title: 'No owners found',
      description: 'Get started by adding your first owner.',
      action: <Button variant="primary">Add Owner</Button>,
    },
  },
};

// Loading state
export const Loading: Story = {
  args: {
    data: sampleData,
    columns: [
      { key: 'name', header: 'Name', render: (row) => row.name },
      { key: 'email', header: 'Email', render: (row) => row.email },
    ],
    rowKey: (row) => row.id,
    loading: true,
  },
};
