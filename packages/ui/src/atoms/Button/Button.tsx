import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps {
  /**
   * Button content
   */
  children: React.ReactNode;

  /**
   * Visual style variant
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';

  /**
   * Button size
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Loading state - shows spinner and disables interaction
   */
  loading?: boolean;

  /**
   * Button type attribute
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Accessible label for screen readers (use when children is icon-only)
   */
  'aria-label'?: string;
}

/**
 * Primary UI button component following accessible patterns
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'medium',
      disabled = false,
      loading = false,
      type = 'button',
      onClick,
      className,
      'aria-label': ariaLabel,
    },
    ref
  ) => {
    const classNames = [
      styles.button,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      loading && styles.loading,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        className={classNames}
        disabled={disabled || loading}
        onClick={onClick}
        aria-label={ariaLabel}
        aria-busy={loading}
      >
        {loading && <span className={styles.spinner} aria-hidden="true" />}
        <span className={loading ? styles.content : undefined}>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
