import React from 'react';
import { SearchField } from '../../molecules/SearchField';
import { Select } from '../../atoms/Select';
import { Button } from '../../atoms/Button';
import { Badge } from '../../atoms/Badge';
import styles from './FilterToolbar.module.css';

export interface FilterOption {
  key: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export interface FilterToolbarProps {
  /**
   * Search value
   */
  searchValue?: string;

  /**
   * Search placeholder
   */
  searchPlaceholder?: string;

  /**
   * Search handler
   */
  onSearch?: (value: string) => void;

  /**
   * Filter options configuration
   */
  filters?: FilterOption[];

  /**
   * Current filter values
   */
  filterValues?: Record<string, string>;

  /**
   * Filter change handler
   */
  onFilterChange?: (key: string, value: string) => void;

  /**
   * Clear all filters handler
   */
  onClearFilters?: () => void;

  /**
   * Show clear filters button
   */
  showClearFilters?: boolean;

  /**
   * Action buttons (e.g., Add New, Export)
   */
  actions?: React.ReactNode;

  /**
   * Additional CSS class
   */
  className?: string;
}

/**
 * FilterToolbar organism - search and filter controls for data tables
 */
export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchValue = '',
  searchPlaceholder = 'Search...',
  onSearch,
  filters = [],
  filterValues = {},
  onFilterChange,
  onClearFilters,
  showClearFilters = true,
  actions,
  className,
}) => {
  const activeFilterCount = Object.values(filterValues).filter((v) => v !== '').length;
  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.leftSection}>
        {/* Search */}
        {onSearch && (
          <div className={styles.searchContainer}>
            <SearchField
              value={searchValue}
              placeholder={searchPlaceholder}
              onSearch={onSearch}
            />
          </div>
        )}

        {/* Filters */}
        {filters.length > 0 && (
          <div className={styles.filters}>
            {filters.map((filter) => (
              <div key={filter.key} className={styles.filterItem}>
                <Select
                  value={filterValues[filter.key] || ''}
                  onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
                  options={[
                    { value: '', label: filter.placeholder || `All ${filter.label}` },
                    ...filter.options,
                  ]}
                  aria-label={filter.label}
                />
              </div>
            ))}
          </div>
        )}

        {/* Clear filters */}
        {showClearFilters && hasActiveFilters && onClearFilters && (
          <div className={styles.clearFilters}>
            <Button variant="ghost" size="small" onClick={onClearFilters}>
              Clear filters
              <Badge variant="primary" size="small">
                {activeFilterCount}
              </Badge>
            </Button>
          </div>
        )}
      </div>

      {/* Actions */}
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
};
