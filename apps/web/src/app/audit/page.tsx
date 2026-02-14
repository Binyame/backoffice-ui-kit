'use client';

import { useState, useEffect } from 'react';
import { AuditLogItem, AuditAction } from '@backoffice-kit/shared';
import {
  DataTable,
  FilterToolbar,
  PaginationBar,
  Badge,
  Button,
  type DataTableColumn,
  type SortDirection,
} from '@backoffice-kit/ui';
import { PageHeader } from '@/components/PageHeader';

// Mock audit log data - in a real app this would come from an API
const generateMockAuditLogs = (): AuditLogItem[] => {
  const actions: AuditAction[] = [AuditAction.Create, AuditAction.Update, AuditAction.Delete];
  const entities = ['owner', 'settings', 'user'];
  const users = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams'];

  const logs: AuditLogItem[] = [];
  for (let i = 0; i < 50; i++) {
    const action = actions[Math.floor(Math.random() * actions.length)];
    const entityType = entities[Math.floor(Math.random() * entities.length)];
    const user = users[Math.floor(Math.random() * users.length)];

    logs.push({
      id: `audit-${i + 1}`,
      action,
      entityType,
      entityId: `entity-${Math.floor(Math.random() * 100)}`,
      userId: `user-${Math.floor(Math.random() * 4) + 1}`,
      userName: user,
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      changes: action === AuditAction.Update
        ? {
            name: { old: 'Old Value', new: 'New Value' },
          }
        : undefined,
    });
  }

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export default function AuditPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: SortDirection }>({
    key: 'timestamp',
    direction: 'desc',
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Load audit logs
  useEffect(() => {
    setTimeout(() => {
      setAuditLogs(generateMockAuditLogs());
      setLoading(false);
    }, 500);
  }, []);

  // Apply filters, search, and sorting
  useEffect(() => {
    let filtered = [...auditLogs];

    // Search filter
    if (searchValue) {
      const search = searchValue.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.userName.toLowerCase().includes(search) ||
          log.entityType.toLowerCase().includes(search) ||
          log.action.toLowerCase().includes(search) ||
          log.entityId.toLowerCase().includes(search)
      );
    }

    // Action filter
    if (filterValues.action) {
      filtered = filtered.filter((log) => log.action === filterValues.action);
    }

    // Entity filter
    if (filterValues.entityType) {
      filtered = filtered.filter((log) => log.entityType === filterValues.entityType);
    }

    // User filter
    if (filterValues.user) {
      filtered = filtered.filter((log) => log.userName === filterValues.user);
    }

    // Sorting
    if (sortConfig.direction) {
      filtered.sort((a, b) => {
        let aValue: any = a[sortConfig.key as keyof AuditLogItem];
        let bValue: any = b[sortConfig.key as keyof AuditLogItem];

        // Handle timestamp sorting
        if (sortConfig.key === 'timestamp') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }

        const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    setFilteredLogs(filtered);
    setCurrentPage(1);
  }, [auditLogs, searchValue, filterValues, sortConfig]);

  const handleClearFilters = () => {
    setSearchValue('');
    setFilterValues({});
  };

  const handleExport = () => {
    alert('Export functionality would download CSV/Excel file');
  };

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Get unique users for filter
  const uniqueUsers = Array.from(new Set(auditLogs.map((log) => log.userName))).sort();

  // Define columns
  const columns: DataTableColumn<AuditLogItem>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      sortable: true,
      width: '20%',
      render: (row) => {
        const date = new Date(row.timestamp);
        return (
          <div>
            <div>{date.toLocaleDateString()}</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              {date.toLocaleTimeString()}
            </div>
          </div>
        );
      },
    },
    {
      key: 'action',
      header: 'Action',
      sortable: true,
      width: '12%',
      render: (row) => {
        const variants: Record<AuditAction, 'success' | 'warning' | 'danger' | 'default'> = {
          [AuditAction.Create]: 'success',
          [AuditAction.Update]: 'warning',
          [AuditAction.Delete]: 'danger',
          [AuditAction.View]: 'default',
        };
        return <Badge variant={variants[row.action]}>{row.action}</Badge>;
      },
    },
    {
      key: 'entity',
      header: 'Entity',
      sortable: true,
      width: '15%',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{row.entityType}</div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{row.entityId}</div>
        </div>
      ),
    },
    {
      key: 'user',
      header: 'User',
      sortable: true,
      width: '18%',
      render: (row) => (
        <div>
          <div>{row.userName}</div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{row.userId}</div>
        </div>
      ),
    },
    {
      key: 'changes',
      header: 'Details',
      width: '35%',
      render: (row) => {
        if (row.changes) {
          const firstKey = Object.keys(row.changes)[0];
          const change = row.changes[firstKey];
          return (
            <div style={{ fontSize: '0.75rem' }}>
              <div>Before: {JSON.stringify(change.old)}</div>
              <div>After: {JSON.stringify(change.new)}</div>
            </div>
          );
        }
        return <span style={{ color: '#9ca3af' }}>—</span>;
      },
    },
  ];

  if (loading) {
    return (
      <div>
        <PageHeader title="Audit Logs" description="Loading..." />
        <div style={{ padding: '3rem', textAlign: 'center' }}>Loading audit logs...</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        description="Track all system activities and changes"
      />

      <FilterToolbar
        searchValue={searchValue}
        searchPlaceholder="Search logs..."
        onSearch={setSearchValue}
        filters={[
          {
            key: 'action',
            label: 'Action',
            options: [
              { value: AuditAction.Create, label: 'Create' },
              { value: AuditAction.Update, label: 'Update' },
              { value: AuditAction.Delete, label: 'Delete' },
            ],
            placeholder: 'All actions',
          },
          {
            key: 'entityType',
            label: 'Entity',
            options: [
              { value: 'owner', label: 'Owner' },
              { value: 'settings', label: 'Settings' },
              { value: 'user', label: 'User' },
            ],
            placeholder: 'All entities',
          },
          {
            key: 'user',
            label: 'User',
            options: uniqueUsers.map((user) => ({ value: user, label: user })),
            placeholder: 'All users',
          },
        ]}
        filterValues={filterValues}
        onFilterChange={(key, value) => setFilterValues({ ...filterValues, [key]: value })}
        onClearFilters={handleClearFilters}
        actions={
          <Button variant="secondary" onClick={handleExport}>
            Export
          </Button>
        }
      />

      <DataTable
        data={paginatedLogs}
        columns={columns}
        rowKey={(row) => row.id}
        sortConfig={sortConfig}
        onSortChange={(key, direction) => setSortConfig({ key, direction })}
        emptyState={{
          icon: '📋',
          title: 'No audit logs found',
          description: searchValue || Object.keys(filterValues).length > 0
            ? 'Try adjusting your search or filters'
            : 'Audit logs will appear here once actions are performed',
        }}
      />

      {filteredLogs.length > 0 && (
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredLogs.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[10, 25, 50, 100]}
        />
      )}
    </div>
  );
}
