import React, { useState } from 'react';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import { EmptyState } from '../../molecules/EmptyState';
import styles from './DataTable.module.css';

export type SortDirection = 'asc' | 'desc' | null;

export interface DataTableColumn<T> {
  /**
   * Unique key for the column
   */
  key: string;

  /**
   * Column header text
   */
  header: string;

  /**
   * Function to render cell content
   */
  render: (row: T, index: number) => React.ReactNode;

  /**
   * Whether this column is sortable
   */
  sortable?: boolean;

  /**
   * Width of the column (CSS value)
   */
  width?: string;

  /**
   * Align cell content
   */
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  /**
   * Array of data to display
   */
  data: T[];

  /**
   * Column definitions
   */
  columns: DataTableColumn<T>[];

  /**
   * Unique key extractor for rows
   */
  rowKey: (row: T, index: number) => string;

  /**
   * Enable row selection
   */
  selectable?: boolean;

  /**
   * Selected row keys
   */
  selectedKeys?: string[];

  /**
   * Selection change handler
   */
  onSelectionChange?: (selectedKeys: string[]) => void;

  /**
   * Sort configuration
   */
  sortConfig?: {
    key: string;
    direction: SortDirection;
  };

  /**
   * Sort change handler
   */
  onSortChange?: (key: string, direction: SortDirection) => void;

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
   * Row click handler
   */
  onRowClick?: (row: T, index: number) => void;

  /**
   * Additional CSS class
   */
  className?: string;
}

/**
 * DataTable organism - comprehensive table with sorting, selection, and accessibility
 */
export function DataTable<T>({
  data,
  columns,
  rowKey,
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
  sortConfig,
  onSortChange,
  loading = false,
  emptyState,
  onRowClick,
  className,
}: DataTableProps<T>) {
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<string[]>([]);

  const currentSelectedKeys = onSelectionChange ? selectedKeys : internalSelectedKeys;
  const handleSelectionChange = onSelectionChange || setInternalSelectedKeys;

  const handleSelectAll = () => {
    if (currentSelectedKeys.length === data.length) {
      handleSelectionChange([]);
    } else {
      handleSelectionChange(data.map((row, index) => rowKey(row, index)));
    }
  };

  const handleSelectRow = (key: string) => {
    if (currentSelectedKeys.includes(key)) {
      handleSelectionChange(currentSelectedKeys.filter((k) => k !== key));
    } else {
      handleSelectionChange([...currentSelectedKeys, key]);
    }
  };

  const handleSort = (key: string) => {
    if (!onSortChange) return;

    let newDirection: SortDirection = 'asc';
    if (sortConfig?.key === key) {
      if (sortConfig.direction === 'asc') {
        newDirection = 'desc';
      } else if (sortConfig.direction === 'desc') {
        newDirection = null;
      }
    }
    onSortChange(key, newDirection);
  };

  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) return '↕';
    if (sortConfig.direction === 'asc') return '↑';
    if (sortConfig.direction === 'desc') return '↓';
    return '↕';
  };

  const isAllSelected = data.length > 0 && currentSelectedKeys.length === data.length;
  const isSomeSelected = currentSelectedKeys.length > 0 && !isAllSelected;

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
    <div className={`${styles.tableContainer} ${className || ''}`}>
      <table className={styles.table} role="table">
        <thead>
          <tr>
            {selectable && (
              <th className={styles.checkboxCell}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = isSomeSelected;
                    }
                  }}
                  onChange={handleSelectAll}
                  aria-label="Select all rows"
                  className={styles.checkbox}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className={`${styles.headerCell} ${column.align ? styles[`align-${column.align}`] : ''}`}
                style={{ width: column.width }}
              >
                {column.sortable ? (
                  <button
                    className={styles.sortButton}
                    onClick={() => handleSort(column.key)}
                    aria-label={`Sort by ${column.header}`}
                    aria-sort={
                      sortConfig?.key === column.key
                        ? sortConfig.direction === 'asc'
                          ? 'ascending'
                          : sortConfig.direction === 'desc'
                          ? 'descending'
                          : 'none'
                        : 'none'
                    }
                  >
                    {column.header}
                    <span className={styles.sortIcon}>{getSortIcon(column.key)}</span>
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className={styles.loadingCell}>
                Loading...
              </td>
            </tr>
          ) : (
            data.map((row, index) => {
              const key = rowKey(row, index);
              const isSelected = currentSelectedKeys.includes(key);

              return (
                <tr
                  key={key}
                  className={`${styles.row} ${isSelected ? styles.selected : ''} ${
                    onRowClick ? styles.clickable : ''
                  }`}
                  onClick={() => onRowClick?.(row, index)}
                  role={onRowClick ? 'button' : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      onRowClick(row, index);
                    }
                  }}
                >
                  {selectable && (
                    <td className={styles.checkboxCell}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectRow(key);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Select row ${index + 1}`}
                        className={styles.checkbox}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`${styles.cell} ${column.align ? styles[`align-${column.align}`] : ''}`}
                    >
                      {column.render(row, index)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
