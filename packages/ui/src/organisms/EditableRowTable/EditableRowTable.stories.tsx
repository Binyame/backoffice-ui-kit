import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EditableRowTable } from './EditableRowTable';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';

interface Owner {
  id: string;
  name: string;
  email: string;
  role: string;
  ownershipPercentage: number;
}

const initialData: Owner[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'CEO', ownershipPercentage: 35 },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'CTO', ownershipPercentage: 25 },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'CFO', ownershipPercentage: 20 },
];

const meta = {
  title: 'Organisms/EditableRowTable',
  component: EditableRowTable,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof EditableRowTable<Owner>>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive demo
export const Interactive: Story = {
  render: () => {
    const [data, setData] = useState<Owner[]>(initialData);

    const handleUpdate = (key: string, updatedRow: Owner) => {
      setData(data.map((row) => (row.id === key ? updatedRow : row)));
    };

    const handleDelete = (key: string) => {
      setData(data.filter((row) => row.id !== key));
    };

    return (
      <EditableRowTable
        data={data}
        columns={[
          {
            key: 'name',
            header: 'Name',
            field: 'name',
            type: 'text',
            validate: (value) => {
              if (!value || value.length < 2) return 'Name must be at least 2 characters';
              return null;
            },
          },
          {
            key: 'email',
            header: 'Email',
            field: 'email',
            type: 'email',
            validate: (value) => {
              if (!value || !value.includes('@')) return 'Invalid email address';
              return null;
            },
          },
          {
            key: 'role',
            header: 'Role',
            field: 'role',
            type: 'select',
            options: [
              { value: 'CEO', label: 'CEO' },
              { value: 'CTO', label: 'CTO' },
              { value: 'CFO', label: 'CFO' },
              { value: 'Shareholder', label: 'Shareholder' },
            ],
          },
          {
            key: 'ownership',
            header: 'Ownership %',
            field: 'ownershipPercentage',
            type: 'number',
            render: (value) => `${value}%`,
            validate: (value) => {
              const num = Number(value);
              if (isNaN(num) || num < 0 || num > 100) return 'Must be between 0 and 100';
              return null;
            },
          },
        ]}
        rowKey={(row) => row.id}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    );
  },
};

// Basic (read-only columns)
export const WithReadOnlyColumns: Story = {
  render: () => {
    const [data, setData] = useState<Owner[]>(initialData);

    return (
      <EditableRowTable
        data={data}
        columns={[
          {
            key: 'id',
            header: 'ID',
            field: 'id',
            editable: false,
          },
          {
            key: 'name',
            header: 'Name',
            field: 'name',
            type: 'text',
          },
          {
            key: 'email',
            header: 'Email',
            field: 'email',
            type: 'email',
          },
          {
            key: 'role',
            header: 'Role',
            field: 'role',
            type: 'select',
            options: [
              { value: 'CEO', label: 'CEO' },
              { value: 'CTO', label: 'CTO' },
            ],
          },
        ]}
        rowKey={(row) => row.id}
        onUpdate={(key, row) => setData(data.map((r) => (r.id === key ? row : r)))}
      />
    );
  },
};

// Without delete
export const WithoutDelete: Story = {
  args: {
    data: initialData,
    columns: [
      { key: 'name', header: 'Name', field: 'name', type: 'text' },
      { key: 'email', header: 'Email', field: 'email', type: 'email' },
      { key: 'role', header: 'Role', field: 'role', type: 'text' },
    ],
    rowKey: (row) => row.id,
    onUpdate: (key, row) => console.log('Update:', key, row),
  },
};

// Empty state
export const Empty: Story = {
  args: {
    data: [],
    columns: [
      { key: 'name', header: 'Name', field: 'name', type: 'text' },
      { key: 'email', header: 'Email', field: 'email', type: 'email' },
    ],
    rowKey: (row) => row.id,
    onUpdate: () => {},
    emptyState: {
      icon: '👥',
      title: 'No owners',
      description: 'Add your first owner to get started',
      action: <Button variant="primary">Add Owner</Button>,
    },
  },
};

// Loading state
export const Loading: Story = {
  args: {
    data: initialData,
    columns: [
      { key: 'name', header: 'Name', field: 'name', type: 'text' },
      { key: 'email', header: 'Email', field: 'email', type: 'email' },
    ],
    rowKey: (row) => row.id,
    onUpdate: () => {},
    loading: true,
  },
};

// With custom rendering
export const WithCustomRender: Story = {
  render: () => {
    const [data, setData] = useState<Owner[]>(initialData);

    return (
      <EditableRowTable
        data={data}
        columns={[
          {
            key: 'name',
            header: 'Name',
            field: 'name',
            type: 'text',
          },
          {
            key: 'email',
            header: 'Email',
            field: 'email',
            type: 'email',
          },
          {
            key: 'role',
            header: 'Role',
            field: 'role',
            type: 'select',
            options: [
              { value: 'CEO', label: 'CEO' },
              { value: 'CTO', label: 'CTO' },
              { value: 'CFO', label: 'CFO' },
            ],
            render: (value) => <Badge variant="primary">{value}</Badge>,
          },
          {
            key: 'ownership',
            header: 'Ownership',
            field: 'ownershipPercentage',
            type: 'number',
            render: (value) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  style={{
                    width: '60px',
                    height: '8px',
                    background: '#e5e7eb',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${value}%`,
                      height: '100%',
                      background: '#0066cc',
                    }}
                  />
                </div>
                <span>{value}%</span>
              </div>
            ),
          },
        ]}
        rowKey={(row) => row.id}
        onUpdate={(key, row) => setData(data.map((r) => (r.id === key ? row : r)))}
        onDelete={(key) => setData(data.filter((r) => r.id !== key))}
      />
    );
  },
};
