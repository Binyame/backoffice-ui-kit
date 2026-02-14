import React, { useState } from 'react';
import { Button } from '../../atoms/Button';
import { TextInput } from '../../atoms/TextInput';
import { Select } from '../../atoms/Select';
import { ConfirmDialog } from '../../molecules/ConfirmDialog';
import { EmptyState } from '../../molecules/EmptyState';
import styles from './EditableRowTable.module.css';

export type EditableColumnType = 'text' | 'email' | 'number' | 'select';

export interface EditableColumn<T> {
  /**
   * Unique key for the column
   */
  key: string;

  /**
   * Column header text
   */
  header: string;

  /**
   * Field key in the data object
   */
  field: keyof T;

  /**
   * Column type (for editing)
   */
  type?: EditableColumnType;

  /**
   * Select options (if type is 'select')
   */
  options?: Array<{ value: string; label: string }>;

  /**
   * Custom render function for read mode
   */
  render?: (value: any, row: T, index: number) => React.ReactNode;

  /**
   * Width of the column
   */
  width?: string;

  /**
   * Whether this column is editable
   */
  editable?: boolean;

  /**
   * Validation function
   */
  validate?: (value: any) => string | null;
}

export interface EditableRowTableProps<T> {
  /**
   * Array of data to display
   */
  data: T[];

  /**
   * Column definitions
   */
  columns: EditableColumn<T>[];

  /**
   * Unique key extractor for rows
   */
  rowKey: (row: T) => string;

  /**
   * Update handler
   */
  onUpdate: (key: string, updatedRow: T) => void;

  /**
   * Delete handler
   */
  onDelete?: (key: string) => void;

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Empty state configuration
   */
  emptyState?: {
    icon?: string;
    title: string;
    description?: string;
    action?: React.ReactNode;
  };

  /**
   * Additional CSS class
   */
  className?: string;
}

/**
 * EditableRowTable organism - table with inline editing and row-level actions
 */
export function EditableRowTable<T extends Record<string, any>>({
  data,
  columns,
  rowKey,
  onUpdate,
  onDelete,
  loading = false,
  emptyState,
  className,
}: EditableRowTableProps<T>) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingRow, setEditingRow] = useState<T | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  const handleEdit = (row: T) => {
    setEditingKey(rowKey(row));
    setEditingRow({ ...row });
    setErrors({});
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditingRow(null);
    setErrors({});
  };

  const handleSave = () => {
    if (!editingRow || !editingKey) return;

    // Validate
    const newErrors: Record<string, string> = {};
    columns.forEach((column) => {
      if (column.validate && column.editable !== false) {
        const error = column.validate(editingRow[column.field]);
        if (error) {
          newErrors[column.key] = error;
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onUpdate(editingKey, editingRow);
    handleCancel();
  };

  const handleFieldChange = (field: keyof T, value: any) => {
    if (!editingRow) return;
    setEditingRow({ ...editingRow, [field]: value });
    // Clear error for this field
    const column = columns.find((col) => col.field === field);
    if (column && errors[column.key]) {
      setErrors({ ...errors, [column.key]: '' });
    }
  };

  const handleDelete = (key: string) => {
    if (onDelete) {
      onDelete(key);
    }
    setDeletingKey(null);
  };

  const renderCell = (column: EditableColumn<T>, row: T, index: number, isEditing: boolean) => {
    const value = row[column.field];

    if (!isEditing || column.editable === false) {
      if (column.render) {
        return column.render(value, row, index);
      }
      return <span>{String(value ?? '')}</span>;
    }

    // Editing mode
    const error = errors[column.key];

    if (column.type === 'select' && column.options) {
      return (
        <div className={styles.editCell}>
          <Select
            value={String(value)}
            onChange={(e) => handleFieldChange(column.field, e.target.value)}
            options={column.options}
            error={!!error}
            aria-invalid={!!error}
            aria-describedby={error ? `${column.key}-error` : undefined}
          />
          {error && (
            <span id={`${column.key}-error`} className={styles.errorText}>
              {error}
            </span>
          )}
        </div>
      );
    }

    return (
      <div className={styles.editCell}>
        <TextInput
          type={(column.type as any) || 'text'}
          value={String(value ?? '')}
          onChange={(e) => handleFieldChange(column.field, e.target.value)}
          error={!!error}
          aria-invalid={!!error}
          aria-describedby={error ? `${column.key}-error` : undefined}
        />
        {error && (
          <span id={`${column.key}-error`} className={styles.errorText}>
            {error}
          </span>
        )}
      </div>
    );
  };

  if (!loading && data.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        {emptyState ? (
          <EmptyState
            icon={emptyState.icon}
            title={emptyState.title}
            description={emptyState.description}
            action={emptyState.action}
          />
        ) : (
          <EmptyState title="No data" description="No records to display" />
        )}
      </div>
    );
  }

  return (
    <>
      <div className={`${styles.tableContainer} ${className || ''}`}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={styles.headerCell} style={{ width: column.width }}>
                  {column.header}
                </th>
              ))}
              <th className={styles.actionsHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className={styles.loadingCell}>
                  Loading...
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const key = rowKey(row);
                const isEditing = editingKey === key;
                const displayRow = isEditing ? editingRow! : row;

                return (
                  <tr key={key} className={`${styles.row} ${isEditing ? styles.editing : ''}`}>
                    {columns.map((column) => (
                      <td key={column.key} className={styles.cell}>
                        {renderCell(column, displayRow, index, isEditing)}
                      </td>
                    ))}
                    <td className={styles.actionsCell}>
                      {isEditing ? (
                        <div className={styles.editActions}>
                          <Button variant="primary" size="small" onClick={handleSave}>
                            Save
                          </Button>
                          <Button variant="ghost" size="small" onClick={handleCancel}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className={styles.rowActions}>
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => handleEdit(row)}
                            disabled={editingKey !== null}
                          >
                            Edit
                          </Button>
                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="small"
                              onClick={() => setDeletingKey(key)}
                              disabled={editingKey !== null}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation dialog */}
      {onDelete && (
        <ConfirmDialog
          isOpen={deletingKey !== null}
          onCancel={() => setDeletingKey(null)}
          onConfirm={() => deletingKey && handleDelete(deletingKey)}
          title="Delete Row"
          message="Are you sure you want to delete this row? This action cannot be undone."
          confirmText="Delete"
          confirmVariant="danger"
        />
      )}
    </>
  );
}
