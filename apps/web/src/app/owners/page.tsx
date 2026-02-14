'use client';

import { useState, useEffect } from 'react';
import { Owner, OwnerRole } from '@backoffice-kit/shared';
import {
  EditableRowTable,
  FilterToolbar,
  PaginationBar,
  Button,
  Badge,
  Toast,
  ConfirmDialog,
  type EditableColumn,
} from '@backoffice-kit/ui';
import { PageHeader } from '@/components/PageHeader';
import { ownersApi } from '@/lib/api';

export default function OwnersPage() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [filteredOwners, setFilteredOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Add owner dialog state
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newOwner, setNewOwner] = useState({
    name: '',
    email: '',
    ownershipPercentage: '',
    role: OwnerRole.Shareholder,
  });

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

  // Load owners from API
  useEffect(() => {
    loadOwners();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...owners];

    // Search filter
    if (searchValue) {
      const search = searchValue.toLowerCase();
      filtered = filtered.filter(
        (owner) =>
          owner.name.toLowerCase().includes(search) ||
          owner.email.toLowerCase().includes(search)
      );
    }

    // Role filter
    if (filterValues.role) {
      filtered = filtered.filter((owner) => owner.role === filterValues.role);
    }

    setFilteredOwners(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [owners, searchValue, filterValues]);

  const loadOwners = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ownersApi.getOwners();
      setOwners(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load owners');
      showToast('Failed to load owners', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOwner = async (id: string, updatedOwner: Owner) => {
    try {
      const result = await ownersApi.updateOwner(id, {
        name: updatedOwner.name,
        email: updatedOwner.email,
        ownershipPercentage: Number(updatedOwner.ownershipPercentage),
        role: updatedOwner.role,
      });
      setOwners((prev) => prev.map((o) => (o.id === id ? result : o)));
      showToast('Owner updated successfully', 'success');
    } catch (err) {
      showToast('Failed to update owner', 'error');
      throw err; // Re-throw to keep edit mode active
    }
  };

  const handleDeleteOwner = async (id: string) => {
    try {
      await ownersApi.deleteOwner(id);
      setOwners((prev) => prev.filter((o) => o.id !== id));
      showToast('Owner deleted successfully', 'success');
    } catch (err) {
      showToast('Failed to delete owner', 'error');
    }
  };

  const handleCreateOwner = async () => {
    try {
      const result = await ownersApi.createOwner({
        name: newOwner.name,
        email: newOwner.email,
        ownershipPercentage: Number(newOwner.ownershipPercentage),
        role: newOwner.role,
      });
      setOwners((prev) => [...prev, result]);
      setShowAddDialog(false);
      setNewOwner({
        name: '',
        email: '',
        ownershipPercentage: '',
        role: OwnerRole.Shareholder,
      });
      showToast('Owner created successfully', 'success');
    } catch (err) {
      showToast('Failed to create owner', 'error');
    }
  };

  const showToast = (message: string, variant: 'success' | 'error') => {
    setToast({ message, variant });
  };

  const handleClearFilters = () => {
    setSearchValue('');
    setFilterValues({});
  };

  // Pagination
  const totalPages = Math.ceil(filteredOwners.length / pageSize);
  const paginatedOwners = filteredOwners.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Calculate total ownership
  const totalOwnership = owners.reduce(
    (sum, owner) => sum + owner.ownershipPercentage,
    0
  );

  // Define editable columns
  const columns: EditableColumn<Owner>[] = [
    {
      key: 'name',
      header: 'Name',
      field: 'name',
      type: 'text',
      width: '25%',
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
      width: '25%',
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
      width: '20%',
      options: [
        { value: OwnerRole.CEO, label: 'CEO' },
        { value: OwnerRole.CFO, label: 'CFO' },
        { value: OwnerRole.CTO, label: 'CTO' },
        { value: OwnerRole.Shareholder, label: 'Shareholder' },
        { value: OwnerRole.Advisor, label: 'Advisor' },
      ],
      render: (value) => <Badge variant="primary">{value}</Badge>,
    },
    {
      key: 'ownership',
      header: 'Ownership %',
      field: 'ownershipPercentage',
      type: 'number',
      width: '15%',
      render: (value) => `${value}%`,
      validate: (value) => {
        const num = Number(value);
        if (isNaN(num) || num < 0 || num > 100) return 'Must be between 0 and 100';
        return null;
      },
    },
    {
      key: 'created',
      header: 'Created',
      field: 'createdAt',
      width: '15%',
      editable: false,
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  if (loading) {
    return (
      <div>
        <PageHeader title="Company Owners" description="Loading..." />
        <div style={{ padding: '3rem', textAlign: 'center' }}>Loading owners...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader title="Company Owners" description="Error loading data" />
        <div
          style={{
            padding: '2rem',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            color: '#991b1b',
            margin: '1rem 0',
          }}
        >
          <strong>Error:</strong> {error}
          <div style={{ marginTop: '1rem' }}>
            <Button onClick={loadOwners}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <PageHeader
          title="Company Owners"
          description={`Manage company ownership structure. Total ownership: ${totalOwnership}%`}
        />
        <Button onClick={() => setShowAddDialog(true)}>Add Owner</Button>
      </div>

      {totalOwnership > 100 && (
        <div
          style={{
            marginBottom: '1rem',
            padding: '1rem',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            color: '#991b1b',
          }}
        >
          <strong>Warning:</strong> Total ownership exceeds 100% ({totalOwnership}%)
        </div>
      )}

      <FilterToolbar
        searchValue={searchValue}
        searchPlaceholder="Search by name or email..."
        onSearch={setSearchValue}
        filters={[
          {
            key: 'role',
            label: 'Role',
            options: [
              { value: OwnerRole.CEO, label: 'CEO' },
              { value: OwnerRole.CFO, label: 'CFO' },
              { value: OwnerRole.CTO, label: 'CTO' },
              { value: OwnerRole.Shareholder, label: 'Shareholder' },
              { value: OwnerRole.Advisor, label: 'Advisor' },
            ],
            placeholder: 'All roles',
          },
        ]}
        filterValues={filterValues}
        onFilterChange={(key, value) => setFilterValues({ ...filterValues, [key]: value })}
        onClearFilters={handleClearFilters}
      />

      <EditableRowTable
        data={paginatedOwners}
        columns={columns}
        rowKey={(row) => row.id}
        onUpdate={handleUpdateOwner}
        onDelete={handleDeleteOwner}
        emptyState={{
          icon: '👥',
          title: 'No owners found',
          description: searchValue || Object.keys(filterValues).length > 0
            ? 'Try adjusting your search or filters'
            : 'Get started by adding your first owner',
        }}
      />

      {filteredOwners.length > 0 && (
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredOwners.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      )}

      {showAddDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
          }}>
            <h2 style={{ marginTop: 0 }}>Add New Owner</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Name *</label>
                <input
                  type="text"
                  value={newOwner.name}
                  onChange={(e) => setNewOwner({ ...newOwner, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '1rem',
                  }}
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email *</label>
                <input
                  type="email"
                  value={newOwner.email}
                  onChange={(e) => setNewOwner({ ...newOwner, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '1rem',
                  }}
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Ownership % *</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={newOwner.ownershipPercentage}
                  onChange={(e) => setNewOwner({ ...newOwner, ownershipPercentage: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '1rem',
                  }}
                  placeholder="Enter percentage"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Role *</label>
                <select
                  value={newOwner.role}
                  onChange={(e) => setNewOwner({ ...newOwner, role: e.target.value as OwnerRole })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '1rem',
                  }}
                >
                  <option value={OwnerRole.CEO}>CEO</option>
                  <option value={OwnerRole.CFO}>CFO</option>
                  <option value={OwnerRole.CTO}>CTO</option>
                  <option value={OwnerRole.Shareholder}>Shareholder</option>
                  <option value={OwnerRole.Advisor}>Advisor</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowAddDialog(false);
                    setNewOwner({
                      name: '',
                      email: '',
                      ownershipPercentage: '',
                      role: OwnerRole.Shareholder,
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateOwner}
                  disabled={!newOwner.name || !newOwner.email || !newOwner.ownershipPercentage}
                >
                  Add Owner
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toast
        message={toast?.message || ''}
        variant={toast?.variant || 'info'}
        isVisible={toast !== null}
        onClose={() => setToast(null)}
        duration={3000}
      />
    </div>
  );
}
