import React from 'react';
import styles from './Spinner.module.css';

export interface SpinnerProps {
  /**
   * Spinner size
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Spinner color variant
   */
  variant?: 'primary' | 'white' | 'gray';

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Accessible label for screen readers
   */
  'aria-label'?: string;
}

/**
 * Spinner component for loading states
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = 'medium',
  variant = 'primary',
  className,
  'aria-label': ariaLabel = 'Loading',
}) => {
  const classNames = [
    styles.spinner,
    styles[`size-${size}`],
    styles[`variant-${variant}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classNames}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      <span className={styles.visuallyHidden}>{ariaLabel}</span>
    </div>
  );
};

Spinner.displayName = 'Spinner';
