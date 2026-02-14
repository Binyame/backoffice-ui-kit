import React from 'react';
import { Button } from '../../atoms/Button';
import styles from './PaginationBar.module.css';

export interface PaginationBarProps {
  /**
   * Current page (1-indexed)
   */
  currentPage: number;

  /**
   * Total number of pages
   */
  totalPages: number;

  /**
   * Total number of items
   */
  totalItems: number;

  /**
   * Items per page
   */
  pageSize: number;

  /**
   * Page change handler
   */
  onPageChange: (page: number) => void;

  /**
   * Page size change handler
   */
  onPageSizeChange?: (pageSize: number) => void;

  /**
   * Available page sizes
   */
  pageSizeOptions?: number[];

  /**
   * Show page size selector
   */
  showPageSize?: boolean;

  /**
   * Show item count
   */
  showItemCount?: boolean;

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Additional CSS class
   */
  className?: string;
}

/**
 * PaginationBar organism - pagination controls with accessibility
 */
export const PaginationBar: React.FC<PaginationBarProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSize = true,
  showItemCount = true,
  loading = false,
  className,
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage || loading) return;
    onPageChange(page);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`${styles.container} ${className || ''}`}>
      {/* Item count */}
      {showItemCount && (
        <div className={styles.itemCount}>
          Showing {startItem}–{endItem} of {totalItems}
        </div>
      )}

      {/* Page size selector */}
      {showPageSize && onPageSizeChange && (
        <div className={styles.pageSizeContainer}>
          <label htmlFor="page-size" className={styles.pageSizeLabel}>
            Items per page:
          </label>
          <select
            id="page-size"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            disabled={loading}
            className={styles.pageSizeSelect}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Pagination controls */}
      <nav className={styles.navigation} aria-label="Pagination">
        <Button
          variant="ghost"
          size="small"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          aria-label="Previous page"
        >
          ← Previous
        </Button>

        <div className={styles.pageNumbers}>
          {pageNumbers.map((page, index) =>
            page === '...' ? (
              <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(page as number)}
                disabled={loading}
                className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )
          )}
        </div>

        <Button
          variant="ghost"
          size="small"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          aria-label="Next page"
        >
          Next →
        </Button>
      </nav>
    </div>
  );
};
